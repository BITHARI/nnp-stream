import { Request, Response, NextFunction } from "express";
import z from "zod";
import { ValidationError, NotFoundError, ApiError, errorHandler, ForbiddenError } from "../middleware/error.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

// ============== LIKE VIDEO ==============
export async function reactToVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const { id } = req.params;
        const { type } = req.body;
        const video = await db.video.findUnique({
            where: { id },
        });
        if (!video) {
            throw new NotFoundError("Video not found");
        }
        const existingLike = await db.favorite.findUnique({
            where: {
                user_id_video_id: {
                    user_id: req.user.id,
                    video_id: video!.id,
                },
            },
        });
        if (existingLike) {
            throw new ValidationError("You have already liked this video");
        }
        await db.note.create({
            data: {
                user_id: req.user.id,
                video_id: video.id,
                type: type === 'DISLIKE' ? 'DISLIKE' : 'LIKE',
            },
        });

        await db.video.update({
            where: { id: video.id },
            data: { likes: { increment: 1 } },
        });

        return res.status(200).json({ likes: video.likes });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}
const createCommentSchema = z.object({
    content: z.string().min(1).max(1000),
    videoId: z.string().uuid(),
});

export async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const { videoId } = req.params;
        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] }
        })
        if (!video) {
            throw new NotFoundError("Video not found");
        }
        const { page = "1", limit = "20" } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const [comments, total] = await Promise.all([
            db.comment.findMany({
                where: { video_id: video.id },
                skip,
                take: limitNum,
                include: {
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
                orderBy: { created_at: 'desc' },
            }),
            db.comment.count({ where: { video_id: videoId } }),
        ]);

        return res.status(200).json({
            comments,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

export async function createComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const validation = createCommentSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ValidationError(validation.error.message);
        }

        const { content, videoId } = validation.data;

        // Check if video exists
        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        const comment = await db.comment.create({
            data: {
                content,
                video_id: video.id,
                author_id: req.user!.id,
            },
            include: {
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

        return res.status(201).json(comment);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || typeof content !== 'string' || content.length === 0) {
            throw new ValidationError("Content is required");
        }

        const existingComment = await db.comment.findUnique({
            where: { id },
        });

        if (!existingComment) {
            throw new NotFoundError("Comment not found");
        }

        if (existingComment.author_id !== req.user!.id) {
            throw new ForbiddenError("You don't have permission to update this comment");
        }

        const comment = await db.comment.update({
            where: { id },
            data: { content },
            include: {
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

        return res.status(200).json(comment);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const comment = await db.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        if (comment.author_id !== req.user!.id) {
            throw new ForbiddenError("You don't have permission to delete this comment");
        }

        await db.comment.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Comment deleted successfully",
        });
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}


export async function getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { page = "1", limit = "20" } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const [favorites, total] = await Promise.all([
            db.favorite.findMany({
                where: { user_id: req.user!.id },
                skip,
                take: limitNum,
                include: {
                    video: {
                        include: {
                            category: true,
                            series: true,
                        }
                    },
                },
                orderBy: { created_at: 'desc' },
            }),
            db.favorite.count({ where: { user_id: req.user!.id } }),
        ]);

        return res.status(200).json({
            favorites,
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

export async function addFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const { videoId } = req.body;

        if (!videoId) {
            throw new ValidationError("Video ID is required");
        }

        // Check if video exists
        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        // Check if already favorited
        const existing = await db.favorite.findUnique({
            where: {
                user_id_video_id: {
                    user_id: req.user.id,
                    video_id: video.id,
                },
            },
        });

        if (existing) {
            return res.status(200).json(existing);
        }

        const favorite = await db.favorite.create({
            data: {
                user_id: req.user!.id,
                video_id: videoId,
            },
            include: {
                video: {
                    include: {
                        category: true,
                        series: true,
                    }
                },
            },
        });

        await db.video.updateMany({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
            data: { likes: { increment: 1 } },
        });

        return res.status(201).json(favorite);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function removeFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { videoId } = req.params;

        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
        });

        if (!video) {
            throw new NotFoundError("Video not found");
        }

        const favorite = await db.favorite.findUnique({
            where: {
                user_id_video_id: {
                    user_id: req.user!.id,
                    video_id: video.id,
                },
            },
        });

        if (!favorite) {
            throw new NotFoundError("Favorite not found");
        }

        await db.favorite.delete({
            where: {
                user_id_video_id: {
                    user_id: req.user!.id,
                    video_id: video.id,
                },
            },
        });

        await db.video.updateMany({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
            data: { likes: { decrement: 1 } },
        });

        return res.status(200).json({
            message: "Favorite removed successfully",
        });
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function checkFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(200).json({ isFavorited: false });
        };
        const { videoId } = req.params;
        const video = await db.video.findFirst({
            where: { OR: [{ id: videoId }, { slug: videoId }] },
        })
        if (!video) {
            throw new NotFoundError("Video not found");
        }
        const favorite = await db.favorite.findUnique({
            where: {
                user_id_video_id: {
                    user_id: req.user!.id,
                    video_id: video.id,
                },
            },
        });

        return res.status(200).json({
            isFavorited: !!favorite,
        });
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}