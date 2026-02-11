import { Request, Response, NextFunction } from "express";
import Mux from '@mux/mux-node';
import { ValidationError, NotFoundError, ApiError, errorHandler, ForbiddenError } from "../middleware/error.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { ensureUniqueSlug, generateSlug } from "@/utils/slug.js";
import { deleteFile, renameUploadedFile } from "@/middleware/upload.js";
import z from "zod";
import fs from 'fs/promises';

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// ============== SCHEMAS ==============
const createVideoSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    coverUrl: z.string(),
    categoryId: z.string().uuid(),
    type: z.enum(["free", "premium"]),
    seriesId: z.number().optional(),
    isPromoted: z.boolean().default(false),
    muxAssetId: z.string(),
});

const updateVideoSchema = createVideoSchema.partial();

const listIncludeStatement = {
    category: true,
    series: true,
    author: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            created_at: true,
        }
    },
    _count: {
        select: {
            comments: true,
            favorites: true,
        }
    }
}
// ============== GET VIDEOS ==============
export async function getVideos(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            page = "1",
            limit = "20",
            category,
            type,
            seriesId,
            promoted,
            search
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (category) where.category_id = category;
        if (type) where.type = type;
        if (seriesId) where.series_id = seriesId;
        if (promoted === "true") where.is_promoted = true;
        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const [videos, total] = await Promise.all([
            db.video.findMany({
                where,
                skip,
                take: limitNum,
                include: listIncludeStatement,
                orderBy: { created_at: 'desc' },
            }),
            db.video.count({ where }),
        ]);

        // Format response to match frontend types
        const formattedVideos = videos.map(video => ({
            id: video.id,
            created_at: video.created_at.toISOString(),
            title: video.title,
            description: video.description,
            cover_url: video.cover_url,
            categories: video.category.type,
            type: video.type,
            duration: video.duration,
            mux_asset_id: video.mux_asset_id,
            playback_id: video.playback_id,
            likes: video.likes,
            views: video.views,
            slug: video.slug,
            is_promoted: video.is_promoted,
            series_id: video.series_id?.toString(),
        }));

        return res.status(200).json({
            videos: formattedVideos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

// ============== GET SINGLE VIDEO ==============
export async function getVideo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const video = await db.video.findUnique({
            where: { id },
            include: {
                category: true,
                series: {
                    include: {
                        episodes: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                cover_url: true,
                                duration: true,
                                created_at: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        created_at: true,
                    }
                },
            },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        // Increment views
        await db.video.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        return res.status(200).json(video);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

// ============== GET VIDEO BY SLUG ==============
export async function getVideoBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;

        const video = await db.video.findUnique({
            where: { slug },
            include: {
                category: true,
                series: {
                    include: {
                        episodes: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                cover_url: true,
                                duration: true,
                                created_at: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        created_at: true,
                    }
                },
            },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        await db.video.update({
            where: { slug },
            data: { views: { increment: 1 } },
        });

        return res.status(200).json(video);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function getRelatedVideos(req: Request, res: Response, next: NextFunction) {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ValidationError("Video ID is required");
        }
        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
        })
        if (!video) {
            throw new NotFoundError("Video not found");
        }
        const {
            page = "1",
            limit = "3"
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;
        const categoryId = video?.category_id

        const videos = await db.video.findMany({
            where: {
                category_id: categoryId,
                id: { not: videoId },
                slug: { not: video.slug },
            },
            take: limitNum,
            skip,
            include: listIncludeStatement,
            orderBy: { created_at: 'desc' },
        })
        return res.status(200).json({
            videos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: videos.length,
                totalPages: Math.ceil(videos.length / limitNum),
            }
        })
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

// ============== CREATE VIDEO ==============
export async function createVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        if (!req.file) {
            throw new ValidationError("Image file is required");
        }
        const validation = createVideoSchema.safeParse({
            ...req.body,
            cover_url: 'temp/',
        });
        if (!validation.success) {
            await fs.unlink(req.file.path).catch(() => { });
            throw new ValidationError(validation.error.message);
        }

        const data = validation.data;

        const asset = await mux.video.assets.retrieve(data.muxAssetId);

        if (asset.status !== 'ready') {
            throw new ValidationError("Video is still processing. Please wait.");
        }

        // Get playback ID
        const playbackId = asset.playback_ids?.[0]?.id;
        if (!playbackId) {
            throw new ValidationError("No playback ID found for this video");
        }

        const baseSlug = generateSlug(data.title);
        const existingSlugs = await db.video.findMany({
            where: { slug: { startsWith: baseSlug } },
            select: { slug: true }
        }).then(posts => posts.map(p => p.slug));

        const slug = ensureUniqueSlug(baseSlug, existingSlugs);

        const durationSeconds = asset.duration || 0;
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const video = await db.video.create({
            data: {
                ...data,
                title: data.title,
                description: data.description,
                cover_url: data.coverUrl,
                category_id: data.categoryId,
                type: data.type,
                series_id: data.seriesId,
                is_promoted: data.isPromoted,
                mux_asset_id: data.muxAssetId,
                playback_id: playbackId,
                duration,
                slug,
                author_id: req.user!.id,
            },
        });

        const coverUrl = await renameUploadedFile(
            req.file.path,
            'videoCovers',
            data.title,
            video.id
        );

        const updatedVideo = await db.video.update({
            where: { id: video.id },
            data: { cover_url: coverUrl },
            include: {
                category: true,
                series: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        created_at: true,
                    }
                },
            },
        });

        return res.status(201).json(updatedVideo);
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

// ============== UPDATE VIDEO ==============
export async function updateVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const existingVideo = await db.video.findUnique({
            where: { id },
        });

        if (!existingVideo) {
            if (req.file?.path) {
                await fs.unlink(req.file.path).catch(() => { });
            }
            throw new NotFoundError("Video not found");
        }
        const validation = updateVideoSchema.safeParse(req.body);
        if (!validation.success) {
            if (req.file?.path) {
                await fs.unlink(req.file.path).catch(() => { });
            }
            throw new ValidationError(validation.error.message);
        }

        const data = validation.data;

        // Update slug if title changed
        let slug = existingVideo.slug;
        if (data.title && data.title !== existingVideo.title) {
            const baseSlug = generateSlug(data.title);
            const existingSlugs = await db.video.findMany({
                where: {
                    slug: { startsWith: baseSlug },
                    id: { not: id as string }
                },
                select: { slug: true }
            }).then(videos => videos.map(v => v.slug));

            slug = ensureUniqueSlug(baseSlug, existingSlugs);
        }

        const updateData: any = {
            ...data,
            slug,
        };

        const video = await db.video.update({
            where: { id },
            data: updateData
        });

        let coverUrl = video.cover_url;
        if (req.file) {
            await deleteFile(video.cover_url);
            coverUrl = await renameUploadedFile(
                req.file.path,
                'videoCovers',
                data.title || video.title,
                video.id
            );
        }

        const updatedVideo = await db.video.update({
            where: { id },
            data: { cover_url: coverUrl },
            include: {
                category: true,
                series: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        created_at: true,
                    }
                },
            }
        });

        return res.status(200).json(updatedVideo);
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

// ============== DELETE VIDEO ==============
export async function deleteVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const { id } = req.params;

        const video = await db.video.findUnique({
            where: { id },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        // Delete from Mux
        try {
            await mux.video.assets.delete(video.mux_asset_id);
        } catch (error) {
            console.error("Failed to delete from Mux:", error);
            // Continue with deletion even if Mux fails
        }

        await deleteFile(video.cover_url);
        await db.video.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Video deleted successfully",
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}