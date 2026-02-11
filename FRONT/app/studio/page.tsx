"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVideos, deleteVideo } from "@/services/video";
import Link from "next/link";
import Image from "next/image";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Clock,
    Heart,
    Video as VideoIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { showError } from "@/lib/utils";
import { Video } from "@/services/types";
import { getCategories } from "@/services/series";

export default function VideosListPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [typeFilter, setTypeFilter] = useState<string>("")
    const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)

    const queryClient = useQueryClient()

    // Fetch videos
    const { data, isLoading } = useQuery({
        queryKey: ["videos", page, search, categoryFilter, typeFilter],
        queryFn: () => getVideos({
            page,
            limit: 10,
            search: search || undefined,
            category: categoryFilter || undefined,
            type: typeFilter as any || undefined,
        }),
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] })
            toast.success("Vidéo supprimée avec succès")
            setVideoToDelete(null)
        },
        onError: (error) => {
            showError(error)
        }
    })

    const handleDelete = () => {
        if (videoToDelete) {
            deleteMutation.mutate(videoToDelete.id)
        }
    }

    const formatDuration = (duration: string) => {
        return duration || "0:00"
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Vidéos</h1>
                    <p className="text-muted-foreground">
                        Gérez vos vidéos et leur contenu
                    </p>
                </div>
                <Link href="/studio/create" className={buttonVariants()}>
                    <Plus className="size-4 mr-2" />
                    Nouvelle vidéo
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une vidéo..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Toutes catégories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Toutes catégories</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Type Filter */}
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Tous types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tous types</SelectItem>
                                <SelectItem value="free">Gratuit</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Videos List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Skeleton className="w-48 h-28 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : data?.videos.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center pb-4">
                        <VideoIcon className="size-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucune vidéo trouvée</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {search || categoryFilter || typeFilter
                                ? "Aucune vidéo ne correspond à vos critères de recherche"
                                : "Commencez par créer votre première vidéo"}
                        </p>
                        <Link href="/admin/videos/new" className={buttonVariants()}>
                            <Plus className="size-4 mr-2" />
                            Créer une vidéo
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {data?.videos.map((video) => (
                            <Card key={video.id} className="hover:shadow-md transition-shadow">
                                <CardContent>
                                    <div className="flex gap-4">
                                        {/* Thumbnail */}
                                        <div className="relative w-48 h-28 shrink-0 rounded-lg overflow-hidden bg-muted">
                                            {video.cover_url ? (
                                                <Image
                                                    src={video.cover_url}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <VideoIcon className="size-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                                                {formatDuration(video.duration)}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg truncate">
                                                            {video.title}
                                                        </h3>
                                                        {video.is_promoted && (
                                                            <Badge variant="secondary" className="shrink-0">
                                                                Promue
                                                            </Badge>
                                                        )}
                                                        <Badge
                                                            variant={video.type === "free" ? "default" : "destructive"}
                                                            className="shrink-0"
                                                        >
                                                            {video.type === "free" ? "Gratuit" : "Premium"}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                        {video.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="size-3" />
                                                            <span>{video.views.toLocaleString()} vues</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="size-3" />
                                                            <span>{video.likes.toLocaleString()} likes</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            <span>
                                                                {new Date(video.created_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                        {video.categories && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {video.categories}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/watch/${video.slug}`}>
                                                                <Eye className="size-4 mr-2" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`#`}>
                                                                <Edit className="size-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => setVideoToDelete(video)}
                                                        >
                                                            <Trash2 className="size-4 mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {data && data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Précédent
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} sur {data.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === data.pagination.totalPages}
                            >
                                Suivant
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
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
                            {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}