import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"

import Sidebar from "@/components/navigation/sidebar/sidebar"
import { UserContextProvider } from "@/context/user-context"
import { Aside } from "@/components/navigation/aside/aside"

interface AppLayoutProps {
    children: ReactNode
}

export const metadata: Metadata = {
    title: "Home | Nestcord",
    description:
        "Join Nestcord, the modern social platform to chat, share posts, and connect with friends in real-time. Experience the next generation of social networking.",
    keywords: [
        "Nestcord",
        "Nestcord Web",
        "Nestcord App",
        "social media",
        "chat app",
        "instant messaging",
        "social network",
        "connect with friends",
        "real-time chat",
        "community platform",
        "digital social space",
        "online conversations",
        "modern social network",
    ],
    openGraph: {
        title: "Home | Nestcord",
        description:
            "Join Nestcord, the modern social platform to chat, share posts, and connect with friends in real-time.",
        url: "https://nestcord.vercel.app/",
        siteName: "Nestcord",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://nestcord.vercel.app/images/background.webp", // Sustituye con la URL de la imagen que subiste
                width: 1200,
                height: 630,
                alt: "Nestcord - Connect, Chat & Share",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
        },
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export const dynamic = "force-dynamic"
const AppLayout = (props: AppLayoutProps) => {
    return (
        <>
            <main className="min-h-screen bg-white text-black dark:bg-background dark:text-white">
                <div className="mx-auto flex max-w-7xl">
                    <UserContextProvider>
                        <Sidebar />
                        {props.children}
                        <Aside />
                    </UserContextProvider>
                </div>
            </main>
        </>
    )
}

export default AppLayout
