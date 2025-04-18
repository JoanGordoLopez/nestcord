"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"

import { ExploreTrending } from "@/components/explore/explore-trending"
import { ExploreNews } from "@/components/explore/explore-news"
import { ExploreSports }  from "@/components/explore/explore-sports"
import { ExploreSearch } from "@/components/explore/explore-search"

export function ExploreContent() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("for-you")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Efecto para manejar el scroll y fijar la barra de búsqueda
  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.getElementById("explore-search")
      if (searchBar) {
        if (window.scrollY > 10) {
          searchBar.classList.add("bg-white/80", "dark:bg-black/80", "backdrop-blur-md")
        } else {
          searchBar.classList.remove("bg-white/80", "dark:bg-black/80", "backdrop-blur-md")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className={`border-x border-gray-200 dark:border-gray-800 ${isMobile ? "flex-1" : "w-[600px]"}`}>
      {/* Barra de búsqueda fija */}
      <div id="explore-search" className="sticky top-0 z-10 px-4 py-2 transition-colors duration-200">
        <ExploreSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsSearching={setIsSearching} />
      </div>

      {isSearching ? (
        // Resultados de búsqueda
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold mb-4">Results for &quot;{searchQuery}&quot;</h2>
          {/* Aquí irían los resultados de búsqueda */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">User {i + 1}</span>
                      <span className="text-gray-500">@user{i + 1}</span>
                    </div>
                    <p className="mt-1">
                      This is a search result for &quot;{searchQuery}&quot;. Here you will find related content related to your search.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Contenido de exploración
        <Tabs defaultValue="for-you" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="sticky top-13 z-10 flex w-full justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <TabsTrigger
              value="for-you"
              className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Trendings
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              News
            </TabsTrigger>
            <TabsTrigger
              value="sports"
              className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Sports
            </TabsTrigger>

          </TabsList>

          <TabsContent value="for-you" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0">
            <ExploreTrending />
          </TabsContent>

          <TabsContent value="news" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0">
            <ExploreNews />
          </TabsContent>

          <TabsContent value="sports" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0">
            <ExploreSports />
          </TabsContent>

        </Tabs>
      )}
    </main>
  )
}

