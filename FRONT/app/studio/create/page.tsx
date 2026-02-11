"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { showError } from "@/lib/utils";
import { createVideo } from "@/services/video";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, getSeries } from "@/services/series";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import Uploader from "@/components/file-uploader/Uploader";
import VideoUploader from "@/components/file-uploader/VideoUploader";

const videoSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    slug: z.string().min(1, "Le slug est requis"),
    description: z.string().min(1, "La description est requise").max(5000, "La description ne peut pas dépasser 5000 caractères"),
    coverUrl: z.string("L'image de couverture est requise"),
    categoryId: z.string().uuid("Veuillez sélectionner une catégorie"),
    type: z.enum(["free", "premium"]),
    seriesId: z.number().optional(),
    muxAssetId: z.string().min(1, "Veuillez télécharger une vidéo"),
})

type VideoFormData = z.infer<typeof videoSchema>

export default function CreateVideoPage() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const form = useForm<VideoFormData>({
        resolver: zodResolver(videoSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            coverUrl: "",
            categoryId: "",
            type: "free",
            muxAssetId: "",
        }
    })

    // Fetch categories
    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    // Fetch series
    const { data: seriesData, isLoading: seriesLoading } = useQuery({
        queryKey: ["series"],
        queryFn: () => getSeries({ page: 1, limit: 100 }),
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["videos"] })
            router.push("/studio")
        },
    })

    const onSubmit = async (data: VideoFormData) => {
        try {
            await mutateAsync(data)
            toast.success("Vidéo ajoutée avec succès")
            form.reset()
        } catch (error: any) {
            showError(error)
        }
    }

    const selectedCategoryId = form.watch("categoryId")

    return (
        <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
            <div className="flex items-center gap-4">
                <Link href="/" className={buttonVariants({
                    variant: "outline",
                    size: "sm"
                })}>
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">Ajouter une vidéo</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de la vidéo</CardTitle>
                    <CardDescription>
                        Remplissez les informations pour ajouter une nouvelle vidéo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            {/* Category Selection - Must be first */}
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Catégorie *</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={categoriesLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Video Upload - Only enabled after category selection */}
                            <FormField
                                control={form.control}
                                name="muxAssetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vidéo *</FormLabel>
                                        <FormControl>
                                            {selectedCategoryId ? (
                                                <VideoUploader
                                                    categoryId={selectedCategoryId}
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                                    Veuillez d'abord sélectionner une catégorie
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Cover Image Upload */}
                            <FormField
                                control={form.control}
                                name="coverUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image de couverture *</FormLabel>
                                        <FormControl>
                                            <Uploader value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titre *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Titre de la vidéo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Slug */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Slug *</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-4 items-end">
                                                <Input placeholder="slug-de-la-video" {...field} />
                                                <Button
                                                    type='button'
                                                    className='w-fit border-primary hover:border-primary-foreground'
                                                    variant={"outline"}
                                                    onClick={() => {
                                                        const titleValue = form.getValues("title")
                                                        const slug = slugify(titleValue, { lower: true, strict: true })
                                                        form.setValue("slug", slug, { shouldValidate: true })
                                                    }}
                                                >
                                                    Générer le slug <SparkleIcon className="ml-1" size={16} />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description de la vidéo"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Type */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type *</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez un type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="free">Gratuit</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Series (optional) */}
                            <FormField
                                control={form.control}
                                name="seriesId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Série (optionnel)</FormLabel>
                                        <Select
                                            value={field.value?.toString() || "none"}
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                                            disabled={seriesLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez une série (optionnel)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Aucune série</SelectItem>
                                                {seriesData?.series.map((series) => (
                                                    <SelectItem key={series.id} value={series.id.toString()}>
                                                        {series.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                loading={isPending || form.formState.isSubmitting}
                                onClick={() => console.log(form.getValues())}
                            >
                                Créer la vidéo
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}