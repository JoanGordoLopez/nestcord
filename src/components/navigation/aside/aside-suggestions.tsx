"use client"

import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UserType {
    id: string
    name: string
    username: string
    avatar: string
    created_at: string
}

export function AsideSuggestions() {
    const { data, isLoading } = useSWR("/api/user/lookup", fetcher)
    const router = useRouter()
    const usersToShow = data ? data.slice(0, 3) : []

    return (
            <div className="rounded-xl dark:bg-gray-800 bg-gray-100 mb-4">
                <div className="p-3">
                    <h2 className="text-xl font-bold">Profiles</h2>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                )}
                {usersToShow.map((user: UserType) => (
                    <div
                        key={user.id}
                        className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Link
                            href={`/${user.username}`}
                            className="flex items-center gap-3"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-gray-700 text-white">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{user.name}</p>
                                <p className="text-gray-500">@{user.username}</p>
                            </div>
                        </Link>
                        <Button
                            className="rounded-full bg-white px-4 font-bold text-black hover:bg-gray-200"
                            onClick={() => router.push(`/${user.username}`)}>
                            View Profile
                        </Button>
                    </div>
                ))}
                <div className="cursor-pointer p-3 text-indigo-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-xl">
                    <Link href="/explore">Show more</Link>
                </div>
            </div>    
    )
}
