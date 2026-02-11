'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifyEmailSchema, verifyEmailSchemaType } from '@/lib/zodSchemas'
import { toast } from 'sonner'
import { verifyEmail } from '@/services/auth'
import { useLocalEmail } from '@/hooks/use-local-email'
import { useEffect } from 'react'
import { showError } from '@/lib/utils'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

export default function VerifyEmailPage() {

    const email = useLocalEmail()
    const form = useForm<verifyEmailSchemaType>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            token: '',
            email: email,
        },
    })

    const router = useRouter()
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            const { token } = data.data.session
            localStorage.setItem("nnp-stream-token", token)
            queryClient.invalidateQueries({ queryKey: ["loginInfo"] })
            router.push("/")
        }
    })

    const onSubmit = async (data: verifyEmailSchemaType) => {
        try {
            await mutateAsync({ ...data, email: email ? email : data.email })
            toast.success("Email vérifié avec succès")
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
                <CardTitle className='text-xl'>Vérification d'email</CardTitle>
                <CardDescription>
                    Saisissez le code reçu par email pour vérifier votre compte
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        {!email && <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='flex flex-row gap-2'>
                                    <FormLabel className='w-45'>Email</FormLabel>
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
                        />}
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem className='flex flex-row gap-2'>
                                    <FormLabel className='w-45'>Code</FormLabel>
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
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            loading={isPending}
                        >
                            Vérifier l'email
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}