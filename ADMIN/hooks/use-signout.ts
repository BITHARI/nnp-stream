import { authClient } from "@/lib/auth-client"
import { showError } from "@/lib/utils"
import { signOut } from "@/services/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export default function useSignout() {
    const [signoutPending, startSignout] = useTransition()
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleSignout = async () => {
        startSignout(async () => {
            try {
                toast.loading("Deconnexion en cours...")
                await signOut()
                queryClient.invalidateQueries({ queryKey: ["loginInfo"] })
                router.push("/")
                toast.dismiss()
            } catch (error) {
                toast.dismiss()
                showError(error)
            }
        })
    }

    return { signoutPending, handleSignout }
}