import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google";
import "./main.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
export const metadata: Metadata = {
    title: "Nestcord - Connect, Chat & Share",
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
        title: "Nestcord - Connect, Chat & Share",
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
};


export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    {children}
            </body>
        </html>
    )
}
