import { Request, Response, NextFunction } from "express";
import z from "zod";
import { ValidationError, NotFoundError, ApiError, errorHandler } from "../middleware/error.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

const createSeriesSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    coverUrl: z.string(),
});

export async function getSeries(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = "1", limit = "20" } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const [series, total] = await Promise.all([
            db.series.findMany({
                skip,
                take: limitNum,
                include: {
                    episodes: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            cover_url: true,
                            duration: true,
                            created_at: true,
                        },
                        orderBy: { created_at: 'asc' },
                    },
                },
                orderBy: { created_at: 'desc' },
            }),
            db.series.count(),
        ]);

        return res.status(200).json({
            series,
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

export async function getSeriesById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const series = await db.series.findUnique({
            where: { id: parseInt(id) },
            include: {
                episodes: {
                    include: {
                        category: true,
                    },
                    orderBy: { created_at: 'asc' },
                },
            },
        });

        if (!series) {
            throw new NotFoundError("Series not found");
        }

        return res.status(200).json(series);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function getSeriesBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;

        const series = await db.series.findUnique({
            where: { slug },
            include: {
                episodes: {
                    include: {
                        category: true,
                    },
                    orderBy: { created_at: 'asc' },
                },
            },
        });

        if (!series) {
            throw new NotFoundError("Series not found");
        }

        return res.status(200).json(series);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function createSeries(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = createSeriesSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ValidationError(validation.error.message);
        }

        const data = validation.data;

        // Generate slug
        const baseSlug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let slug = baseSlug;
        let counter = 1;

        while (await db.series.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const series = await db.series.create({
            data: {
                name: data.name,
                description: data.description,
                cover_url: data.coverUrl,
                slug,
            },
        });

        return res.status(201).json(series);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function updateSeries(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const validation = createSeriesSchema.partial().safeParse(req.body);

        if (!validation.success) {
            throw new ValidationError(validation.error.message);
        }

        const data = validation.data;

        const existingSeries = await db.series.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingSeries) {
            throw new NotFoundError("Series not found");
        }

        // Update slug if name changed
        let slug = existingSeries.slug;
        if (data.name && data.name !== existingSeries.name) {
            const baseSlug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            slug = baseSlug;
            let counter = 1;

            while (await db.series.findFirst({
                where: { slug, NOT: { id: parseInt(id) } }
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        const series = await db.series.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                slug,
            },
        });

        return res.status(200).json(series);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function deleteSeries(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const series = await db.series.findUnique({
            where: { id: parseInt(id) },
        });

        if (!series) {
            throw new NotFoundError("Series not found");
        }

        await db.series.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({
            message: "Series deleted successfully",
        });
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await db.category.findMany({
            include: {
                _count: {
                    select: {
                        videos: true,
                    }
                }
            },
            orderBy: { type: 'asc' },
        });

        return res.status(200).json(categories);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}

export async function createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { type } = req.body;

        if (!type || typeof type !== 'string') {
            throw new ValidationError("Category type is required");
        }

        const category = await db.category.create({
            data: { type },
        });

        return res.status(201).json(category);
    } catch (err) {
        return errorHandler(err as ApiError, req, res, next);
    }
}