import { useQuery } from "@tanstack/react-query";
import { getVideos } from "@/services/video";
import { useRouter } from "next/navigation";
import VideoCard from "@/components/cards/VideoCard";
import VideoCarousel from "./VideoCarousel";

interface VideoGridProps {
    categoryName: string | null;
    className?: string;
    showTitles?: boolean;
    showDescription?: boolean;
}

export default function VideoGrid({ categoryName, className, showTitles, showDescription }: VideoGridProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["getVideoByCategory", categoryName],
        queryFn: () => getVideos({ category: !!categoryName && categoryName !== "all" ? categoryName : undefined }),
        refetchOnWindowFocus: false,
        retry: false,
    })

    const videos = data?.videos
    const router = useRouter()
    if (isLoading) {
        return (
            <div className={`flex flex-col ${className}`}>
                <div className="relative">
                    <div className="relative">
                        <div className="mobile-scroll-container">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="video-card-mobile">
                                    <div className="animate-pulse bg-white/10 rounded-xl h-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!videos?.length) return null
    return (
        <div>
            <VideoCarousel className={className}>
                {videos?.map((video: any) => (
                    <div key={video.id} className="video-card-mobile">
                        <VideoCard
                            onClick={() => router.push(`/watch/${video.slug}`)}
                            videoCoverUrl={video.cover_url}
                            videoTitle={video.title}
                            videoDescription={video.description}
                            showTitles={showTitles}
                            showDescription={showDescription}
                            className="h-full"
                        />
                    </div>
                ))}
            </VideoCarousel>
        </div>
    )
}
