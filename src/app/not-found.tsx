"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import Sidebar from "@/components/navigation/sidebar/sidebar"
import { Aside } from "@/components/navigation/aside/aside"

import { Button } from "@/components/ui/button"
import { UserContextProvider } from "@/context/user-context"

export default function NotFound() {
    const pathname = usePathname()

    return (
        <UserContextProvider>
        <div className="min-h-screen bg-background text-black dark:text-white">
            <div className="mx-auto flex max-w-7xl">
                <Sidebar />

                <main className="flex-1 border-x border-gray-200 dark:border-gray-800 min-h-screen flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        @{pathname.split("/")[1]} user not found
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Try searching for something else.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full"
                        >
                            <Link href="/">Back to home</Link>
                        </Button>

                        <Button
                            asChild
                            className="rounded-full bg-indigo-500 hover:bg-indigo-600"
                        >
                            <Link href="/explore">Explore</Link>
                        </Button>
                    </div>
                </main>

                <Aside />
            </div>
        </div>
        </UserContextProvider>
    )
}
