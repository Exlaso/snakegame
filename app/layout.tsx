import type {Metadata} from 'next'
import {Montserrat} from 'next/font/google'
import './globals.css'
import React from "react";

const inter = Montserrat({subsets: ['latin']})

export const metadata: Metadata = {
    title: "Snake Game | Home",
    description: "Snake Game created by Vedant Bhavsar",
    metadataBase: new URL("https://snakegame.exlaso.in"),
    keywords: ["Snake", "Game", "Vedant", "Bhavsar", "Exlaso", "Exlaso.in", "Vedant Bhavsar", "Snake Game"],
    robots: "index, follow",
    icons: new URL("https://exlaso.in/icon.svg"),
    authors: [
        {
            name: "Vedant Bhavsar",
            url: "https://exlaso.in",
        }]
    ,
    openGraph: {
        type: "website",
        url: "https://snakegame.exlaso.in",
        title: "Snake Game | Home",
        description: "Snake Game created by Vedant Bhavsar",
        images: [
            {
                url: "https://exlaso.in/icon.svg",
                width: 512,
                height: 512,
                alt: "Snake Game created by Vedant Bhavsar"
            }
        ],
        siteName: "Snake Game",
        locale: "en_IN",
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-start p-12">

            {children}
        </main>
        </body>
        </html>
    )
}
