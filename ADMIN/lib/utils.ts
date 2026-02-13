import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function constructUrl(key: string | undefined) {
    if (!key) return
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES
    return `https://${bucketName}.t3.storage.dev/${key}`
}

export function showError(err: any, duration?: number) {
    console.error(err)
    if (err.response && err.response.data) {
        const { error, message } = err.response.data
        if (error && message) {
            toast.error(error + ": " + message, { duration })
            return
        }
        toast.error(message || "Source de l'erreur inconnue", { duration })
        return
    }
    if (err.message) {
        toast.error(err.message, { duration })
        return
    }
    if (err.statusText) {
        toast.error(err.statusText, { duration })
        return
    }
    toast.error("Une erreur inconnue est survenue", { duration })
    return err.message
}

export function scrollToSection(sectionId: string, e?: React.MouseEvent) {
    if (e) e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
