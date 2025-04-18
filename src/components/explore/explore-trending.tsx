"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useSWR from "swr"
import { UserType } from "@/lib/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface TrendingItem {
  id: string
  category: string
  title: string
  postCount: number
  image?: string
}


const fetcher = (url: string) => fetch(url).then((r) => r.json())
export function ExploreTrending() {
  const { data } = useSWR("/api/user/lookup", fetcher)

  const usersToShow = data ? data.slice(0, 5) : []
  // Datos de ejemplo para tendencias
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([
    {
      id: "1",
      category: "Technology · Trending",
      title: "TypeScript 5.4",
      postCount: 32.500,
    },
    {
      id: "2",
      category: "Sports · Trending",
      title: "Champions League",
      postCount: 125.300,
    },
    {
      id: "3",
      category: "Entertainment · Trending",
      title: "Entertainment",
      postCount: 85.700,
    },
    {
      id: "4",
      category: "Gaming · Trending",
      title: "Grand Theft Auto VI",
      postCount: 20.400,
    }
  ])

  const handleNotInterested = (id: string) => {
    setTrendingItems(trendingItems.filter((item) => item.id !== id))
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {/* Sección destacada */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Trending for you</h2>

        {/* Elemento destacado */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
          <div className="aspect-[16/9] relative">
            <Image
              src="https://frhbjqrfnnemrkilykjd.supabase.co/storage/v1/object/public/attachments/image/143bea48-dc45-426a-9f81-47c29456e47d.jpg"
              alt="Featured Trending in Nestcord"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="text-sm font-medium mb-1">Trending in Gaming</div>
            <h3 className="text-xl font-bold mb-1">Grand Theft Auto VI will be released in 2025</h3>
            <div className="text-sm">20.4K posts</div>
          </div>
        </div>

        {/* Lista de tendencias */}
        {trendingItems.map((item) => (
          <div key={item.id} className="py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-500">{item.category}</div>
                <h3 className="font-bold">{item.title}</h3>
                <div className="text-sm text-gray-500">{item.postCount} posts</div>
              </div>

              {item.image && (
                <div className="ml-4 h-16 w-16 rounded-xl overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <DropdownMenuItem
                    onClick={() => handleNotInterested(item.id)}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    No me interesa
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Esta tendencia es dañina o spam</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

      </div>

      {/* Sección de quién seguir */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>

        {usersToShow.map((user: UserType) => (
          <div key={user.id} className="flex items-center justify-between py-3">
            <Link href={`/${user.username}`}>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 mr-3">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gray-700 text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-gray-500">@{user.username}</div>
              </div>
            </div>
            </Link>
            <Button className="rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
              Follow
            </Button>
          </div>
        ))}

        <Link href="/explore/people" className="block text-indigo-500 hover:underline py-4">
          Show more
        </Link>
      </div>
    </div>
  )
}

