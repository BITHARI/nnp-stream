import { Request, Response, NextFunction } from "express";
import Mux from '@mux/mux-node';
import crypto from 'crypto';
import { db } from "./db.js";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

/**
 * Verifies Mux webhook signature
 */
function verifyMuxSignature(req: Request): boolean {
    const signature = req.headers['mux-signature'] as string;
    const webhookSecret = process.env.MUX_WEBHOOK_SECRET!;

    if (!signature || !webhookSecret) {
        return false;
    }

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

    return signature === expectedSignature;
}

/**
 * Handles Mux webhooks
 * 
 * Important webhook events:
 * - video.asset.ready: Video is ready for playback
 * - video.asset.errored: Video processing failed
 * - video.upload.asset_created: Upload completed and asset created
 * - video.upload.cancelled: Upload was cancelled
 * - video.upload.errored: Upload failed
 */
export async function handleMuxWebhook(req: Request, res: Response, next: NextFunction) {
    try {
        // Verify webhook signature
        if (!verifyMuxSignature(req)) {
            console.error('Invalid Mux webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const event = req.body;
        console.log('Mux webhook received:', event.type);

        switch (event.type) {
            case 'video.asset.ready':
                await handleAssetReady(event);
                break;

            case 'video.asset.errored':
                await handleAssetErrored(event);
                break;

            case 'video.upload.asset_created':
                await handleUploadCompleted(event);
                break;

            case 'video.upload.cancelled':
                console.log('Upload cancelled:', event.data.id);
                break;

            case 'video.upload.errored':
                console.error('Upload errored:', event.data);
                break;

            default:
                console.log('Unhandled webhook type:', event.type);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook handling error:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
}

/**
 * Handle video.asset.ready event
 * This is called when a video is fully processed and ready for playback
 */
async function handleAssetReady(event: any) {
    const assetId = event.data.id;
    const passthrough = event.data.passthrough ? JSON.parse(event.data.passthrough) : {};

    console.log('Asset ready:', assetId, 'Passthrough:', passthrough);

    // If the video was already created via the API, update it
    const existingVideo = await db.video.findUnique({
        where: { mux_asset_id: assetId },
    });

    if (existingVideo) {
        // Video already exists, just log
        console.log('Video already exists in database:', existingVideo.id);
        return;
    }

    // If passthrough data exists, we can auto-create the video
    // This is useful if you want to create the video record automatically
    // when the upload completes, rather than requiring a separate API call
    if (passthrough.title && passthrough.userId) {
        const asset = await mux.video.assets.retrieve(assetId);
        const playbackId = asset.playback_ids?.[0]?.id;

        if (!playbackId) {
            console.error('No playback ID found for asset:', assetId);
            return;
        }

        // Generate duration
        const durationSeconds = asset.duration || 0;
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Generate slug
        const baseSlug = passthrough.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let slug = baseSlug;
        let counter = 1;

        while (await db.video.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Create video record
        await db.video.create({
            data: {
                title: passthrough.title,
                description: passthrough.description || '',
                cover_url: passthrough.coverUrl || '',
                category_id: passthrough.categoryId,
                type: passthrough.type || 'free',
                series_id: passthrough.seriesId,
                is_promoted: passthrough.isPromoted || false,
                mux_asset_id: assetId,
                playback_id: playbackId,
                duration,
                slug,
                author_id: passthrough.userId,
            },
        });

        console.log('Video auto-created from webhook:', slug);
    }
}

/**
 * Handle video.asset.errored event
 */
async function handleAssetErrored(event: any) {
    const assetId = event.data.id;
    const errors = event.data.errors;

    console.error('Asset processing failed:', assetId, errors);

    // You might want to notify the user or mark the video as failed
    const video = await db.video.findUnique({
        where: { mux_asset_id: assetId },
    });

    if (video) {
        // You could add a 'status' field to your schema to track this
        console.error('Video processing failed for:', video.title);
    }
}

/**
 * Handle video.upload.asset_created event
 * This is called when an upload completes and Mux creates the asset
 */
async function handleUploadCompleted(event: any) {
    const uploadId = event.data.id;
    const assetId = event.data.asset_id;

    console.log('Upload completed:', uploadId, '-> Asset:', assetId);

    // The asset will still need to be processed
    // Wait for video.asset.ready event for the final status
}

/**
 * Route setup for webhook
 * Add this to your routes:
 * 
 * import express from 'express';
 * router.post('/webhooks/mux', 
 *   express.raw({ type: 'application/json' }), 
 *   handleMuxWebhook
 * );
 */