import Link from "next/link";
import { SavedVideo } from "@/utils/type";
import PlayIcon from "@/components/icons/PlayIcon";

export default function HeroVideoDetails({ currentVideo }: { currentVideo: SavedVideo }) {

    return (
        <div className="max-md:relative max-md:mt-5 h-fit bottom-0 left-0 right-0 z-10 bg-linear-to-t md:px-6 lg:px-8 from-nnp-primary via-nnp-primary to-transparent md:pb-6 lg:pb-8">
            <div className="container-2xl">
                <div className="flex flex-col relative text-white w-full lg:w-[55%] xl:w-[50%] space-y-4 lg:space-y-6">
                    <div className="flex flex-wrap flex-start gap-2 mb-1">
                        {currentVideo.categories.split(",").map((category) => (
                            <div
                                key={category}
                                className="text-white/90 bg-white/10 backdrop-blur-sm py-1.5 px-3 text-[10px] rounded-full font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white/20"
                            >
                                {category.trim()}
                            </div>
                        ))}
                    </div>

                    <h3 className="text-2xl text-start sm:text-3xl lg:text-4xl xl:text-5xl text-white font-bold leading-tight">
                        {currentVideo.title}
                    </h3>

                    <p className="text-white/80 text-start text-sm sm:text-base lg:text-lg line-clamp-3 max-w-2xl font-medium">
                        {currentVideo.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                        <Link
                            href={`/watch/${currentVideo.slug}`}
                            className="group flex items-center gap-2 bg-nnp-highlight hover:bg-nnp-highlight/90 px-5 py-2.5 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <PlayIcon className="fill-black size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            <span>Regarder</span>
                        </Link>
                        {/*
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300">
                  <HeartIcon className="size-5 text-white" />
                  <span>Add to favorites</span>
                </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
