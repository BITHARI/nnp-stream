'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import api from '@/services/api'

export function useAxiosInterceptor() {
    const router = useRouter()

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("nnp-stream-token")
                    localStorage.removeItem("nnp-stream-user")
                    router.push("/")
                }
                if (error.response && error.response?.status === 404) {
                    router.push("/not-found")
                }
                return Promise.reject(error)
            }
        )
        return () => {
            api.interceptors.response.eject(interceptor)
        }
    }, [router])
}

export function AxiosInterceptorProvider({ children }: { children: React.ReactNode }) {
    useAxiosInterceptor()
    return <>{children}</>
}