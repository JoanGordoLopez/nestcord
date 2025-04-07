"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { useIsMobile } from "@/hooks/use-mobile"
import { useUser } from "@/context/user-context"

import { SidebarAccount } from "@/components/navigation/sidebar/sidebar-account"

import {
    Home,
    Search,
    Bell,
    User,
    Download,
} from "lucide-react"
import SidebarPost from "@/components/navigation/sidebar/sidebar-post"

export default function Sidebar() {
    const isMobile = useIsMobile()
    const { user } = useUser()
    const [expanded] = useState(true)

    const navItems = [
        { icon: Home, label: "Home", href: "/home" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: Bell, label: "Notifications", href: "/notifications" },
        { icon: Download, label: "Download", href: "/" },
        { icon: User, label: "Profile", href: `/${user?.username}` },
    ]

    const pathname = usePathname()

    if (expanded)
        return (
            <div
                className={`sticky top-0 h-screen ${isMobile ? "w-[70px]" : expanded ? "w-[275px]" : "w-[88px]"} flex-shrink-0 py-2 pr-2 border-r`}
            >
                <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex h-22 w-22 items-center justify-center rounded-full p-3">
                            <Link href="/">
                                <Image
                                    src="/images/nestcord-logo.webp"
                                    alt="Nestcord Logo"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </Link>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center gap-4 rounded-full p-5 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors ${
                                            isActive
                                                ? "font-bold text-black dark:text-white"
                                                : ""
                                        }`}
                                    >
                                        <item.icon
                                            className={`h-7 w-7 ${isActive ? "font-bold text-black dark:text-white" : ""}`}
                                        />
                                        {expanded && !isMobile && (
                                            <span className="text-xl">
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                        <div>
                            {expanded && !isMobile ? (
                                <SidebarPost />
                            ) : (
                                <SidebarPost />
                            )}
                        </div>
                    </div>
                    <SidebarAccount />
                </div>
            </div>
        )
}
