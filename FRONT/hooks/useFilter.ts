import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVideos } from "@/services/video";

export default function useFilter() {
    const [selectedFilter, setSelectedFilter] = useState<string>("all");

    const { data: filteredVideoResult, ...rest } = useQuery({
        queryKey: ["queryByFilter", selectedFilter],
        queryFn: () => getVideos({ category: selectedFilter }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: selectedFilter !== "all",
    });

    return {
        filteredVideoResult,
        setSelectedFilter,
        selectedFilter,
        ...rest,
    };
}
