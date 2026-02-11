'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, forgotPasswordSchemaType } from '@/lib/zodSchemas'
import { toast } from 'sonner'
import Link from 'next/link'
import { showError } from '@/lib/utils'

export default function ForgotPasswordPage() {
    const form = useForm<forgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            router.push('/set-new-password')
        }
    })

    const onSubmit = async (data: forgotPasswordSchemaType) => {
        try {
            localStorage.setItem('picha-kubwa-user-email', data.email)
            await mutateAsync(data)
            toast.success("Email de réinitialisation envoyé", { duration: 10000 })
        } catch (error: any) {
            showError(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className='text-xl'>Mot de passe oublié</CardTitle>
                <CardDescription>
                    Saisissez votre email pour recevoir pour recevoir le code de réinitialisation
                </CardDescription>
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            loading={isPending}
                        >
                            Recevoir le code de réinitialisation
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    Retour à la{" "}<Link href="/login" className={"text-primary font-medium hover:underline"}>connexion</Link>
                </div>
            </CardContent>
        </Card>
    )
}