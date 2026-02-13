import { Albert_Sans, Merriweather, Fira_Code } from 'next/font/google'

export const albertSans = Albert_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
})

export const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    display: 'swap',
    variable: '--font-serif',
})

export const firaCode = Fira_Code({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-mono',
})