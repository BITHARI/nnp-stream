import { formatDuration, formatViews } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import HeartIcon from "@/components/icons/HeartIcon";
import { SavedVideo } from "@/utils/type";
import { cn } from "@/lib/utils";

interface VideoHCardProps {
    video: SavedVideo,
    className?: string
}
export default function VideoHCard({ video, className }: VideoHCardProps) {
    return <Link
        href={`/watch/${video.slug}`}
        className={cn("group flex items-start gap-4 px-2 py-1.5 hover:bg-nnp-primary/30 transition-all duration-200", className)}
    >
        {/* Thumbnail */}
        <div className="relative w-18 h-12 md:w-24 md:h-16 shrink-0 rounded-lg overflow-hidden bg-gray-800">
            {video.cover_url ? (
                <Image
                    src={video.cover_url}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
            ) : <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            }
            {/* Duration overlay */}
            {video.duration && (
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </div>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm leading-5 line-clamp-2 group-hover:text-nnp-highlight transition-colors duration-200">
                {video.title}
            </h3>
            {video.description && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-4">{video.description}</p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                {video.views > 0 && (
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <span>{formatViews(video.views)} vues</span>
                    </div>
                )}
                {video.likes > 0 && (
                    <div className="flex items-center gap-1">
                        <HeartIcon className="w-3 h-3 stroke-current" />
                        <span>{formatViews(video.likes)}</span>
                    </div>
                )}
                {video.type && (
                    <span className="bg-nnp-highlight/20 text-nnp-highlight px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                        {video.type}
                    </span>
                )}
            </div>
        </div>
    </Link>
}
