'use client'

import { useCallback, useEffect, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import { Card, CardContent } from "../ui/card"
import { cn, constructUrl } from "@/lib/utils"
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { uploadImage } from "@/services/upload"
import axios from "axios"

interface UploaderState {
    id: string | null,
    file: File | null,
    uploading: boolean,
    progress: number,
    key?: string,
    isDeleting: boolean,
    error: boolean,
    objectUrl?: string,
    fileType: "image" | "video"
}

export default function Uploader({ value, onChange }: { value?: string, onChange?: (value: string) => void }) {

    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
        key: value,
        objectUrl: constructUrl(value)
    })
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) URL.revokeObjectURL(fileState.objectUrl)
        setFileState({
            file: file,
            uploading: false,
            progress: 0,
            objectUrl: URL.createObjectURL(file),
            fileType: file.type.includes("image") ? "image" : "video",
            error: false,
            isDeleting: false,
            id: uuidv4()
        })
        uploadFile(file)
    }, [fileState.objectUrl])

    const uploadFile = async (file: File) => {
        setFileState(prev => ({ ...prev, uploading: true, progress: 0, error: false }))

        try {
            const presignedResponse = await uploadImage({ fileName: file.name, contentType: file.type, size: file.size })
            const { presignedUrl, key } = presignedResponse

            await axios.put(presignedUrl, file, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentComplete = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        )
                        setFileState(prev => ({ ...prev, progress: percentComplete }))
                    }
                },
                headers: {
                    'Authorization': process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
                },
                timeout: 300000,
            })

            setFileState(prev => ({
                ...prev,
                progress: 100,
                key,
                uploading: false
            }))
            const fileKey = presignedUrl.split("/").slice(-1)[0].split("?")[0]
            onChange?.("https://nnp-stream.t3.storage.dev/" + fileKey)
            toast.success("Image téléchargée avec succès")

        } catch (error) {
            console.error('Upload error:', error)

            let errorMessage = "Une erreur est survenue lors de l'upload de l'image"

            if (axios.isAxiosError(error)) {
                const axiosError = error as any
                console.error('Detailed Axios error:', {
                    message: axiosError.message,
                    code: axiosError.code,
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    config: {
                        method: axiosError.config?.method,
                        url: axiosError.config?.url,
                        headers: axiosError.config?.headers,
                    }
                })

                if (axiosError.response?.status === 403) {
                    errorMessage = "Accès refusé lors de l'upload. Vérifiez la configuration."
                } else if (axiosError.response?.status === 413) {
                    errorMessage = "Le fichier est trop volumineux."
                } else if (axiosError.code === 'ECONNABORTED') {
                    errorMessage = "Timeout - le téléchargement a pris trop de temps."
                } else if (axiosError.response?.data) {
                    errorMessage = `Erreur: ${axiosError.response.data}`
                }
            }

            setFileState(prev => ({ ...prev, error: true, progress: 0 }))
            toast.error(errorMessage)

        } finally {
            setFileState(prev => ({ ...prev, uploading: false }))
        }
    }

    const handleFileRejection = (fileRejections: FileRejection[]) => {
        if (!fileRejections) return
        const tooManyFiles = fileRejections.find(r => r.errors[0].code === 'too-many-files')
        if (tooManyFiles) {
            toast.error("Vous ne pouvez télécharger qu'une seule image")
            return
        }
        const tooLarge = fileRejections.find(r => r.errors[0].code === 'file-too-large')
        if (tooLarge) {
            toast.error("Le fichier téléchargé est trop lourd (5Mo maximum)")
            return
        }
    }

    const handleRemoveFile = useCallback(async () => {
        if (fileState.isDeleting || !fileState.objectUrl) return
        try {
            setFileState(prev => ({ ...prev, isDeleting: true }))
            // await deleteImage(fileState.key as string)
            onChange?.("")
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) URL.revokeObjectURL(fileState.objectUrl)
            setFileState(prev => ({ ...prev, file: null, objectUrl: undefined, key: undefined, id: null, error: false, progress: 0 }))
        } catch {
            setFileState(prev => ({ ...prev, error: true }))
            toast.error("Une erreur est survenue lors de la suppression de l'image")
        } finally {
            setFileState(prev => ({ ...prev, isDeleting: false }))
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDropRejected: handleFileRejection,
        disabled: fileState.uploading || fileState.isDeleting
    })
    const renderContent = () => {
        if (fileState.uploading) return <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />
        if (fileState.error) return <RenderErrorState />
        if (fileState.objectUrl) return <RenderUploadedState previewUrl={fileState.objectUrl} handleRemoveFile={handleRemoveFile} isDeleting={fileState.isDeleting} />
        return <RenderEmptyState isDragActive={isDragActive} />
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) URL.revokeObjectURL(fileState.objectUrl)
        }
    }, [fileState.objectUrl])

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in w-full h-64",
            isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}
