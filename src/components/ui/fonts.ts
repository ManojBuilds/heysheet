import { DM_Sans, Geist_Mono } from "next/font/google";

export const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '600']
})

export const geistMono = Geist_Mono({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-geist-mono'
})
