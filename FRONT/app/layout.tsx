import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/QueryProvider";
import { AxiosInterceptorProvider } from "@/providers/AxiosInterceptorProvider";
import { albertSans, merriweather, firaCode } from '@/lib/fonts'
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
    title: "NNP Stream",
    description: "Nous aimoms raconter des histoires... nos histoires!",
    icons: {
        // icon: "/pichakubwalogo.webp",
        // apple: "/pichakubwalogo.webp",
        // shortcut: "/pichakubwalogo.webp",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            suppressHydrationWarning
            className={`${albertSans.variable} ${merriweather.variable} ${firaCode.variable}`}
        >
            <body
                className={`${albertSans.variable} relative min-h-screen bg-nnp-primary overflow-x-hidden`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AxiosInterceptorProvider>
                        <QueryProvider>
                            <AuthProvider>
                                {children}
                                <Toaster richColors />
                            </AuthProvider>
                        </QueryProvider>
                    </AxiosInterceptorProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
