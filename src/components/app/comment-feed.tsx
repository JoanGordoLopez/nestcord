"use client"

import useSWRInfinite from "swr/infinite"
import { useEffect } from "react"
import { StatusType } from "@/lib/types"
import StatusCard from "@/components/status/status-card"
import StatusReply from "../status/status-reply"
import useSWR from "swr"
import React from "react"
import ReplyCard from "../status/status-reply-card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Statuscomment({ id }: { id: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.nextCursor) return null
        return `/api/feed?id=${id}`
    }

    const isMobile = useIsMobile()

    const { data: statusReplies, isLoading: isLoadingStatus } = useSWR(
        `/api/status/reply/${id}`,
        fetcher
    )

    const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
        getKey,
        fetcher
    )
    const status = data ? data.flatMap((page) => page.status) : []
    const replies = statusReplies ? statusReplies.statusReplies : []

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
        <section
            className={`border-x ${isMobile ? "flex-1" : "w-[600px]"}`}
            id="feed"
        >
            <Link href="/home">
                <h1 className="p-2 flex items-center">
                    <span className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Move to Home
                    </span>
                </h1>
            </Link>
            {/** Loading state */}
            {isLoading && (
                <div className="flex justify-center py-4 ">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            )}

            {isLoadingStatus && (
                <div className="flex justify-center py-4 ">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            )}

            {/** Loaded state */}

            <div className="border-b border-l border-r border-t">
                {status.map((status: StatusType) => (
                    <React.Fragment key={status.id}>
                        <StatusCard {...status} />

                        <div className="border-t border-b">
                            <StatusReply {...status} />
                        </div>
                    </React.Fragment>
                ))}

                {replies.map((replies: StatusType) => (
                    <div key={replies.id} className="border-b">
                        <ReplyCard {...replies} />
                    </div>
                ))}
            </div>
        </section>
    )
}
