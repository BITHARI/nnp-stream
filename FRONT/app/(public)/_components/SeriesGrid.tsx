import { useQuery } from "@tanstack/react-query";
import VideoCard from "@/components/cards/VideoCard";
import { useRouter } from "next/navigation";
import { getSeries } from "@/services/categories";
import VideoCarousel from "./VideoCarousel";

export default function SeriesGrid({ className }: { className?: string }) {
    const { data } = useQuery({
        queryKey: ["series"],
        queryFn: () => getSeries(),
    });
    const series = data?.series || [];
    const router = useRouter();

    if (!series?.length) return null;
    return (
        <div>
            <VideoCarousel className={className}>
                {series.map((video: any) => (
                    <div key={video.id} className="video-card-mobile">
                        <VideoCard
                            onClick={() => router.push(`/series/${video.slug}`)}
                            videoCoverUrl={video.cover_url}
                            videoTitle={video.name}
                            videoDescription={video.description}
                            showTitles={false}
                            showDescription={false}
                            className="h-full"
                        />
                    </div>
                ))}
            </VideoCarousel>
        </div>
    );
}
