import z, { email } from "zod";

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/

export const signInSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string()
})

export const signUpSchema = z.object({
    name: z.string().min(2, 'Ce nom est trop court'),
    email: z.string().email('Adresse email invalide'),
    password: z.string().regex(passwordRegex, 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère special'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export const createUserSchema = z.object({
    name: z.string().min(2, 'Ce nom est trop court'),
    email: z.string().email('Adresse email invalide'),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Adresse email invalide'),
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token requis'),
    newPassword: z.string().regex(passwordRegex, 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère special'),
    confirmPassword: z.string(),
    email: z.string().email('Adresse email invalide'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token de vérification requis'),
    email: z.string().email('Adresse email invalide'),
})

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
    startDate: z.string()
        .min(1, { message: "La date de début est requise" }),
    endDate: z.string()
        .min(1, { message: "La date de fin est requise" }),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "La date de fin doit être supérieure à la date de début",
    path: ["endDate"],
});

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

export const sendMessageSchema = z.object({
    name: z.string({ message: 'Le nom est requis' }).min(2, 'Ce nom est trop court'),
    email: z.string({ message: 'L\'email est requis' }).email('Adresse email invalide'),
    message: z.string({ message: 'Le message est requis' })
        .min(3, { message: "Cette description est trop courte" })
        .max(1000, { message: "Veuillez ne pas dépasser 1000 caractères" }),
})

export type signInSchemaType = z.infer<typeof signInSchema>
export type signUpSchemaType = z.infer<typeof signUpSchema>
export type createUserSchemaType = z.infer<typeof createUserSchema>
export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
export type verifyEmailSchemaType = z.infer<typeof verifyEmailSchema>
export type courseSchemaType = z.infer<typeof courseSchema>
export type blogPostSchemaType = z.infer<typeof blogPostSchema>
export type sendMessageSchemaType = z.infer<typeof sendMessageSchema>