"use client"
import { useUser } from "@/context/user-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import UserAvatar from "@/components/profile/profile-avatar"

import {
    CalendarDays,
    LinkIcon,
    MapPin,
    BriefcaseConveyorBelt,
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

type Profile = {
    id: string
    username: string
    name: string
    avatar: string
    biography: string
    location: string
    category: string
    website: string
    following: number
    followers: number
    created_at: string
}

dayjs.extend(relativeTime)

export function Profile({
    id,
    username,
    name,
    avatar,
    biography,
    location,
    category,
    website,
    following,
    followers,
    created_at,
}: Profile) {
    const { user } = useUser()
    const userId = user?.id
    const createdAt = dayjs(created_at).fromNow()

    return (
        <section className="w-full max-w-[800px] px-4 md:px-0 mx-auto md:ml-18 max-sm:ml-12 max-sm:w-[340px]">
            <Card className="w-full overflow-hidden shadow-md rounded-lg">
                {/* Banner */}
                <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 md:ml-4">
                    <Image
                        src={"/assets/default-profile-banner.webp"}
                        alt={`${name}'s banner`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                </div>

                <CardContent className="relative px-6 py-8">
                    {/* Avatar */}
                    <div className=" absolute -top-16 left-6 sm:left-8 border-4 border-white dark:border-gray-900 rounded-full">
                        <UserAvatar avatar={avatar} username={username} />
                    </div>

                    {/* Header: Name, Username, Edit Profile */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8">
                        <div>
                            <h1 className="text-2xl font-bold">{name}</h1>
                            <p className="text-sm text-gray-500">@{username}</p>
                        </div>

                        {userId === id && (
                            <button className="px-4 py-2 mt-4 sm:mt-0 text-sm font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Biography */}
                    {biography && (
                        <p className="mt-4 text-sm text-gray-800 dark:text-gray-300">
                            {biography}
                        </p>
                    )}

                    {/* Additional Info: Location, Website, Join Date */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                {location}
                            </div>
                        )}
                        {website && (
                            <div className="flex items-center gap-1">
                                <LinkIcon size={16} />
                                <a
                                    href={`https://${website.replace(/^https?:\/\//, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}

                        {/* Category */}
                        {category && (
                            <div className="flex items-center gap-1">
                                <BriefcaseConveyorBelt size={16} />
                                <span className="text-gray-500">
                                    {category}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <CalendarDays size={16} />
                            Joined {createdAt}
                        </div>
                    </div>

                    {/* Following & Followers */}
                    <div className="flex gap-6 mt-4 text-sm font-medium">
                        <span>
                            <strong>{following}</strong>{" "}
                            <span className="text-gray-500">Following</span>
                        </span>
                        <span>
                            <strong>{followers}</strong>{" "}
                            <span className="text-gray-500">Followers</span>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
