import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/db.js';
import { ForbiddenError, HandledError } from './error.js';
import { UserRole } from '@/generated/prisma/client.js';

export type User = {
    id: string;
    email: string;
    name?: string;
    userRole: UserRole;
    isActive: boolean;
    password?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export async function authenticate(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const sessionToken = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

        if (!sessionToken) throw new ForbiddenError("Missing session token");

        const session = await db.session.findUnique({
            where: { token: sessionToken },
            select: {
                user: true
            }
        })

        if (!session?.user) throw new ForbiddenError("Invalid session token");

        const dbUser = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                userRole: true,
                isActive: true
            }
        });

        if (!dbUser) {
            res.status(401).json({
                error: 'User not found',
                message: 'User account no longer exists'
            });
            return;
        }

        if (!dbUser.isActive) {
            res.status(403).json({
                error: 'Account suspended',
                message: 'Your account has been suspended'
            });
            return;
        }

        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || undefined,
            userRole: dbUser.userRole,
            isActive: dbUser.isActive,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status((error as HandledError).statusCode || 500).json({
            error: 'Authentication failed',
            message: (error as Error).message || "An unknown error occurred during authentication"
        });
        return;
    }
};

export async function trySetUser(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const sessionToken = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

        if (!sessionToken) return next();

        const session = await db.session.findUnique({
            where: { token: sessionToken },
            select: {
                user: true
            }
        })

        if (!session?.user) return next();

        const dbUser = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                userRole: true,
                isActive: true
            }
        });

        if (!dbUser) return next();

        if (!dbUser.isActive) return next();

        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || undefined,
            userRole: dbUser.userRole,
            isActive: dbUser.isActive,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status((error as HandledError).statusCode || 500).json({
            error: 'Authentication failed',
            message: (error as Error).message || "An unknown error occurred during authentication"
        });
        return;
    }
};

export function authorize(roles: UserRole[]) {
    return (req: Request & { user?: User }, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required',
                message: 'User not authenticated'
            });
            return;
        }

        if (!roles.includes(req.user.userRole)) {
            res.status(403).json({
                error: 'Insufficient permissions',
                message: `This action requires one of the following roles: ${roles.join(', ')}`
            });
            return;
        }
        next();
    };
};

export const requireSuperAdmin = authorize([UserRole.SUPERADMIN])
export const requireAdmin = authorize([UserRole.ADMIN, UserRole.SUPERADMIN]);
export const requireViewer = authorize([UserRole.VIEWER]);