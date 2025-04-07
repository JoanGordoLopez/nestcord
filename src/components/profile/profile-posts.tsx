"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import StatusCard from "@/components/status/status-card"
import { Loader2 } from "lucide-react"
import type { CardProps } from "@/components/status/status-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ProfilePosts({ id }: { id: string }) {
    const { data, error, isLoading } = useSWR(`/user/${id}/status`, fetcher)
    const [posts, setPosts] = useState<CardProps[]>([])

    useEffect(() => {
        if (data) {
            setPosts(data)
        }
    }, [data])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-red-500">
                    There was an error while loading posts
                </p>
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">No posts yet</h2>
                <p className="text-gray-500 mb-6">
                    This user hasn&apos;t published any posts yet.
                </p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post) => (
                <StatusCard key={post.id} {...post} />
            ))}
        </div>
    )
}
