"use client"

import useSWRInfinite from "swr/infinite"
import { useEffect } from "react"
import type { StatusType } from "@/lib/types"
import StatusCard from "@/components/status/status-card"
import React from "react"
import { Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AppFollowingFeed() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.nextCursor) return null
        return `/api/feed/following?cursor=${previousPageData?.nextCursor ?? ""}&limit=10`
    }

    const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
        getKey,
        fetcher
    )

    const following = data ? data.flatMap((page) => page.status) : []

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 500 &&
                !isValidating
            ) {
                setSize(size + 1)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [size, isValidating, setSize])

    return (
        <>
            {isLoading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            )}
            {!isLoading && following.length === 0 && (
                <div className="flex justify-center py-4">
                    <p className="text-sm text-gray-500">
                        You are not following anyone yet.
                    </p>
                </div>
            )}
            {!isLoading && following.length > 0 && (
                <section>
                    {following.map((following: StatusType) => (
                        <div key={following.id} className="border-b">
                            <StatusCard {...following} />
                        </div>
                    ))}
                </section>
            )}
        </>
    )
}
