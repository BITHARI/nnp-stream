import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';

const mediaDir = path.join(process.cwd(), 'media');
const subDirs: string[] = ['videoCovers'];

if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
}

subDirs.forEach(dir => {
    const subDir = path.join(mediaDir, dir);
    if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(mediaDir, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const tempName = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, tempName);
    }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP and SVG images are allowed.'));
    }
};

// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    }
});

// Middleware for single file upload
export const uploadSingle = upload.single('image');

// Helper function to rename file with proper name
export async function renameUploadedFile(
    oldPath: string,
    modelType: 'videoCovers',
    title: string,
    id: string
): Promise<string> {
    const ext = path.extname(oldPath);
    const parsedTitle = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim()
        .substring(0, 50); // Limit length

    const newFilename = `${parsedTitle}-${id.substring(0, 8)}${ext}`;
    const newPath = path.join(process.cwd(), 'media', modelType, newFilename);

    await fs.promises.rename(oldPath, newPath);

    return `/media/${modelType}/${newFilename}`;
}

// Helper function to delete file
export async function deleteFile(filePath: string): Promise<void> {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error('Failed to delete file:', error);
    }
}