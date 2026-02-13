'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 120000
        }
    }
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {

    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}
