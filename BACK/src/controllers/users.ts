import { db } from "@/lib/db.js";
import { generatePassword } from "@/lib/passwordGenerator.js";
import { sendAccountCreationEmail } from "@/lib/utils.js";
import { AuthenticatedRequest } from "@/middleware/auth.js";
import { ApiError, errorHandler, ForbiddenError, ValidationError } from "@/middleware/error.js";
import bcrypt from "bcryptjs";
import { Response, NextFunction } from "express";

export async function getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("Not authorized");
        const {
            page = 1,
            limit = 20,
            search,
        } = req.query;
        const skip = (Number(page) - 1) * Number(limit)
        const where: any = {};
        if (req.user.userRole === 'ADMIN') {
            where.userRole = 'VIEWER';
        }
        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: "insensitive" } },
                { email: { contains: search as string, mode: "insensitive" } },
            ];
        }
        const users = await db.user.findMany({
            where,
            take: Number(limit),
            skip,
        });
        return res.status(200).json({
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function createUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("Not authorized");
        const { name, email } = req.body;
        if (!name || !email) throw new ValidationError('Le nom et l\'email de l\'utilisateur sont requis');
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if (existingUser) throw new ValidationError('Un utilisateur avec cet email existe déjà');
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },

        })
        await sendAccountCreationEmail(name, email, password)
        return res.status(201).json(user);
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("Not authorized");
        const { id } = req.params;
        const user = await db.user.findUnique({
            where: { id },
        });
        return res.status(200).json(user);
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function toggleActivateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("Not authorized");
        const { id } = req.params;
        const user = await db.user.findUnique({
            where: { id },
        });
        if (!user) throw new ValidationError('Utilisateur non trouvé');
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                isActive: !user.isActive,
            },
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("Not authorized");
        const { id } = req.params;
        await db.user.delete({
            where: { id },
        });
        return res.status(204).send();
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}