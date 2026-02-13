import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Video } from '@/services/types'
import React from 'react'

export default function DeleteVideoDialog({
    videoToDelete,
    setVideoToDelete,
    handleDelete,
    isPending,
}: {
    videoToDelete: Video | null,
    setVideoToDelete: (video: Video | null) => void,
    handleDelete: () => void,
    isPending: boolean,
}) {
    return <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. La vidéo "{videoToDelete?.title}" sera
                    définitivement supprimée de la base de données et de Mux.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    {isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}
