// ============== SHARED TYPES ==============

export type PaginationParams = {
    page?: number;
    limit?: number;
};

export type PaginationResponse = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

// ============== USER TYPES ==============

export type User = {
    id: string;
    email: string;
    created_at: string;
    name: string;
    image?: string;
};

// ============== CATEGORY TYPES ==============

export type Category = {
    id: string;
    type: string;
    created_at: string;
    _count?: { videos: number };
}

export type CreateCategoryData = {
    type: string;
};

// ============== SERIES TYPES ==============

export type SeriesEpisode = {
    id: string;
    title: string;
    slug: string;
    cover_url: string;
    duration: string;
    created_at: string;
};

export type Series = {
    id: number;
    name: string;
    description: string;
    cover_url: string;
    created_at: string;
    slug: string;
    episodes?: SeriesEpisode[];
};

export type CreateSeriesData = {
    name: string;
    description: string;
    coverUrl: string;
};

export type UpdateSeriesData = Partial<CreateSeriesData>;

// ============== VIDEO TYPES ==============

export type Video = {
    id: string;
    created_at: string;
    title: string;
    description: string;
    cover_url: string;
    categories: string;
    type: string;
    duration: string;
    mux_asset_id: string;
    playback_id: string;
    likes: number;
    views: number;
    slug: string;
    is_promoted?: boolean;
    series_id?: string;
    author?: User;
    category?: Category;
    series?: Series;
};

export type GetVideosParams = PaginationParams & {
    category?: string;
    type?: 'free' | 'premium';
    seriesId?: number;
    excluded?: string;
    promoted?: boolean;
    search?: string;
};

export type CreateVideoData = {
    title: string;
    description: string;
    coverUrl: string;
    categoryId: string;
    type: 'free' | 'premium';
    seriesId?: number;
    isPromoted?: boolean;
    muxAssetId: string;
};

export type UpdateVideoData = Partial<CreateVideoData>;

// ============== COMMENT TYPES ==============

export type Comment = {
    id: string;
    created_at: string;
    updated_at: string;
    content: string;
    video_id: string;
    author: User;
};

export type CreateCommentData = {
    content: string;
    videoId: string;
};

export type UpdateCommentData = {
    content: string;
};

// ============== FAVORITE TYPES ==============

export type Favorite = {
    id: string;
    created_at: string;
    video: Video;
    user_id: string;
};

export type AddFavoriteData = {
    videoId: string;
};

// ============== UPLOAD TYPES ==============

export type ImageUploadData = {
    fileName: string;
    contentType: string;
    size: number;
};

export type ImageUploadResponse = {
    presignedUrl: string;
    key: string;
    publicUrl: string;
};

export type VideoUploadData = {
    title: string;
    description: string;
    categoryId: string;
    type: 'free' | 'premium';
    seriesId?: number;
    isPromoted?: boolean;
};

export type VideoUploadResponse = {
    uploadUrl: string;
    uploadId: string;
    metadata: VideoUploadData;
};

export type UploadStatus = {
    uploadStatus: string;
    assetId?: string;
    uploadId: string;
    error?: string;
};

export type FinalizeVideoData = CreateVideoData;

export type FinalizeVideoResponse = {
    status: 'created' | 'already_exists' | 'processing';
    video?: Video;
    message?: string;
    assetId?: string;
};