import VideoCard from "@/components/cards/VideoCard";
import { useRouter } from "next/router";
import { SavedVideo } from "@/utils/type";

export default function SearchResult({
    isLoading,
    showTitles = false,
    showDescription = false,
    videos,
}: {
    showTitles?: boolean;
    showDescription?: boolean;
    isLoading?: boolean;
    videos: SavedVideo[];
}) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex flex-col">
                <h3 className="text-white font-bold pb-3 z-10">{"Résultats de la recherche"}</h3>
                <div className="flex overflow-x-scroll w-full scrollbar-hide items-center gap-1">
                    {Array.from({ length: 4 }).map((_, index) => {
                        return (
                            <VideoCard onClick={() => null} key={index} videoCoverUrl={""} videoTitle={""} videoDescription={""} />
                        );
                    })}
                </div>
            </div>
        );
    }

    if (videos && videos.length === 0) return <></>;
    return (
        <div className="flex flex-col">
            <h3 className="text-white font-bold pb-3 z-10">{"Résultats de la recherche"}</h3>
            <div className="flex overflow-x-scroll w-full scrollbar-hide items-center gap-1">
                {videos.map((video, index) => {
                    return (
                        <VideoCard
                            onClick={() => router.push(`/watch/${video.slug}`)}
                            key={video.id}
                            showDescription={showDescription}
                            showTitles={showTitles}
                            videoCoverUrl={video.cover_url}
                            videoTitle={video.title}
                            videoDescription={video.description}
                        />
                    );
                })}
            </div>
        </div>
    );
}
