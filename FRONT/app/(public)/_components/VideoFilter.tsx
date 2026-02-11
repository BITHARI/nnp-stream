'use client'

import { useState } from "react";
import { Category } from "@/utils/type";
import { cn } from "@/lib/utils";

interface VideoFilterProps {
    onSelectFilter?: (value: string) => void;
    selectedFilter?: string;
    className?: string;
    categories?: Category[] | null;
}

export default function VideoFilter({ onSelectFilter, selectedFilter, className, categories }: VideoFilterProps) {
    const [internalSelectedFilter, setInternalSelectedFilter] = useState(selectedFilter || "");

    const onFilter = (value: string) => {
        setInternalSelectedFilter(value);
        onSelectFilter?.(value);
        console.log("onFilter :", value)
    };

    return (
        <div className={className}>
            <div className="flex gap-2 items-center w-full overflow-x-auto">
                {categories &&
                    [{ id: "all", type: "all", _count: null }, ...categories].map((category) => (
                        <button
                            key={category.type}
                            onClick={(e) => {
                                e.preventDefault();
                                onFilter(category.id);
                            }}
                            className={cn(
                                "text-white bg-white/10 py-1.5 px-3 text-[10px] sm:text-xs rounded-md font-semibold uppercase shrink-0 transition-all duration-200",
                                internalSelectedFilter.includes(category.id) ? "bg-nnp-highlight text-black" : "hover:bg-white/20",
                            )}
                        >
                            {category.type === "all" ? "Tous" : categories.find((c) => c.id === category.id)?.type} {category._count ? `(${category._count.videos})` : ""}
                        </button>
                    ))}
            </div>
        </div>
    );
}
