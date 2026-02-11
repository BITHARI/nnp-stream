import { Carousel } from "react-responsive-carousel";
//@ts-ignore
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import { SavedVideo } from "@/utils/type";
import dynamic from "next/dynamic";
import HeroVideoDetails from "./HeroVideoDetails";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
    ssr: false,
});

interface HomeCarouselProps {
    data: SavedVideo[];
    isLoading: boolean;
}

export default function HeroVideoCarousel({ data, isLoading }: HomeCarouselProps) {
    const [currentVideo, setCurrentVideo] = useState<SavedVideo | undefined>();
    useEffect(() => {
        if (data?.[0]) {
            setCurrentVideo(data?.[0]);
        }
    }, [data]);

    if (isLoading || !currentVideo) {
        return <div className="relative w-full min-h-[50vh] md:min-h-[65vh] lg:min-h-[80vh] mb-6 lg:mb-10">
            <div className="absolute inset-0 w-full h-full bg-nnp-primary-dark mt-1/2 animate-pulse">
                <div className="absolute bottom-0 w-full p-8 space-y-4">
                    <div className="h-8 w-2/3 bg-white/10 rounded-lg animate-pulse" />
                    <div className="h-4 w-1/3 bg-white/10 rounded-lg animate-pulse" />
                    <div className="flex gap-2 mt-4">
                        <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    }
    return <>
        <div className="relative min-h-[25vh] md:min-h-[65vh] lg:min-h-[80vh] lg:mb-10 group">
            <Carousel
                showIndicators={false}
                showThumbs={false}
                showStatus={false}
                swipeable
                autoPlay
                infiniteLoop
                interval={5000}
                className="relative border max-md:mt-18 inset-0 group"
                onChange={(index) => {
                    if (data?.[index]) {
                        const currentVideo = data?.[index];
                        setCurrentVideo(currentVideo);
                    }
                }}
            >
                {data?.map((video) => (
                    <div key={video.id} className="relative w-full h-fit home">
                        <MuxPlayer
                            key={video.id}
                            playbackId={video.playback_id}
                            metadataVideoTitle={video.title}
                            metadata-viewer-user-id="Placeholder (optional)"
                            primary-color="#ffffff"
                            secondary-color="#000000"
                            accent-color="#DD8300"
                            muted
                            disablePictureInPicture
                            disableTracking
                            assetStartTime={5}
                            assetEndTime={30}
                            autoPlay
                            loop
                            className="object-cover w-full [mux-player]:[control-none] lg:h-[90dvh]"
                            nohotkeys
                        />
                    </div>
                ))}
            </Carousel>
            {currentVideo &&
                <div className="max-md:hidden absolute inset-0 flex flex-col justify-end">
                    <HeroVideoDetails currentVideo={currentVideo} />
                </div>
            }
        </div>
        {currentVideo &&
            <div className="md:hidden px-4 mb-6">
                <HeroVideoDetails currentVideo={currentVideo} />
            </div>
        }
    </>
}
