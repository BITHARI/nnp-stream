'use client'

import { useCallback, useEffect, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import { Card, CardContent } from "../ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { createVideoUpload, getUploadStatus } from "@/services/upload"
import { Loader2, Upload, Video, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"

interface VideoUploaderState {
    id: string | null
    file: File | null
    uploading: boolean
    processing: boolean
    progress: number
    uploadId: string | null
    muxAssetId: string | null
    error: boolean
    errorMessage: string | null
    objectUrl?: string
    completed: boolean
}

interface VideoUploaderProps {
    categoryId: string
    onChange?: (muxAssetId: string) => void
}

export default function VideoUploader({ categoryId, onChange }: VideoUploaderProps) {
    const [fileState, setFileState] = useState<VideoUploaderState>({
        id: null,
        file: null,
        uploading: false,
        processing: false,
        progress: 0,
        uploadId: null,
        muxAssetId: null,
        error: false,
        errorMessage: null,
        completed: false,
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        if (fileState.objectUrl) {
            URL.revokeObjectURL(fileState.objectUrl)
        }

        setFileState({
            id: uuidv4(),
            file: file,
            uploading: false,
            processing: false,
            progress: 0,
            uploadId: null,
            muxAssetId: null,
            error: false,
            errorMessage: null,
            objectUrl: URL.createObjectURL(file),
            completed: false,
        })

        uploadVideo(file)
    }, [categoryId])

    const uploadVideo = async (file: File) => {
        setFileState(prev => ({ ...prev, uploading: true, progress: 0, error: false }))

        try {
            // Step 1: Create Mux upload
            const uploadResponse = await createVideoUpload({
                title: file.name,
                description: "Video upload",
                categoryId,
                type: "free",
                isPromoted: false,
            })

            const { uploadUrl, uploadId } = uploadResponse

            setFileState(prev => ({ ...prev, uploadId }))

            // Step 2: Upload video to Mux
            await axios.put(uploadUrl, file, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentComplete = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        )
                        setFileState(prev => ({ ...prev, progress: percentComplete }))
                    }
                },
                headers: {
                    'Content-Type': file.type || 'video/mp4',
                },
                // timeout: 600000, // 10 minutes
            })

            setFileState(prev => ({
                ...prev,
                uploading: false,
                processing: true,
                progress: 0,
            }))

            toast.success("Vidéo téléchargée, traitement en cours...")

            await pollAssetStatus(uploadId)

        } catch (error) {
            console.error('Upload error:', error)

            let errorMessage = "Une erreur est survenue lors de l'upload de la vidéo"

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    errorMessage = "Accès refusé lors de l'upload."
                } else if (error.response?.status === 413) {
                    errorMessage = "Le fichier est trop volumineux."
                } else if (error.code === 'ECONNABORTED') {
                    errorMessage = "Le téléchargement a pris trop de temps."
                } else if (error.response?.data) {
                    errorMessage = `Erreur: ${error.response.data}`
                }
            }

            setFileState(prev => ({
                ...prev,
                error: true,
                errorMessage,
                uploading: false,
                processing: false,
                progress: 0,
            }))
            toast.error(errorMessage)
        }
    }

    const pollAssetStatus = async (uploadId: string) => {
        const maxAttempts = 120 // 10 minutes with 5-second intervals
        let attempts = 0

        const poll = async (): Promise<void> => {
            if (attempts >= maxAttempts) {
                throw new Error("Le traitement de la vidéo a pris trop de temps")
            }

            attempts++

            try {
                const status = await getUploadStatus(uploadId)

                // Update progress indicator
                const processingProgress = Math.min(50 + (attempts * 0.5), 95)
                setFileState(prev => ({ ...prev, progress: processingProgress }))

                if (status.uploadStatus === 'ready' && status.assetId) {
                    // Video is ready!
                    setFileState(prev => ({
                        ...prev,
                        muxAssetId: status.assetId!,
                        processing: false,
                        progress: 100,
                        completed: true,
                    }))

                    onChange?.(status.assetId!)
                    toast.success("Vidéo prête!")
                    return
                }

                if (status.uploadId === 'errored') {
                    throw new Error("Le traitement de la vidéo a échoué")
                }

                // Continue polling
                await new Promise(resolve => setTimeout(resolve, 5000))
                return poll()

            } catch (error) {
                throw error
            }
        }

        await poll()
    }

    const handleFileRejection = (fileRejections: FileRejection[]) => {
        if (!fileRejections) return

        const tooManyFiles = fileRejections.find(r => r.errors[0].code === 'too-many-files')
        if (tooManyFiles) {
            toast.error("Vous ne pouvez télécharger qu'une seule vidéo")
            return
        }

        const tooLarge = fileRejections.find(r => r.errors[0].code === 'file-too-large')
        if (tooLarge) {
            toast.error("Le fichier est trop lourd (500Mo maximum)")
            return
        }

        const invalidType = fileRejections.find(r => r.errors[0].code === 'file-invalid-type')
        if (invalidType) {
            toast.error("Format de fichier non supporté")
            return
        }
    }

    const handleRemoveFile = useCallback(() => {
        if (fileState.uploading || fileState.processing) return

        if (fileState.objectUrl) {
            URL.revokeObjectURL(fileState.objectUrl)
        }

        setFileState({
            id: null,
            file: null,
            uploading: false,
            processing: false,
            progress: 0,
            uploadId: null,
            muxAssetId: null,
            error: false,
            errorMessage: null,
            completed: false,
        })

        onChange?.("")
    }, [fileState.uploading, fileState.processing, fileState.objectUrl])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 500 * 1024 * 1024, // 500MB
        onDropRejected: handleFileRejection,
        disabled: fileState.uploading || fileState.processing
    })

    const renderContent = () => {
        // Uploading state
        if (fileState.uploading) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <Loader2 className="size-12 animate-spin text-primary" />
                    <div className="flex flex-col items-center gap-2 w-full max-w-md">
                        <p className="text-sm font-medium">
                            Chargement de la vidéo...
                        </p>
                        <Progress value={fileState.progress} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                            {fileState.progress}%
                        </p>
                    </div>
                    {fileState.file && (
                        <p className="text-xs text-muted-foreground">
                            {fileState.file.name}
                        </p>
                    )}
                </div>
            )
        }

        // Processing state
        if (fileState.processing) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <Loader2 className="size-12 animate-spin text-primary" />
                    <div className="flex flex-col items-center gap-2 w-full max-w-md">
                        <p className="text-sm font-medium">
                            Traitement de la vidéo...
                        </p>
                        <Progress value={fileState.progress} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                            Cela peut prendre quelques minutes
                        </p>
                    </div>
                </div>
            )
        }

        // Error state
        if (fileState.error) {
            return (
                <div className="flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="size-12 text-destructive" />
                    <div className="text-center">
                        <p className="text-sm font-medium text-destructive">
                            Erreur lors du chargement
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {fileState.errorMessage || "Une erreur est survenue"}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                    >
                        Réessayer
                    </Button>
                </div>
            )
        }

        // Completed state
        if (fileState.completed && fileState.file) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div className="relative">
                        <CheckCircle2 className="size-12 text-green-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            Vidéo prête
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {fileState.file.name}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                    >
                        <X className="size-4 mr-2" />
                        Supprimer
                    </Button>
                </div>
            )
        }

        // Empty state
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className={cn(
                    "rounded-full p-4 transition-colors",
                    isDragActive ? "bg-primary/20" : "bg-muted"
                )}>
                    {isDragActive ? (
                        <Upload className="size-8 text-primary" />
                    ) : (
                        <Video className="size-8 text-muted-foreground" />
                    )}
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium">
                        {isDragActive
                            ? "Déposez votre vidéo ici"
                            : "Glissez-déposez votre vidéo ou cliquez pour parcourir"
                        }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        MP4, MOV, AVI, MKV, WEBM (max 500MB)
                    </p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl) {
                URL.revokeObjectURL(fileState.objectUrl)
            }
        }
    }, [fileState.objectUrl])

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 ease-in w-full h-64 cursor-pointer",
                isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary",
                (fileState.uploading || fileState.processing) && "cursor-not-allowed opacity-75"
            )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}