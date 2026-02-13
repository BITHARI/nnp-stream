import { ImageUploadData, ImageUploadResponse, UploadStatus, VideoUploadData, VideoUploadResponse } from "./types";
import api, { getAuthHeaders } from "./api";

export async function uploadImage(data: ImageUploadData): Promise<ImageUploadResponse> {
    const response = await api.post<ImageUploadResponse>('/upload/image', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function createVideoUpload(data: VideoUploadData): Promise<VideoUploadResponse> {
    const response = await api.post<VideoUploadResponse>('/upload/video', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function getUploadStatus(uploadId: string): Promise<UploadStatus> {
    const response = await api.get<UploadStatus>(`/upload/video/${uploadId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function cancelUpload(uploadId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/upload/video/${uploadId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}