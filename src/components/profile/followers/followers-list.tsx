/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useUser } from "@/context/user-context"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BadgeCheck } from 'lucide-react'
import { followUser } from "@/actions/profile/follow-user"
import useSWR from "swr"
interface Follower {
  id: string
  name: string
  username: string
  avatar: string
  biography?: string
  isVerified?: boolean
  isFollowing?: boolean
  followDate?: Date
}

interface FollowersListProps {
  username: string
  searchQuery: string
  id: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function FollowersList({ username, searchQuery, id }: FollowersListProps) {
  const { user: currentUser } = useUser()
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Configure for when the user reaches the end of the list
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  const { data, error, isLoading } = useSWR(`/user/${id}/followers`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  useEffect(() => {
    if (data) {
      const followersDetails = data.data.map((follow: any) => {
        {/** Verify if the authenticated user is following the author */}

        return {
          id: follow.id,
          name: follow.follower.name,
          username: follow.follower.username,
          avatar: follow.follower.avatar,
          biography: follow.follower.biography,
          isVerified: follow.follower.isVerified,
          isFollowing: follow.author.id === currentUser?.id,
          followDate: follow.created_at,
        }
      })

      // Aplicar filtro de búsqueda si existe
      if (searchQuery.trim() === "") {
        setFilteredFollowers(followersDetails)
      } else {
        const filtered = followersDetails.filter(
          (follower: { name: string; username: string; biography: string }) =>
            follower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            follower.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (follower.biography && follower.biography.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        setFilteredFollowers(filtered)
      }

      setHasMore(followersDetails.length >= 20)
    }
  }, [currentUser?.id, data, searchQuery])

  useEffect(() => {
    if (inView && hasMore && !isLoading && !loadingMore) {
      const loadMoreFollowers = async () => {
        setLoadingMore(true)

        try {
          const response = await fetch(`/api/user/${id}/followers?page=${page + 1}`)
          const moreData = await response.json()

          if (moreData && moreData.length > 0) {
            const moreFollowers = moreData.map((follow: any) => ({
              id: follow.id,
              name: follow.author.name,
              username: follow.author.username,
              avatar: follow.author.avatar || "/placeholder.svg?height=48&width=48",
              biography: follow.author.biography,
              isVerified: follow.author.isVerified,
              isFollowing: follow.isFollowing,
              followDate: follow.created_at,
            }))

            setFilteredFollowers((prev) => [...prev, ...moreFollowers])
            setPage((prev) => prev + 1)
            setHasMore(moreFollowers.length >= 10) // Set hasMore to true if there are more than 10 followers
          } else {
            setHasMore(false)
          }
        } catch (err) {
          console.error("Error loading more followers:", err)
          setHasMore(false)
        } finally {
          setLoadingMore(false)
        }
      }

      loadMoreFollowers()
    }
  }, [inView, hasMore, isLoading, loadingMore, page, id])

  // Manejar seguir/dejar de seguir
  const handleFollowToggle = async (followerId: string) => {
    if (!currentUser) return

    try {
      const result = await followUser(currentUser.id, followerId)

      if (result.success) {
        // Actualizar la UI optimísticamente
        setFilteredFollowers((prev) =>
          prev.map((follower) =>
            follower.id === followerId ? { ...follower, isFollowing: !follower.isFollowing } : follower
          )
        )
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-2 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-3 w-full max-w-md" />
            </div>
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-red-500 mb-4">Error loading followers</p>
        <Button
          onClick={() => window.location.reload()}
          className="rounded-full bg-sky-500 hover:bg-sky-600 text-white"
        >
          Try again
        </Button>
      </div>
    )
  }

  if (!data || filteredFollowers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {searchQuery ? (
          <>
            <h2 className="text-xl font-bold mb-2">No results found for &quot;{searchQuery}&quot;</h2>
            <p className="text-gray-500">Try with another search</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">@{username} no has followers yet</h2>
            <p className="text-gray-500">When someone follows this user, it will appear here.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {filteredFollowers.map((follower) => (
        <div key={follower.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
          <div className="flex items-start justify-between">
            <Link href={`/${follower.username}`} className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={follower.avatar} alt={follower.name} />
                <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold truncate">{follower.name}</span>
                  {follower.isVerified && <BadgeCheck className="h-4 w-4 text-sky-500" fill="#0ea5e9" />}
                </div>
                <div className="text-gray-500 text-sm truncate">@{follower.username}</div>
                {follower.biography && <p className="text-sm mt-1 line-clamp-2">{follower.biography}</p>}
                {follower.followDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Follower since {new Date(follower.followDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Link>

            {follower.username !== currentUser?.username && (
              <Button
                onClick={() => handleFollowToggle(follower.id)}
                variant={follower.isFollowing ? "outline" : "default"}
                className={`rounded-full font-bold ${
                  follower.isFollowing
                    ? "border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-transparent"
                    : "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                }`}
              >
                {follower.isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Elemento para detectar cuando se llega al final de la lista */}
      {hasMore && (
        <div ref={ref} className="py-4 flex justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}

      {/* Mensaje cuando no hay más seguidores */}
      {!hasMore && filteredFollowers.length > 10 && (
        <div className="py-8 text-center text-gray-500">There are no more followers to show</div>
      )}
    </div>
  )
}