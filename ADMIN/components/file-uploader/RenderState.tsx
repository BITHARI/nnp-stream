import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className='text-center'>
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon className={cn("size-6 text-muted-foreground",
                    isDragActive && "text-primary"
                )} />
            </div>
            <p className="text-base font-semibold text-foreground">
                {isDragActive
                    ? "Déposez le fichier ici"
                    : <>Glisser et déposer votre fichier ici ou <span className='text-primary cursor-pointer font-semibold'>cliquez pour sélectionner</span></>
                }
            </p>
            <Button type='button' className='mt-4'>Choisir un fichier</Button>
        </div>
    )
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive mb-4">
                <ImageIcon className="size-6 m-auto" />
            </div>
            <p className="text-base font-semibold">Echec de chargement</p>
            <p className="text-xs mt-1 text-muted-foreground">Le fichier n'a pas pu être téléchargé</p>
            <Button type='button' className='mt-4'>Veuillez réessayer</Button>
        </div>
    )
}

export function RenderUploadedState({
    previewUrl,
    isDeleting,
    handleRemoveFile
}: {
    previewUrl: string,
    isDeleting: boolean,
    handleRemoveFile: () => void
}) {
    return (
        <div>
            <Image src={previewUrl} alt="Preview image" fill className='object-contain p-2' />
            <Button type='button' variant='destructive' className={cn("absolute top-4 right-4")} onClick={handleRemoveFile} disabled={isDeleting} loading={isDeleting}><XIcon className='size-4' /></Button>
        </div>
    )
}

export function RenderUploadingState({ progress, file }: { progress: number, file: File }) {
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p className="">{progress}</p>
            <p className="mt-2 text-sm font-medium text-foreground">
                En cours de chargement...
            </p>
            <p className="mt-1 text-xs text-muted foreground truncate max-w-xs">{file.name}</p>
        </div>
    )
}
