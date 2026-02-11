import z from "zod";

const datefromString = z.string().pipe(z.coerce.date());

export const courseSchema = z.object({
    title: z.string()
        .min(3, { message: "Le titre doit avoir au moins 3 caractères" })
        .max(100, { message: "Le titre ne doit pas dépasser 100 caractères" }),
    description: z.string()
        .min(3, { message: "Cette description est trop courte" }),
    fileKey: z.string()
        .min(1, { message: "Le fichier est requis" }),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    category: z.string(),
    smallDescription: z.string()
        .min(3, { message: "Cette description est trop courte" })
        .max(250, { message: "Veuillez ne pas dépasser 250 caractères" }),
    slug: z.string()
        .min(3, { message: "Le slug doit avoir au moins 3 caractères" })
        .max(100, { message: "Veuillez ne pas dépasser 100 caractères" }),
    startDate: datefromString,
    endDate: datefromString
}).refine(data => data.startDate < data.endDate, {
    message: "La date de fin doit être supérieure à la date de début",
    path: ["endDate"],
});

export type courseSchemaType = z.infer<typeof courseSchema>

/* 
model BlogPost {
    id               String         @id @default(uuid())
    author           User           @relation(fields: [authorId], references: [id], onDelete: SetNull)
    authorId         String
    title            String
    shortDescription String
    coverImage       String
    content          String
    slug             String         @unique
    status           BlogPostStatus @default(draft)
    publishedAt      DateTime?
    views            Int            @default(0)
    createdAt        DateTime       @default(now())
    updatedAt        DateTime       @updatedAt
}
*/

export const blogPostSchema = z.object({
    title: z.string()
        .min(3, { message: "Le titre doit avoir au moins 3 caractères" })
        .max(100, { message: "Veuillez ne pas dépasser 100 caractères" }),
    shortDescription: z.string()
        .min(3, { message: "Cette description est trop courte" })
        .max(250, { message: "Veuillez ne pas dépasser 250 caractères" }),
    coverImage: z.string()
        .min(1, { message: "Le fichier est requis" }),
    content: z.string()
        .min(3, { message: "Le contenu est requis" }),
    slug: z.string()
        .min(3, { message: "Le slug doit avoir au moins 3 caractères" })
        .max(100, { message: "Veuillez ne pas dépasser 100 caractères" }),
})

export type blogPostSchemaType = z.infer<typeof blogPostSchema>