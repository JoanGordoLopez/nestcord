"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ExploreSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setIsSearching: (isSearching: boolean) => void
}

export function ExploreSearch({ searchQuery, setSearchQuery, setIsSearching }: ExploreSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    inputRef.current?.focus()
  }

  // Efecto para manejar el foco del input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <form onSubmit={handleSearch} className="relative">
      <div
        className={`flex items-center rounded-full bg-gray-100 dark:bg-gray-800 ${isFocused ? "ring-2 ring-sky-500" : ""}`}
      >
        <div className="flex items-center justify-center pl-4">
          <Search className="h-5 w-5 text-gray-500" />
        </div>

        <Input
          ref={inputRef}
          type="text"
          placeholder="Search on Nestcord"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="flex-1 border-none bg-transparent py-3 pl-2 pr-10 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <span className="sr-only">Limpiar búsqueda</span>
          </Button>
        )}
      </div>
    </form>
  )
}

