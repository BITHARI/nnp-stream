'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAuth } from "@/services/auth"
import { usePathname, useRouter } from "next/navigation"
import { AxiosResponse } from "axios"


type User = {
    id: string
    image?: string
    name: string
    email: string
    userRole: string
}

type AuthContextType = {
    user: User | null
    isAuthenticated: boolean,
    isAdmin: boolean,
    setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>
    isLoadingUser: boolean
    refetch: () => void,
    refetchAsync?: () => Promise<any>
    saveCurrentLocation: () => void
    redirectToSavedLocation: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoadingUser: true,
    refetch: () => { },
    saveCurrentLocation: () => { },
    redirectToSavedLocation: () => { },
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const { data, isPending: isLoadingUser, refetch, isRefetching } = useQuery<AxiosResponse<{
        isAuthenticated: boolean,
        user: User
    }>>({
        queryKey: ["loginInfo"],
        queryFn: () => getAuth(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const [wasAuthenticated, setWasAuthenticated] = useState(false)

    const user = data?.data.user || null
    const isAuthenticated = data?.data.isAuthenticated || false
    const isAdmin = user ? ["ADMIN", "SUPERADMIN"].includes(user.userRole) : false
    const pathname = usePathname()
    const router = useRouter()

    const saveCurrentLocation = () => {
        localStorage.removeItem('auth_redirect_url')
        if (pathname !== '/') {
            localStorage.setItem('auth_redirect_url', pathname)
        }
    }

    const redirectToSavedLocation = () => {
        const savedUrl = localStorage.getItem('auth_redirect_url')
        if (savedUrl && savedUrl !== pathname) {
            router.push(savedUrl)
            return true
        }
        return false
    }

    const queryClient = useQueryClient()
    useEffect(() => {
        if (isLoadingUser && !isRefetching) return
        const newIsAuthenticated = !!user
        if (!wasAuthenticated && newIsAuthenticated) {
            queryClient.invalidateQueries()
            redirectToSavedLocation()
        }
        setWasAuthenticated(newIsAuthenticated)
    }, [isLoadingUser, isRefetching])

    return <AuthContext.Provider value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoadingUser,
        refetch: () => refetch(),
        refetchAsync: async () => await refetch(),
        saveCurrentLocation,
        redirectToSavedLocation
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


