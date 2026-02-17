import { Suspense } from "react";
import VideosListPage from "./_components/VideosPage";

export default function page() {
    return (
        <Suspense fallback={null}>
            <VideosListPage />
        </Suspense>
    );
}