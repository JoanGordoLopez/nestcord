"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FollowersList } from "@/components/profile/followers/followers-list"
import Link from "next/link"
import useSWR from "swr"

interface User {
  id: string
  username: string
  name: string
  avatar: string
  followers: number
  following: number
}

interface FollowersContentProps {
  user: User
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function FollowersContent({ user }: FollowersContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("followers")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: followerData } = useSWR(`/user/${user.id}/followers`, fetcher, {
    fallbackData: { count: user.followers },
    revalidateOnFocus: false,
  })

  const followerCount = followerData?.count || 0

  useEffect(() => {
    if (activeTab === "following") {
      router.push(`/${user.username}/following`)
    }
  }, [activeTab, router, user.username])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // This is where you would implement the search functionality
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6 px-4 py-3">
          <Link href={`/${user.username}`} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-xl">{user.name}</h1>
            <p className="text-gray-500 text-sm">
              @{user.username} · {followerCount} Followers
            </p>
          </div>
        </div>

        <Tabs defaultValue="followers" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full justify-between bg-transparent">
            <TabsTrigger
              value="followers"
              className="flex-1 rounded-none border-0 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Followers
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 rounded-none border-0 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search Bar */}
      <div className="sticky top-[105px] z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center justify-center pl-4">
              <Search className="h-5 w-5 text-gray-500" />
            </div>

            <Input
              type="text"
              placeholder="Search followers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent py-2 pl-2 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Followers List */}
      <FollowersList username={user.username} searchQuery={searchQuery} id={user.id} />
    </>
  )
}
