import { Prisma } from '@/generated/prisma/client.js';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: ApiError | ZodError | Prisma.PrismaClientKnownRequestError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Invalid request data',
            details: err.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'A record with this data already exists',
                    field: err.meta?.target
                });

            case 'P2025':
                return res.status(404).json({
                    error: 'Not found',
                    message: 'The requested record was not found'
                });

            case 'P2003':
                return res.status(400).json({
                    error: 'Foreign key constraint',
                    message: 'Referenced record does not exist'
                });

            default:
                return res.status(500).json({
                    error: 'Database error',
                    message: 'An error occurred while processing your request'
                });
        }
    }

    // Custom API errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.name || 'Error',
            message: err.message
        });
    }

    // Default server error
    return res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong on our end'
            : err.message
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`
    });
};

export interface HandledError {
    statusCode: number;
}
export class ValidationError extends Error implements HandledError {
    statusCode = 400;
    constructor(message: string) {
        super(message);
        this.name = 'Erreur de validation des données';
    }
}

export class NotFoundError extends Error implements HandledError {
    statusCode = 404;
    constructor(message: string = 'Resource not found') {
        super(message);
        this.name = 'Ressource non trouvée';
    }
}

export class UnauthorizedError extends Error implements HandledError {
    statusCode = 401;
    constructor(message: string = 'Unauthorized') {
        super(message);
        this.name = 'Accès réservé';
    }
}

export class ForbiddenError extends Error implements HandledError {
    statusCode = 403;
    constructor(message: string = 'Forbidden') {
        super(message);
        this.name = 'Accès interdit';
    }
}

export class ConflictError extends Error implements HandledError {
    statusCode = 409;
    constructor(message: string = 'Conflict') {
        super(message);
        this.name = 'Conflit';
    }
}