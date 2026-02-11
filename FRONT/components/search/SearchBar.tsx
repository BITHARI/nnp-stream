'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import Image from "next/image";
import Link from "next/link";
import Spinner from "@/components/icons/Spinner";
import { useQuery } from "@tanstack/react-query";
// @ts-expect-error - No declaration file found
import { debounce } from "lodash";
import { SavedVideo } from "@/utils/type";
import { cn } from "@/lib/utils";
import { formatDuration, formatViews } from "@/utils/format";
import { Button } from "../ui/button";
import { getVideos } from "@/services/video";
import VideoHCard from "../cards/VideoHCard";

interface SearchBarProps {
    recentSearches?: string[];
    onOpenSidebarMenu?: () => void;
}

export default function SearchBar({ recentSearches = [] }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showRecent, setShowRecent] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const debouncedUpdateSearch = useCallback(
        debounce((query: string) => {
            setDebouncedSearchQuery(query);
        }, 500),
        [],
    );

    useEffect(() => {
        debouncedUpdateSearch(searchQuery);
        return () => {
            debouncedUpdateSearch.cancel();
        };
    }, [searchQuery, debouncedUpdateSearch]);

    const { data, isLoading } = useQuery({
        queryKey: ["searchVideos", debouncedSearchQuery],
        queryFn: () => getVideos({ search: debouncedSearchQuery }),
        enabled: !!debouncedSearchQuery,
    });

    const searchedVideos: SavedVideo[] = data?.videos || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowRecent(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFocus = () => {
        setIsOpen(true);
        setIsFocused(true);
        setShowRecent(true);
    };

    const handleSearch = () => {
        setShowRecent(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        setIsOpen(false);
    };

    return (<div ref={searchRef} className="relative flex items-center gap-2 w-full md:w-1/2 mx-auto">
        <div
            className={cn(
                "flex items-center w-full px-4 gap-3 border rounded-lg bg-nnp-primary-dark/80 backdrop-blur-sm transition-all duration-200",
                isFocused ? "border-nnp-highlight shadow-lg shadow-nnp-highlight/20" : "border-gray-700",
            )}
        >
            <SearchIcon
                className={cn("stroke-gray-400 transition-colors duration-200", isFocused && "stroke-nnp-highlight")}
            />

            <input
                value={searchQuery}
                onFocus={handleFocus}
                onKeyPress={handleKeyPress}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                className={cn(
                    "w-full py-1.5 focus:ring-0 outline-none text-white bg-transparent placeholder:text-gray-400",
                    "text-base transition-all duration-200",
                )}
                placeholder={"Rechercher..."}
            />

            {searchQuery && (
                <button onClick={onClearSearch} className="p-1 hover:bg-gray-700/50 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>

        <Button
            onClick={handleSearch}
            className={cn(
                "bg-nnp-highlight text-black font-medium py-2! px-6 transition-all duration-200",
                "hover:bg-nnp-highlight/90 active:scale-95",
                "hidden lg:flex items-center gap-2",
            )}
        >
            {isLoading ? (
                <>
                    <Spinner className="animate-spin" />
                </>
            ) : (
                <>
                    <SearchIcon className="stroke-current w-5 h-5" />
                </>
            )}
        </Button>

        {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-nnp-primary-dark/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl">
                <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm text-gray-400">{"Recherches récentes"}</span>
                        <button
                            className="text-xs text-nnp-highlight hover:text-nnp-highlight/80 transition-colors"
                            onClick={() => {
                                /* Clear all recent searches */
                            }}
                        >
                            {"Effacer"}
                        </button>
                    </div>
                    <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-200 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => {
                                    // Handle recent search click
                                    setShowRecent(false);
                                }}
                            >
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {isOpen && searchQuery.length > 0 && (
            <div className="fixed md:absolute z-10 md:w-full max-md:left-4 max-md:right-4 top-16 border border-gray-700/50 rounded-xl shadow-2xl bg-nnp-primary-dark/95 backdrop-blur-lg">
                {isLoading ? (
                    <div className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center gap-3 text-gray-300">
                            <Spinner className="animate-spin w-5 h-5" />
                            <span className="text-base font-medium">{"Recherche en cours..."}</span>
                        </div>
                    </div>
                ) : searchedVideos && searchedVideos?.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-gray-700/50">
                            <p className="text-sm text-gray-400 font-medium">
                                {searchedVideos.length} {searchedVideos.length === 1 ? "resultat" : "resultats"}{" "}
                                {"trouvés pour"} "<span className="italic">{debouncedSearchQuery}</span>"
                            </p>
                        </div>
                        {searchedVideos?.map((video: SavedVideo, index: number) => (<div key={index} className="py-1"><VideoHCard video={video} /></div>))}
                    </div>
                ) : debouncedSearchQuery.length > 0 ? (
                    <div className="px-6 py-8 text-center">
                        <div className="text-gray-400 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto mb-4 opacity-50"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-medium">{"Aucun résultat trouvé"}</p>
                        <p className="text-gray-500 text-sm mt-1">{"Essayez de modifier votre recherche"}</p>
                    </div>
                ) : null}
            </div>
        )}
    </div>
    );
}
