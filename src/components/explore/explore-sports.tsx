/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface SportsEvent {
  strTime: string
  status: string
  strLeague: string
  idEvent: string
  league: string
  strEvent: string
  time: string
  image?: string
  score?: string
  strStatus?: "live" | "upcoming" | "Match Finished"
  sport: string
  homeTeam: string
  awayTeam: string
  homeScore?: string
  awayScore?: string
  venue?: string
  strThumb?: string
  strVideo?: string
  strVenue: string
  intHomeScore: string
  intAwayScore: string
}

const API_URL = "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=";
const TEAM_IDS = [133739]; // IDs de dos equipos para variar los resultados

export function ExploreSports() {
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const responses = await Promise.all(
          TEAM_IDS.map(id => fetch(`${API_URL}${id}`).then(res => res.json()))
        );
        const events = responses.flatMap(response => response.results || []);
        setSportsEvents(events.slice(0, 5)); // Solo mostrar 5 partidos
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);
  
  const handleHideEvent = (id: string) => {
    setSportsEvents(sportsEvents.filter((item) => item.idEvent !== id))
  }

  // Encontrar un evento destacado (preferiblemente en vivo)
  const featuredEvent =
    sportsEvents.find((event) => event.strStatus === "live" && event.strThumb) ||
    sportsEvents.find((event) => event.strThumb) ||
    sportsEvents[0]

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error && sportsEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="rounded-full bg-sky-500 hover:bg-sky-600 text-white"
        >
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {/* Evento destacado */}
      <div className="p-4">
        {featuredEvent && (
          <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            <div className="aspect-[16/9] relative">
              <Image
                src={`${featuredEvent.strThumb}`}
                alt={featuredEvent.idEvent}
                fill
                className="object-cover"
              />

              {featuredEvent.strStatus === "live" && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  LIVE
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="text-sm font-medium mb-1">{featuredEvent.league}</div>
              <h3 className="text-xl font-bold mb-1">{featuredEvent.strEvent}</h3>
              <div className="text-sm flex items-center">
                {featuredEvent && (
                  <span className="bg-white text-black px-2 py-1 rounded font-bold mr-2 items-center justify-center">{featuredEvent.intHomeScore} {featuredEvent.intAwayScore}</span>
                )}
                <span>{featuredEvent.strVenue} 

                </span>
                <span className="flex justify-between items-center w-full">
                  <a href={featuredEvent.strVideo} target="_blank" rel="noreferrer" className="ml-auto hover:underline ">Match Results</a>
                  </span>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Matches Results</h2>

        {/* Lista de eventos deportivos */}
        {sportsEvents.map((event) => (
          <div key={event.idEvent} className="py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-500">{event.strLeague}</div>
                <h3 className="font-bold">{event.strEvent}</h3>
                <div className="flex items-center">
                  {event.strStatus === "live" && (
                    <>
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-red-500 font-medium mr-2">{event.strTime}</span>
                      {event.score && <span className="font-bold">{event.intHomeScore} {event.intAwayScore}</span>}
                    </>
                  )}

                  {event.status === "upcoming" && <span className="text-gray-500 text-sm">{event.strTime}</span>}

                  {event.strStatus === "Match Finished" && (
                    <>
                      <span className="font-bold">{event.intHomeScore} - {event.intAwayScore} | {event.strTime}</span>
                    </>
                  )}
                </div>
                {event.venue && <div className="text-xs text-gray-500 mt-1">{event.strVenue}</div>}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    <span className="sr-only">More Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <DropdownMenuItem onClick={() => handleHideEvent(event.idEvent)} className="cursor-pointer">
                    This match is not interesting
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Not interested in {event.league}</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">View more matches like this</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

