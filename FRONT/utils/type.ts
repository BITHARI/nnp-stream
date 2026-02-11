export type Category = {
    id: string;
    type: string;
    created_at: string;
    _count?: {
        videos: number;
    }
};

export type SavedVideo = {
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
};

export type Comment = {
    id: string;
    created_at: string;
    content: string;
    video: string;
    author: User;
};

export type Favorite = {
    id: string;
    created_at: string;
    video: SavedVideo;
    user: string;
};

export type User = {
    id: string;
    email: string;
    created_at: string;
    avatar: string;
    name: string;
};

export type Series = {
    id: number;
    name: string;
    description: string;
    cover_url: string;
    created_at: string;
    slug: string;
    episodes?: SavedVideo[];
};
