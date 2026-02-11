import { db } from "../lib/db.js";
import { ApiError, errorHandler, ForbiddenError, ValidationError } from "../middleware/error.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { passwordRegex, sendResetPasswordEmail, sendVerificationEmail } from "../lib/utils.js";
import { AuthenticatedRequest } from "../middleware/auth.js";


export async function createSession(userId: string) {

    await db.session.updateMany({
        where: {
            user_id: userId,
            hasExpired: false,
        },
        data: {
            hasExpired: true
        }
    })
    const token = crypto.randomBytes(32).toString('hex');
    const session = await db.session.create({
        data: {
            token,
            user_id: userId,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 24 hours
            hasExpired: false
        }
    })
    return session
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) throw new ValidationError('Le nom, l\'email et le mot de passe de l\'utilisateur sont requis');
        if (!passwordRegex.test(password)) throw new ValidationError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
        const existingUser = await db.user.findUnique({
            where: { email }
        });
        if (existingUser) throw new ValidationError('Un utilisateur avec cette adresse email existe déjà');

        const hashedPassword = await bcrypt.hash(password, 12);

        let verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        while (await db.verification.findFirst({ where: { value: verificationToken } })) {
            verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        }

        const result = await db.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    emailVerified: false
                }
            });

            await tx.verification.create({
                data: {
                    identifier: email,
                    value: verificationToken,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return user;
        });
        await sendVerificationEmail(name, email, verificationToken);
        return res.status(201).json({
            success: true,
            message: 'L\'utilisateur a bien été créé. Veuillez verifier votre email pour activer votre compte',
            user: {
                userId: result.id,
                email: result.email,
                name: result.name,
                role: result.userRole,
                createdAt: result.created_at,
            }
        })
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.query;
        const { email } = req.body
        if (!token) throw new ValidationError('Le token est requis');
        const verification = await db.verification.findFirst({
            where: {
                value: token as string,
                identifier: email
            }
        });
        if (!verification) throw new ValidationError('Le token est invalide');
        if (verification.expiresAt < new Date()) throw new ValidationError('Le token a expiré');
        const user = await db.user.update({
            where: { email: verification.identifier },
            data: { emailVerified: true }
        });
        if (!user) throw new ValidationError('Utilisateur introuvable');
        await db.verification.deleteMany({
            where: {
                value: token as string,
                identifier: email
            }
        });
        const session = await createSession(user.id);
        return res.status(200).json({ message: 'Votre compte a bien été activé', session });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new ValidationError('L\'email et le mot de passe sont requis');
        const user = await db.user.findUnique({
            where: { email }
        });
        if (!user) throw new ValidationError('Utilisateur introuvable');
        if (!user.emailVerified) throw new ValidationError('Votre compte n\'a pas encore été activé');
        if (user.password) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) throw new ValidationError('Le mot de passe est incorrect');
        }
        const session = await createSession(user.id);
        return res.status(200).json(session);
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function signOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        await db.session.updateMany({
            where: {
                hasExpired: false,
            },
            data: {
                hasExpired: true
            }
        });
        return res.status(200).json({ message: 'Vous avez bien été deconneté' });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function getAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const sessionToken = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);
        if (!sessionToken) return res.status(200).json({ isAuthenticated: false, user: null, session: null });
        const session = await db.session.findFirst({
            where: {
                token: sessionToken,
                hasExpired: false
            },
            select: {
                user: true,
                token: true,
                user_id: true,
                expires_at: true,
                created_at: true,
            }
        })
        if (!session?.user) return res.status(200).json({ isAuthenticated: false, user: null, session: null });
        if (session.expires_at < new Date()) return res.status(200).json({ isAuthenticated: false, user: null, session: null });
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
        if (!dbUser) return res.status(200).json({ isAuthenticated: false, user: null, session: null });
        if (!dbUser.isActive) return res.status(200).json({ isAuthenticated: false, user: null, session: null });
        return res.status(200).json({ isAuthenticated: true, user: dbUser, session: { ...session, user: undefined } });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new ForbiddenError("User not found");
        const { name } = req.body;
        if (!name || name.length < 3) throw new ValidationError('Le nom doit contenir au moins 3 caractères');
        const user = await db.user.update({
            where: { id: req.user.id },
            data: { name }
        });
        return res.status(200).json(user);
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        ;
        const user = req.user
        if (!user) throw new ForbiddenError("User not found")
        const { password, newPassword } = req.body;
        if (user.password) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) throw new ValidationError('Le mot de passe est incorrect');
        }
        if (!passwordRegex.test(newPassword)) throw new ValidationError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère special');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
        return res.status(200).json({ message: 'Le mot de passe a bien été changé' });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if (!email) throw new ValidationError('L\'email est requis');
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true }
        });
        if (!user) throw new ValidationError('Aucun utilisateur avec cette adresse email n\'a été trouvé');
        let token = Math.floor(100000 + Math.random() * 900000).toString()
        while (await db.verification.findFirst({ where: { value: token } })) {
            token = Math.floor(100000 + Math.random() * 900000).toString()
        }
        await db.verification.create({
            data: {
                value: token,
                identifier: user.email,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
            }
        });
        await sendResetPasswordEmail(user.email, token, user.name);
        return res.status(200).json({ message: 'Un email a bien été envoyé' });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function setNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.query;
        const { newPassword, email } = req.body;
        if (!token) throw new ValidationError('Le token est requis');
        if (!email) throw new ValidationError('L\'email est requis');
        if (!passwordRegex.test(newPassword)) throw new ValidationError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère special');
        const verification = await db.verification.findFirst({
            where: {
                value: token as string,
                identifier: email
            }
        });
        if (!verification) throw new ValidationError('Le token est invalide');
        if (verification.expiresAt < new Date()) throw new ValidationError('Le token a expiré');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const user = await db.user.update({
            where: { email: verification.identifier },
            data: { password: hashedPassword }
        })
        if (!user) throw new ValidationError('Aucun utilisateur avec cette adresse email n\'a été trouvé');
        await db.verification.delete({
            where: { id: verification.id }
        });
        return res.status(200).json({ message: 'Vous avez désormais un nouveau mot de passe pour accéder à votre compte' });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}

export async function resendToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        if (!email) throw new ValidationError('L\'email est requis');
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true }
        });
        if (!user) throw new ValidationError('Aucun utilisateur avec cette adresse email n\'a été trouvé');
        let token = Math.floor(100000 + Math.random() * 900000).toString()
        while (await db.verification.findFirst({ where: { value: token } })) {
            token = Math.floor(100000 + Math.random() * 900000).toString()
        }
        await db.verification.create({
            data: {
                value: token,
                identifier: user.email,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
            }
        });
        await sendResetPasswordEmail(user.email, token, user.name);
        return res.status(200).json({ message: 'Un email a bien été envoyé' });
    } catch (error) {
        errorHandler(error as ApiError, req, res, next);
        return null
    }
}
