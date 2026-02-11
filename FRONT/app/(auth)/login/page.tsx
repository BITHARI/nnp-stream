'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import useSignInWithProvider from '@/hooks/use-signInWithProvider'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signInSchemaType } from '@/lib/zodSchemas'
import { toast } from 'sonner'
import Link from 'next/link'
import PasswordInput from '@/components/ui/password-input'
import { showError } from '@/lib/utils'

export default function LoginPage() {
    const { signinPending: googleSigninPending, signIn: signinWithGoogle } = useSignInWithProvider({
        provider: "google",
        redirect: true,
        redirectToPath: "/"
    })

    const form = useForm<signInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const router = useRouter()
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            const { token } = data.data
            localStorage.setItem("nnp-stream-token", token)
            queryClient.invalidateQueries({ queryKey: ["loginInfo"] })
            router.push("/")
        }
    })

    const onSubmit = async (data: signInSchemaType) => {
        try {
            await mutateAsync(data)
            toast.success("Connexion réussie")
            form.reset()
        } catch (error: any) {
            showError(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className='text-xl'>Connexion</CardTitle>
                <CardDescription>Connectez-vous à votre compte</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="Saisissez votre mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Link href={'/forgot-password'} className={"text-center text-sm text-muted-foreground hover:text-primary hover:underline"}>Mot de passe oublié ?</Link>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            loading={isPending}
                        >
                            Se connecter
                        </Button>
                    </form>
                </Form>

                {/* <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                    <span className='relative z-10 bg-card px-2 text-muted-foreground'>
                        Ou continuez avec
                    </span>
                </div>

                <Button
                    className='w-full'
                    variant="outline"
                    onClick={signinWithGoogle}
                    disabled={googleSigninPending}
                    loading={googleSigninPending}
                >
                    Compte Google
                </Button> */}
                <div className="text-center text-sm text-muted-foreground">
                    Pas encore de compte?{' '}
                    <Link href="/signup" className={"text-primary font-medium hover:underline"}>Créer un compte</Link>
                </div>
            </CardContent>
        </Card>
    )
}
