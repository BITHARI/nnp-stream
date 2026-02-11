import NnpLogo from '@/components/icons/NnpLogo'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className='relative flex min-h-svh flex-col items-center justify-center'>
        <Link href='/' className={buttonVariants({
            variant: 'outline',
            className: 'absolute left-4 top-4'
        })}>
            <ArrowLeft className='size-4' />Retour
        </Link>
        <div className='flex w-full max-w-sm flex-col gap-6 px-4 md:px-0'>
            <Link href='/' className='flex items-center gap-0 self-center font-medium'>
                <NnpLogo />
            </Link>
            {children}
            <div className="text-balance text-center text-xs text-muted-foreground">
                <span className='hover:text-primary hover:underline'>Conditions générales d'utilisation</span> et <span className='hover:text-primary hover:underline'>politique de confidentialité</span>
            </div>
        </div>
    </div>
}
