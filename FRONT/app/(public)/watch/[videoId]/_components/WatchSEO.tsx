import { SITE_URL } from "@/utils/constant";
import Head from "next/head";

export const WatchSEO = ({ currentVideo }: { currentVideo: any; }) => {
    const videoTitle = currentVideo?.title || "Watch Video";
    const videoDescription = currentVideo?.description || "Watch this amazing video on NNP Stream";
    const videoSlug = currentVideo?.slug || currentVideo?.videoId;
    const pageTitle = currentVideo?.title ? `${currentVideo.title} | NNP Stream` : "NNP Stream";
    const ogImageUrl = currentVideo?.cover_url || `${SITE_URL}/images/nnp-stream-logo.png`;
    const videoUrl = currentVideo?.playback_id ? `https://stream.mux.com/${currentVideo.playback_id}.m3u8` : "";
    const createdDate = currentVideo?.created_at
        ? new Date(currentVideo.created_at).toISOString()
        : new Date().toISOString();

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={videoDescription} />
            <meta
                name="keywords"
                content={`${currentVideo?.categories || "video, entertainment"}, NNP Stream, watch online, ${currentVideo?.title}`}
            />
            <meta name="author" content="NNP Stream" />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Language alternatives */}
            <link rel="alternate" hrefLang="en" href={`${SITE_URL}/watch/${videoSlug}`} />
            <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/watch/${videoSlug}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="video.other" />
            <meta property="og:site_name" content="NNP Stream" />
            <meta property="og:title" content={videoTitle} />
            <meta property="og:description" content={videoDescription} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={videoTitle} />
            <meta property="og:locale" content={"fr_FR"} />
            {videoUrl && <meta property="og:video" content={videoUrl} />}
            {videoUrl && <meta property="og:video:secure_url" content={videoUrl} />}
            {videoUrl && <meta property="og:video:type" content="application/x-mpegURL" />}
            {currentVideo?.duration && <meta property="og:video:duration" content={currentVideo.duration.toString()} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="player" />
            <meta name="twitter:site" content="@NNPStream" />
            <meta name="twitter:creator" content="@NNPStream" />
            <meta name="twitter:title" content={videoTitle} />
            <meta name="twitter:description" content={videoDescription} />
            <meta name="twitter:image" content={ogImageUrl} />
            <meta name="twitter:image:alt" content={videoTitle} />
            {currentVideo?.playback_id && (
                <>
                    <meta name="twitter:player" content={videoUrl} />
                    <meta name="twitter:player:width" content="1280" />
                    <meta name="twitter:player:height" content="720" />
                </>
            )}

            {/* Additional Video metadata */}
            {currentVideo?.duration && <meta property="video:duration" content={currentVideo.duration.toString()} />}
            <meta property="video:release_date" content={createdDate} />
            {currentVideo?.categories && <meta property="video:tag" content={currentVideo.categories} />}

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "VideoObject",
                    name: videoTitle,
                    description: videoDescription,
                    thumbnailUrl: [ogImageUrl],
                    uploadDate: createdDate,
                    duration: currentVideo?.duration ? `PT${currentVideo.duration}S` : undefined,
                    contentUrl: videoUrl || undefined,
                    genre: currentVideo?.categories || "Entertainment",
                    isPartOf: {
                        "@type": "WebSite",
                        name: "NNP Stream",
                        url: SITE_URL,
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "NNP Stream",
                        url: SITE_URL,
                        logo: {
                            "@type": "ImageObject",
                            url: `${SITE_URL}/images/nnp-stream-logo.png`,
                        },
                    },
                    potentialAction: {
                        "@type": "WatchAction",
                    },
                })}
            </script>
        </Head>
    );
};
