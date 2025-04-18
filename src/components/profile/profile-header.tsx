"use client"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { createClient } from "@/database/client"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    ArrowLeft,
    Calendar,
    Flag,
    LinkIcon,
    ListPlus,
    MapPin,
    MoreHorizontal,
    Share,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/profile/profile-avatar"
import dayjs from "dayjs"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

interface ProfileHeaderProps {
    id: string
    username: string
    name: string
    avatar: string
    banner?: string
    biography?: string
    location?: string
    website?: string
    following: number
    followers: number
    created_at: string
    isFollowing?: boolean
}

export function ProfileHeader({
    id,
    username,
    name,
    avatar,
    banner,
    biography,
    location,
    website,
    following,
    followers,
    created_at,
    isFollowing = false,
}: ProfileHeaderProps) {
    const { user } = useUser()
    const router = useRouter()
    const [isFollowingState, setIsFollowingState] = useState(isFollowing)
    const [followersCount, setFollowersCount] = useState(followers)
    const [isLoading, setIsLoading] = useState(false)
    const db = createClient()
    useEffect(() => {
        if (!id || !user?.id) return

        const fetchFollowData = async () => {
            try {
                // Verificar si el usuario actual sigue al perfil
                const { data: followData, error: followError } = await db
                    .from("follows")
                    .select("id")
                    .eq("author", id)
                    .eq("follower", user.id)
                    .single() // Traemos solo una relación si existe

                if (followError && followError.code !== "PGRST116")
                    throw followError // Ignoramos error si no hay resultado

                setIsFollowingState(!!followData) // Si followData existe, está siguiendo

                // Contar el total de seguidores
                const { data: countData, error: countError } = await db
                    .from("follows")
                    .select("id", { count: "exact" }) // Contamos el total de seguidores
                    .eq("author", id)

                if (countError) throw countError

                setFollowersCount(countData.length) // Establecemos el total de seguidores
            } catch (error) {
                console.error("Error fetching follow data:", error)
            }
        }

        fetchFollowData()
    }, [db, id, user?.id]) // Se ejecuta cuando cambia el ID del perfil o el usuario actual

    const isCurrentUser = user?.id === id
    const joinDate = dayjs(created_at).format("MMMM YYYY")

    const handleFollow = async () => {
        if (isLoading || !user?.id || isCurrentUser) return

        setIsLoading(true)
        try {
            const { data: existingFollow } = await db
                .from("follows") // Tabla correcta
                .select("id")
                .eq("follower", user.id) // Columna correcta
                .eq("author", id)
                .single()

            if (existingFollow) {
                // Ya sigue al usuario, lo dejamos de seguir
                await db
                    .from("follows") // Tabla correcta
                    .delete()
                    .eq("id", existingFollow.id)
                    .single()

                setIsFollowingState(false)
                setFollowersCount((prev) => prev - 1)
            } else {
                // No sigue al usuario, lo empezamos a seguir
                await db
                    .from("follows") // Tabla correcta
                    .insert({ follower: user.id, author: id })
                    .single()

                setIsFollowingState(true)
                setFollowersCount((prev) => prev + 1)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditProfile = () => {
        router.push("/settings/profile/")
    }

    const handleFollowersRoute = () => {
        router.push(`/${username}/followers`)
    }

    const handleShare = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title: 'Share Link',
                text: 'Share this profile link with your friends!',
                url: username,
            })
            .then(() => console.log('[LOG]: Share API Link was successful'))
            .catch((error) => console.error('Error sharing link:', error));
        } else {
            console.log('[Error]: Share API is not supported in this browser');
        }
    }, [username]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(username);
    }

    return (
        <div className="relative">
            {/* Header with back button */}
            <div className="sticky top-0 z-10 flex items-center gap-6 bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 px-4">
                <button
                    onClick={() => router.back()}
                    className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="font-bold text-xl">{name}</h1>
                    <p className="text-gray-500 text-sm">Public Profile</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                {banner ? (
                    <Image
                        src={banner || "/placeholder.svg"}
                        alt={`${name}'s banner`}
                        fill
                        className="object-cover"
                    />
                ) : null}
            </div>

            {/* Profile info section */}
            <div className="px-4 pb-3 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-4">
                    <UserAvatar avatar={avatar} username={username} size="xl" />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end mt-3 mb-4">
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border border-gray-300 dark:border-gray-700"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>

                            <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                    onClick={handleFollowersRoute}>
                        <ListPlus className="w-5 h-5 mr-3 text-black dark:text-white" />
                        <span>View Followers</span>
                    </DropdownMenuItem>

                            <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                            onClick={handleShare}>
                        <Share className="w-5 h-5 mr-3 text-black dark:text-white" />
                        <span>Share Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                    onClick={handleCopyLink}>
                        <LinkIcon className="w-5 h-5 mr-3 text-black dark:text-white" />
                        <span>Profile Link</span>
                    </DropdownMenuItem>

                    {/** If the username is not the same as the actual user show content */}
                    {user?.username !== username && (
                                            <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                                            onClick={handleCopyLink}>
                                                <Flag className="w-5 h-5 mr-3 text-black dark:text-white" />
                                                <span>Report @{username}</span>
                                            </DropdownMenuItem>
                    )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border border-gray-300 dark:border-gray-700"
                            onClick={handleShare}
                        >
                            <Share className="h-5 w-5" />
                        </Button>

                        {isCurrentUser ? (
                            <Button
                                variant="outline"
                                onClick={handleEditProfile}
                                className="rounded-full border border-gray-300 dark:border-gray-700 font-bold"
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <Button
                                variant={
                                    isFollowingState ? "outline" : "default"
                                }
                                onClick={handleFollow}
                                disabled={isLoading}
                                className={`rounded-full font-bold ${
                                    isFollowingState
                                        ? "border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-transparent"
                                        : "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                }`}
                            >
                                {isFollowingState
                                    ? isLoading
                                        ? "Unfollowing..."
                                        : "Following"
                                    : isLoading
                                      ? "Following..."
                                      : "Follow"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* User info */}
                <div className="mt-12">
                    <h1 className="font-bold text-xl">{name}</h1>
                    <p className="text-gray-500">@{username}</p>

                    {biography && (
                        <p className="mt-3 whitespace-pre-wrap">{biography}</p>
                    )}

                    <div className="flex flex-wrap gap-x-4 mt-3 text-gray-500 text-sm">
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{location}</span>
                            </div>
                        )}

                        {website && (
                            <div className="flex items-center gap-1">
                                <LinkIcon className="h-4 w-4" />
                                <a
                                    href={
                                        website.startsWith("http")
                                            ? website
                                            : `https://${website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-500 hover:underline"
                                >
                                    {website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Joined at {joinDate}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-3 text-sm">
                    <button className="hover:underline">
                            <Link href={`/${username}/followers`}>
                            <span className="font-bold">{followersCount}</span>{" "}
                            <span className="text-gray-500">Followers</span>
                            </Link>
                        </button>
                        
                        <button className="hover:underline">
                            <Link href={`/${username}/following`}>
                            <span className="font-bold">{following}</span>{" "}
                            <span className="text-gray-500">Following</span>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
