'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { setNewPassword } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, resetPasswordSchemaType } from '@/lib/zodSchemas'
import { toast } from 'sonner'
import Link from 'next/link'
import { useLocalEmail } from '@/hooks/use-local-email'
import { useEffect } from 'react'
import PasswordInput from '@/components/ui/password-input'
import { showError } from '@/lib/utils'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'

export default function ResetPasswordPage() {

    const email = useLocalEmail()
    const form = useForm<resetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: '',
            newPassword: '',
            confirmPassword: '',
            email: email || '',
        },
    })
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: setNewPassword,
        onSuccess: () => {
            router.push('/login')
        }
    })

    const onSubmit = async (data: resetPasswordSchemaType) => {
        try {
            await mutateAsync({ ...data, email: email ? email : data.email })
            toast.success("Mot de passe réinitialisé avec succès")
            form.reset()
        } catch (error: any) {
            showError(error)
        }
    }
    useEffect(() => {
        form.setValue('email', email)
    }, [email])
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className='text-xl'>Nouveau mot de passe</CardTitle>
                <CardDescription>Créez votre nouveau mot de passe</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        {!email && <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <>
                                    <FormItem className='flex flex-row gap-2'>
                                        <FormLabel className='flex-1'>Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <Separator className='my-8' />
                                </>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch('newPassword') && <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmer le mot de passe</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Confirmez votre nouveau mot de passe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            loading={isPending}
                        >
                            Réinitialiser le mot de passe
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    Retour à la{' '}<Link href="/login" className={"text-primary font-medium hover:underline"}>connexion</Link>
                </div>
            </CardContent>
        </Card>
    )
}