'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { signUp } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpSchemaType } from '@/lib/zodSchemas'
import { toast } from 'sonner'
import Link from 'next/link'
import PasswordInput from '@/components/ui/password-input'
import { showError } from '@/lib/utils'

export default function SignUpPage() {
    const form = useForm<signUpSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            router.push('/verify-email')
        }
    })

    const onSubmit = async (data: signUpSchemaType) => {
        try {
            localStorage.setItem('picha-kubwa-user-email', data.email)
            await mutateAsync(data)
            toast.success("Compte créé avec succès. Vérifiez votre email.")
            form.reset()
        } catch (error: any) {
            showError(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className='text-xl'>Créer un compte</CardTitle>
                <CardDescription>Créez votre nouveau compte</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom complet</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saisissez votre nom complet" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Saisissez votre email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch('email') && <>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="Créez votre mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch('password') && <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="Confirmez votre mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />}
                        </>}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            loading={isPending}
                        >
                            Créer le compte
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link href="/login" className={"text-primary font-medium hover:underline"}>Se connecter</Link>
                </div>
            </CardContent>
        </Card>
    )
}