import { authenticate, requireAdmin, requireSuperAdmin, trySetUser } from '../middleware/auth.js';
import { Router } from 'express';
import * as uploadController from '../controllers/uploads.js';
import * as videoController from '../controllers/videos.js';
import * as reactionsController from '../controllers/reactions.js';
import * as seriesController from '../controllers/series.js';
import * as usersController from '../controllers/users.js';
import * as notesQoEController from '../controllers/notesQoE.js';
import { uploadSingle } from '@/middleware/upload.js';

const router = Router();

// ============== UPLOAD ROUTES ==============
router.post('/upload/video', authenticate, uploadController.createVideoUpload);
router.get('/upload/video/:uploadId', authenticate, uploadController.getUploadStatus);
router.delete('/upload/video/:uploadId', authenticate, uploadController.cancelUpload);

// ============== VIDEO ROUTES ==============
router.get('/videos', trySetUser, videoController.getVideos);
router.get('/videos/:id', trySetUser, videoController.getVideo);
router.get('/videos/slug/:slug', trySetUser, videoController.getVideoBySlug);
router.get('/videos/related/:videoId', trySetUser, videoController.getRelatedVideos);
router.post('/videos', authenticate, requireAdmin, uploadSingle, videoController.createVideo);
router.put('/videos/:id', authenticate, uploadSingle, videoController.updateVideo);
router.delete('/videos/:id', authenticate, videoController.deleteVideo);
router.post('/videos/:id/like', authenticate, reactionsController.reactToVideo);

// ============== COMMENT ROUTES ==============
router.get('/videos/:videoId/comments', trySetUser, reactionsController.getComments);
router.post('/comments', authenticate, reactionsController.createComment);
router.patch('/comments/:id', authenticate, reactionsController.updateComment);
router.delete('/comments/:id', authenticate, reactionsController.deleteComment);

// ============== FAVORITE ROUTES ==============
router.get('/favorites', authenticate, reactionsController.getFavorites);
router.post('/favorites', authenticate, reactionsController.addFavorite);
router.delete('/favorites/:videoId', authenticate, reactionsController.removeFavorite);
router.get('/favorites/check/:videoId', authenticate, reactionsController.checkFavorite);

// ============== SERIES ROUTES ==============
router.get('/series', trySetUser, seriesController.getSeries);
router.get('/series/:id', trySetUser, seriesController.getSeriesById);
router.get('/series/slug/:slug', trySetUser, seriesController.getSeriesBySlug);
router.post('/series', authenticate, seriesController.createSeries);
router.patch('/series/:id', authenticate, seriesController.updateSeries);
router.delete('/series/:id', authenticate, seriesController.deleteSeries);

// ============== CATEGORY ROUTES ==============
router.get('/categories', trySetUser, seriesController.getCategories);
router.post('/categories', authenticate, seriesController.createCategory);

// ============== USER ROUTES ==============
router.get('/users', authenticate, requireAdmin, usersController.getUsers);
router.post('/users', authenticate, requireSuperAdmin, usersController.createUser);
router.get('/users/:id', authenticate, requireAdmin, usersController.getUserById);
router.patch('/users/:id/toggle-activate', authenticate, requireSuperAdmin, usersController.toggleActivateUser);
router.delete('/users/:id', authenticate, requireSuperAdmin, usersController.deleteUser);

// ============== NOTE QoE ROUTES ==============
router.post('/notes-qoe', authenticate, notesQoEController.addNoteQoE);
router.get('/notes-qoe', authenticate, requireAdmin, notesQoEController.getNotesQoE);
router.get('/notes-qoe/stats', authenticate, requireAdmin, notesQoEController.getNotesQoEStats);

export default router;