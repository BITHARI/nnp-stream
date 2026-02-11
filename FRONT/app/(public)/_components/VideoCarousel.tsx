import { useState, useRef, useCallback, useEffect } from "react";

interface VideoCategoryCarouselProps {
    className?: string;
    children?: React.ReactNode;
}

export default function VideoCarousel({ className, children }: VideoCategoryCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    const scrollLeft = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Adjust scroll distance as needed
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: "smooth",
            });
        }
    }, []);

    const scrollRight = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Adjust scroll distance as needed
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateScrollButtons();
        }, 100);

        return () => clearTimeout(timer);
    }, [updateScrollButtons]);

    if (!children) return null;
    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative">
                <div ref={scrollContainerRef} className="mobile-scroll-container" onScroll={updateScrollButtons}>
                    {children}
                </div>

                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className="absolute left-0 max-md:hidden top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 border border-white/60 hover:border-nnp-highlight hover:text-nnp-highlight rounded-l-md flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-all"
                    aria-label="Scroll left"
                >
                    <svg className="w-4 h-4" viewBox="0 0 532 532" fill="currentColor">
                        <path d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
                    </svg>
                </button>

                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className="absolute right-0 max-md:hidden top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 border border-white/60 hover:border-nnp-highlight hover:text-nnp-highlight rounded-r-md flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-all"
                    aria-label="Scroll right"
                >
                    <svg className="w-4 h-4" viewBox="0 0 532 532" fill="currentColor">
                        <path d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
