import { Request, Response, NextFunction } from "express";
import z from "zod";
import { ValidationError, ApiError, errorHandler, ForbiddenError } from "../middleware/error.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

const noteQoESchema = z.object({
    comment: z.string().optional(),
    note: z.number().min(0).max(5),
});

export async function addNoteQoE(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const validation = noteQoESchema.safeParse(req.body);
        if (!validation.success) {
            throw new ValidationError(validation.error.message);
        }
        const { comment, note } = validation.data;
        await db.noteQoE.create({
            data: {
                user_id: req.user.id,
                comment,
                note,
            },
        });
        return res.status(200).json({ message: "Note added successfully" });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

export async function getNotesQoE(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const {
            page = 1,
            limit = 20,
            startDate,
            endDate,
        } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where: any = {};
        if (startDate) {
            where.created_at = { gte: new Date(startDate as string) };
        }
        if (endDate) {
            where.created_at = where.created_at || {};
            where.created_at.lte = new Date(endDate as string);
        }
        const notesQoE = await db.noteQoE.findMany({
            where,
            take: Number(limit),
            skip,
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            data: notesQoE,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: await db.noteQoE.count(),
            },
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}

export async function getNotesQoEStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const {
            page = 1,
            limit,
            startDate,
            endDate,
        } = req.query;
        const skip = limit ? (Number(page) - 1) * Number(limit) : undefined;
        const where: any = {};
        if (startDate) {
            where.created_at = { gte: new Date(startDate as string) };
        }
        if (endDate) {
            where.created_at = where.created_at || {};
            where.created_at.lte = new Date(endDate as string);
        }
        const stats = await db.noteQoE.aggregate({
            where,
            take: limit ? Number(limit) : undefined,
            skip,
            _avg: {
                note: true,
            },
            _max: {
                note: true,
            },
            _min: {
                note: true,
            },
            _count: {
                note: true,
            },
        });
        return res.status(200).json({
            averageNote: stats._avg.note,
            maxNote: stats._max.note,
            minNote: stats._min.note,
            totalNotes: stats._count.note,
        });
    } catch (err) {
        errorHandler(err as ApiError, req, res, next);
        return null
    }
}