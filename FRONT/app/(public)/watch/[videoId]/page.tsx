'use client'

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { SavedVideo } from "@/utils/type";
import { MUX_ENVIRONMENT_KEY } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { formatViews } from "@/utils/format";
import { useParams } from "next/navigation";
import { WatchSEO } from "./_components/WatchSEO";
import CommentSection from "./_components/CommentSection";
import { useAuth } from "@/providers/AuthProvider";
import AnimatedCounter from "@/components/ui/animated-counter";
import { toast } from "sonner";
import { addFavorite, checkFavorite, getRelatedVideos, getVideoBySlug, removeFavorite } from "@/services/video";
import { getCategories } from "@/services/categories";
import VideoHCard from "@/components/cards/VideoHCard";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
    ssr: false,
});

dayjs.extend(relativeTime);
dayjs.extend(duration);

type CurrentVideo = SavedVideo & {
    favorites: { created_at: string; users: { clerk_id: string; email: string; id: string }; id: string }[];
};

export default function WatchPage() {
    const { user } = useAuth();
    const params = useParams();

    const { data: currentVideo } = useQuery({
        queryKey: ["get-current-video", params?.videoId],
        queryFn: () => getVideoBySlug(params?.videoId as string),
        enabled: !!params?.videoId,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    });

    const { data: categories } = useQuery({
        queryKey: ["videoTypes"],
        queryFn: getCategories,
    });

    const { data: isFavorited } = useQuery({
        queryKey: ["check-favorite", currentVideo?.id],
        queryFn: () => checkFavorite(currentVideo?.id as string),
        enabled: !!currentVideo?.id
    })
    const [likeCount, setLikeCount] = useState(currentVideo?.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const { data: relatedVideos } = useQuery({
        queryKey: ["get-related-video", currentVideo?.slug],
        queryFn: () => getRelatedVideos({ videoId: currentVideo?.slug as string }),
        enabled: !!currentVideo?.slug,
    });

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentVideo?.title,
                    text: currentVideo?.description,
                    url: window.location.href,
                });
                toast.success("Video copied successfully!");
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.info("Video copied successfully!");
        }
    };

    const handleLike = async () => {
        if (!currentVideo?.id) return;
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        if (isLiked) {
            if (user) {
                await removeFavorite(currentVideo.id);
            }
            return;
        }
        if (user) {
            await addFavorite(currentVideo.id);
        }
    };

    return (
        <>
            <WatchSEO currentVideo={currentVideo} />
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 md:px-6 lg:gap-6 mt-18 lg:mt-20 max-md:mx-4 max-w-[2000px] mx-auto">
                <div className="space-y-4 md:col-span-2 lg:col-span-3">
                    <div className="w-full flex flex-col gap-4">
                        <div className="relative aspect-video w-full lg:h-[70dvh] bg-nnp-primary-dark rounded-lg overflow-hidden">
                            {currentVideo && (
                                <MuxPlayer
                                    playbackId={currentVideo.playback_id}
                                    metadataVideoTitle={currentVideo.title}
                                    metadataVideoId={currentVideo.mux_asset_id}
                                    metadata-viewer-user-id="Placeholder (optional)"
                                    primary-color="#ffffff"
                                    secondary-color="#000000"
                                    envKey={MUX_ENVIRONMENT_KEY}
                                    accent-color="#DD8300"
                                    autoPlay={true}
                                    className="w-full lg:h-[70dvh]"
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                            <h1 className="text-white font-bold text-lg sm:text-xl lg:text-2xl max-w-3xl">{currentVideo?.title}</h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-300">
                                <span className="flex items-center gap-1 text-xs sm:text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <AnimatedCounter
                                        value={currentVideo?.views || 0}
                                        formatValue={(value: any) => {
                                            const formattedViews = formatViews(value);
                                            return value > 1
                                                ? `${formattedViews} vues`
                                                : `${formattedViews} vue`;
                                        }}
                                        duration={800}
                                    />
                                </span>

                                <span className="flex items-center gap-1 text-xs sm:text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {currentVideo ? dayjs(currentVideo.created_at).fromNow() : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-nnp-primary-dark/50 backdrop-blur-sm text-white rounded-xl p-4 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${isLiked
                                    ? "bg-nnp-highlight text-black"
                                    : "bg-nnp-primary-dark/50 text-white hover:bg-nnp-primary-dark"
                                    }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={isLiked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span className="font-medium text-sm">{likeCount}</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-nnp-primary-dark/50 text-white hover:bg-nnp-primary-dark transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                <span className="font-medium text-sm">{"Partager"}</span>
                            </button>
                        </div>

                        <div className="text-gray-200 prose text-sm sm:text-base leading-relaxed">
                            {currentVideo?.description}
                        </div>
                    </div>
                    <div className="w-full mt-2 container-2xl">
                        {currentVideo && <CommentSection videoId={currentVideo?.id || ""} />}
                    </div>
                </div>
                <div className="lg:col-span-2">

                    {relatedVideos && relatedVideos.videos.length > 0 && (
                        <div>
                            <h3 className="text-white font-semibold text-base sm:text-lg mb-4">{"Videos similaires"}</h3>
                            <div className="space-y-4">
                                {relatedVideos.videos.map((video: any) => {
                                    return <div key={video.id}>
                                        <VideoHCard video={video} className="px-0" />
                                    </div>
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
