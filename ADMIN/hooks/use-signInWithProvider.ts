import { authClient } from "@/lib/auth-client"
import { showError } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export default function useSignInWithProvider({
    provider = "google",
    redirect = false,
    redirectToPath = "/"
}: { provider?: string, redirect?: boolean, redirectToPath?: string }) {
    const [signinPending, startSignin] = useTransition()
    const queryClient = useQueryClient()
    const router = useRouter()
    const signIn = async () => {
        startSignin(async () => {
            try {
                await authClient.signIn.social({
                    provider: provider,
                    // callbackURL: process.env.NEXT_PUBLIC_SIGNIN_CALLBACK_URL,
                    disableRedirect: true
                })
                const { data: session } = await authClient.getSession()
                console.log({ session })
                if (session) {
                    localStorage.setItem("nnp-stream-token", session.session.token)
                    queryClient.invalidateQueries({ queryKey: ["loginInfo"] })
                    toast.success("Connexion réussie")
                    if (redirect) router.push(redirectToPath)
                    return
                }
                console.error("Session not found after successful OAuth")
                toast.error("Erreur lors de la création de la session")

            } catch (error) {
                showError(error)
            }
        })
    }
    return {
        signIn,
        signinPending
    }
}