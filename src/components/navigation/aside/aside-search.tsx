"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AsideSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, isLoading } = useSWR(
    searchQuery ? `/api/user/lookup?search=${searchQuery}` : null,
    fetcher,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="sticky top-0 z-10 mb-3 pt-1">
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search on Nestcord"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-dark py-3 pl-12 pr-4 text-black outline-none  focus:ring-0 border-border
            dark:bg-black dark:border-gray-800 dark:text-white"
          />
        </form>

        {/* Resultados de búsqueda */}
        {searchQuery && (
          <div
            className="absolute top-12 left-0 w-full bg-white border border-gray-800 rounded-xl shadow-lg mt-2 p-2 z-50 max-h-80 overflow-y-auto
          dark:bg-black dark:border-gray-800"
          >
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="h-12 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-12 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-12 w-full bg-gray-800" />
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm p-4">Error</p>
            ) : data?.length > 0 ? (
              data.map(
                (user: {
                  id: string;
                  name: string;
                  username: string;
                  avatar: string;
                }) => (
                  <Link href={`/${user.username}`} key={user.id}>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user.avatar || "/placeholder.svg?height=48&width=48"
                          }
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-black dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                ),
              )
            ) : (
              <p className="text-gray-500 text-sm text-center p-4">
                @{searchQuery} does not exist on Nestcord
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
