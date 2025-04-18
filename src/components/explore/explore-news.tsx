"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NewsItem {
  id: string
  source: string
  title: string
  time: string
  image?: string
}

export function ExploreNews() {
  // Datos de ejemplo para noticias
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: "1",
      source: "BBC News",
      title: "Ukraine's 'chaotic' withdrawal from Russia, in its soldiers' words",
      time: "12 hours ago",
    },
    {
      id: "2",
      source: "BBC News",
      title: "Sudan army retakes presidential palace as Khartoum battle rages",
      time: "LIVE",
    },
    {
      id: "3",
      source: "BBC News",
      title: "Netanyahu fires Israel's security chief over 'distrust'",
      time: "3 hours ago",
    }
  ])

  const handleHideNews = (id: string) => {
    setNewsItems(newsItems.filter((item) => item.id !== id))
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {/* Noticia destacada */}
      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
          <div className="aspect-[16/9] relative">
            <Image src="https://frhbjqrfnnemrkilykjd.supabase.co/storage/v1/object/public/attachments/image/d758baa0-061d-11f0-88b7-5556e7b55c5e.webp" alt="Featured News in Nestcord" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="text-sm font-medium mb-1">LIVE · BBC News</div>
            <h3 className="text-xl font-bold mb-1">Heathrow shutdown leaves thousands stranded as UK and international flights disrupted after substation fire            </h3>
            <div className="text-sm">Last updated at 12:00 AM</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Latest News</h2>

        {/* Lista de noticias */}
        {newsItems.map((item) => (
          <div key={item.id} className="py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-500">{item.source}</div>
                <h3 className="font-bold">{item.title}</h3>
                <div className="text-sm text-gray-500">{item.time}</div>
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
                  <DropdownMenuItem onClick={() => handleHideNews(item.id)} className="cursor-pointer">
                    No me interesa esta noticia
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    No me interesan noticias de {item.source.split(" · ")[1]}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Reportar esta noticia</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

