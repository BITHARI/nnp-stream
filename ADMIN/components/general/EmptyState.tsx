import { Ban, Loader2 } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    title: string,
    description?: string,
    loading?: boolean
}

export default function EmptyState({ title, description, loading }: EmptyStateProps) {
    return (
        <div className="flex flex-col flex-1 h-full items-center justify-center rounded-sm border-dashed border p-8 text-center animate-in fade-in-50">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                {loading ? <Loader2 className="size-10 animate-spin text-primary" /> : <Ban className="size-10 text-primary" />}
            </div>
            <h2 className="mt-6 text-xl font-semibold">{title}</h2>
            <p className="mb-6 mt-2 text-center text-sm leading-tight text-muted-foreground">{description}</p>
            {/* <Link href="/"></Link> */}
        </div>
    )
}
