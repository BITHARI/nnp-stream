import { cn } from "@/lib/utils";
import Image from "next/image";

type VideoCardProps = {
    videoCoverUrl: string;
    videoTitle: string;
    videoDescription: string;
    onClick: () => void;
    showTitles?: boolean;
    showDescription?: boolean;
    className?: string;
};

export default function VideoCard({
    videoDescription,
    videoTitle,
    videoCoverUrl,
    onClick,
    showDescription = false,
    showTitles = false,
    className,
}: VideoCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative w-full overflow-hidden rounded-lg transition-all duration-300 md:hover:scale-[1.02]",
                className,
            )}
        >
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={videoCoverUrl}
                    alt={videoTitle}
                    fill
                    className="object-cover transition-transform duration-300 md:group-hover:scale-105"
                />
                {(showTitles || showDescription) && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                            {showTitles && <h3 className="line-clamp-1 font-semibold text-white">{videoTitle}</h3>}
                            {showDescription && <p className="line-clamp-2 text-sm text-gray-300">{videoDescription}</p>}
                        </div>
                    </div>
                )}
            </div>
        </button>
    );
}
