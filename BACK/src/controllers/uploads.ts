import { Response, NextFunction } from "express";
import z from "zod";
import Mux from '@mux/mux-node';
import { ValidationError, ApiError, errorHandler } from "../middleware/error.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// Initialize Mux
const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// ============== IMAGE UPLOAD ==============
export const imageUploadSchema = z.object({
    fileName: z.string().min(1, { message: "Le fichier est requis" }),
    contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/, {
        message: "Le fichier doit être une image (jpeg, png, webp, gif)"
    }),
    size: z.number().max(10 * 1024 * 1024, { message: "L'image ne doit pas dépasser 10MB" }),
});

// ============== VIDEO UPLOAD (MUX) ==============
export const videoUploadSchema = z.object({
    // Metadata that will be stored later
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    categoryId: z.string(),
    type: z.enum(["free", "premium"]),
    seriesId: z.number().optional(),
    isPromoted: z.boolean().default(false),
});

/**
 * Creates a Mux direct upload URL
 * Frontend will use this URL to upload the video file directly to Mux
 */
export async function createVideoUpload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const validation = videoUploadSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ValidationError(validation.error.message);
        }

        const metadata = validation.data;

        // Create a direct upload in Mux
        const upload = await mux.video.uploads.create({
            cors_origin: process.env.FRONTEND_URL || '*',
            new_asset_settings: {
                playback_policy: ['public'],
                encoding_tier: 'baseline', // or 'smart' for better quality
                mp4_support: 'capped-1080p',
                passthrough: JSON.stringify({
                    userId: req.user?.id,
                    ...metadata,
                }),
            },
        });

        return res.status(200).json({
            uploadUrl: upload.url,
            uploadId: upload.id,
            // Return metadata back to frontend for confirmation
            metadata,
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

/**
 * Get upload status from Mux
 */
export async function getUploadStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { uploadId } = req.params;

        if (!uploadId) {
            throw new ValidationError("Upload ID is required");
        }

        const upload = await mux.video.uploads.retrieve(uploadId);
        console.log(upload)
        if (upload.status !== "asset_created") return res.status(200).json({
            uploadStatus: upload.status,
            assetId: upload.asset_id,
            uploadId: upload.id,
            playbackId: null,
            error: upload.error,
        });
        const asset = await mux.video.assets.retrieve(upload.asset_id!);

        return res.status(200).json({
            uploadStatus: asset.status,
            assetId: upload.asset_id,
            uploadId: upload.id,
            playbackId: asset.playback_ids ? asset.playback_ids[0].id : null,
            error: null
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

/**
 * Cancel an upload
 */
export async function cancelUpload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { uploadId } = req.params;

        if (!uploadId) {
            throw new ValidationError("Upload ID is required");
        }

        await mux.video.uploads.cancel(uploadId);

        return res.status(200).json({
            message: "Upload cancelled successfully",
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}