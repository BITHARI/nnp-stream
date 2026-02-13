'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";
import { getVideos } from "@/services/video";
import HeroVideoCarousel from "./_components/HeroVideoCarousel";
import VideoGrid from "./_components/VideosGrid";
import VideoFilter from "./_components/VideoFilter";

export default function HomePage() {
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const { data: categories } = useQuery({
        queryKey: ["videoTypes"],
        queryFn: getCategories,
    });
    const { data, isLoading } = useQuery({
        queryKey: ["promotedVideos"],
        queryFn: () => getVideos(),
    });
    return <>
        <HeroVideoCarousel data={data?.videos || []} isLoading={isLoading} />
        <div className="space-y-4 container-2xl px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    Catégories
                </h2>
                {selectedFilter && selectedFilter !== "all" && (
                    <button
                        onClick={() => setSelectedFilter("all")}
                        className="text-xs sm:text-sm text-nnp-highlight hover:text-nnp-highlight/80 transition-colors"
                    >
                        Réinitialiser les filtres
                    </button>
                )}
            </div>
            <div className="relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-nnp-highlight scrollbar-track-nnp-primary-dark">
                <VideoFilter
                    categories={categories}
                    selectedFilter={selectedFilter}
                    onSelectFilter={(value) => setSelectedFilter(value)}
                    className="flex gap-2 w-max"
                />
            </div>
            <VideoGrid
                key={selectedFilter}
                categoryName={selectedFilter}
            />
        </div>
    </>
}
