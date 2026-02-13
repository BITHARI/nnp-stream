import type { PaginationResponse, PaginationParams, Video, GetVideosParams, CreateVideoData, UpdateVideoData, Comment, CreateCommentData, UpdateCommentData, Favorite } from './types';
import api, { getAuthHeaders } from './api';

export async function getVideos(
    params?: GetVideosParams
): Promise<{ videos: Video[]; pagination: PaginationResponse }> {
    const response = await api.get<{ videos: Video[]; pagination: PaginationResponse }>('/videos', {
        params
    });
    return response.data;
}

export async function getRelatedVideos({ params, videoId }: { params?: PaginationParams, videoId: string }): Promise<{ videos: Video[], pagination: PaginationResponse }> {
    const response = await api.get<{ videos: Video[], pagination: PaginationResponse }>(`/videos/related/${videoId}`, {
        params
    });
    return response.data;
}

export async function getVideo(id: string): Promise<Video> {
    const response = await api.get<Video>(`/videos/${id}`);
    return response.data;
}

export async function getVideoBySlug(slug: string): Promise<Video> {
    const response = await api.get<Video>(`/videos/slug/${slug}`);
    return response.data;
}

export async function createVideo(data: CreateVideoData): Promise<Video> {
    const response = await api.post<Video>('/videos', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function updateVideo(id: string, data: UpdateVideoData): Promise<Video> {
    const response = await api.patch<Video>(`/videos/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function deleteVideo(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/videos/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function likeVideo(id: string): Promise<{ likes: number }> {
    const response = await api.post<{ likes: number }>(`/videos/${id}/like`);
    return response.data;
}

// ============== COMMENT API ==============

export async function getComments(
    videoId: string,
    params?: PaginationParams
): Promise<{ comments: Comment[]; pagination: PaginationResponse }> {
    const response = await api.get<{ comments: Comment[]; pagination: PaginationResponse }>(
        `/videos/${videoId}/comments`,
        { params }
    );
    return response.data;
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
    const response = await api.post<Comment>('/comments', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function updateComment(id: string, data: UpdateCommentData): Promise<Comment> {
    const response = await api.patch<Comment>(`/comments/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function deleteComment(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/comments/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

// ============== FAVORITE API ==============

export async function getFavorites(
    params?: PaginationParams
): Promise<{ favorites: Favorite[]; pagination: PaginationResponse }> {
    const response = await api.get<{ favorites: Favorite[]; pagination: PaginationResponse }>(
        '/favorites',
        {
            params,
            headers: getAuthHeaders(),
        }
    );
    return response.data;
}

export async function addFavorite(videoId: string): Promise<Favorite> {
    const response = await api.post<Favorite>('/favorites', { videoId: videoId }, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function removeFavorite(videoId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/favorites/${videoId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function checkFavorite(videoId: string): Promise<{ isFavorited: boolean }> {
    const response = await api.get<{ isFavorited: boolean }>(`/favorites/check/${videoId}`, {
        headers: getAuthHeaders(),
    });
    return response.data
}