"use client"

import { useState } from "react"
import { Check, CheckCheck, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { User, ChatData } from "@/components/messages/chat-container"

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Define the API response structure
interface ApiResponse {
    chats: ChatData[]
    requests: ChatData[]
    requestsCount: number
}

interface ChatListProps {
    onSelectUser: (user: User) => void
}

export function ChatList({ onSelectUser }: ChatListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("chats")

    // Use useSWR to fetch data with optimized caching
    const { data, error, isLoading } = useSWR<ApiResponse>(
        "/api/user/messages/channels",
        fetcher,
        {
            refreshInterval: 5000, // Revalidate every 5 seconds
            revalidateOnFocus: true,
            revalidateIfStale: true,
        }
    )

    // Format the timestamp to a more readable format
    const formatTimeDistance = (dateString: string): string => {
        try {
            const date = new Date(dateString)
            return formatDistanceToNow(date, { addSuffix: true })
        } catch (error) {
            console.error("Error formatting date:", error)
            return ""
        }
    }

    // Process regular chats
    const chatUsers =
        data?.chats?.map((chat) => {
            // For regular chats, use the otherUser field which contains the user we're chatting with
            const otherUser = chat.otherUser || {}

            return {
                id: otherUser.id || "",
                name: otherUser.name || "Unknown User",
                username: otherUser.username || "unknown",
                avatar:
                    otherUser.avatar || "/placeholder.svg?height=40&width=40",
                created_at: otherUser.created_at || new Date().toISOString(),
                lastMessage: chat.content || "",
                lastMessageTime: formatTimeDistance(
                    chat.created_at || new Date().toISOString()
                ),
                channelId: chat.channel_id || "",
                online: false,
                unread: chat.read_state ? 0 : 1,
                isRequest: false,
            }
        }) || []

    // Process request chats
    const requestUsers =
        data?.requests?.map((chat) => {
            // For requests, use the sender field which contains the user who sent the request
            const sender = chat.sender || {}

            return {
                id: sender.id || "",
                name: sender.name || "Unknown User",
                username: sender.username || "unknown",
                avatar: sender.avatar || "/placeholder.svg?height=40&width=40",
                created_at: sender.created_at || new Date().toISOString(),
                lastMessage: chat.content || "",
                lastMessageTime: formatTimeDistance(
                    chat.created_at || new Date().toISOString()
                ),
                channelId: chat.channel_id || "",
                online: false,
                unread: 1, // Requests are always considered unread
                isRequest: true,
            }
        }) || []

    // Filter chats based on search query
    const filteredChats = searchQuery
        ? chatUsers.filter(
              (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
          )
        : chatUsers

    // Filter requests based on search query
    const filteredRequests = searchQuery
        ? requestUsers.filter(
              (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
          )
        : requestUsers

    // Get the count of requests
    const requestsCount = data?.requestsCount || 0

    if (error) {
        return (
            <div className="flex items-center justify-center p-4 text-red-500">
                Error loading chats
            </div>
        )
    }

    // Render user list item (shared between chats and requests)
    const renderUserItem = (user: User, isRequest = false) => (
        <button
            key={user.id}
            className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
            onClick={() => onSelectUser(user)}
        >
            <div className="relative">
                <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                {user.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <span className="text-xs text-muted-foreground">
                        {user.lastMessageTime}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <p className="truncate text-xs text-muted-foreground">
                        {user.lastMessage}
                    </p>
                    {!isRequest && (
                        <span className="flex-shrink-0 ml-1">
                            {user.unread === 0 ? (
                                <CheckCheck
                                    className="h-3 w-3 text-blue-500"
                                    aria-label="Read"
                                />
                            ) : (
                                <Check
                                    className="h-3 w-3 text-muted-foreground"
                                    aria-label="Sent"
                                />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )

    return (
        <div className="flex flex-1 flex-col">
            <Tabs
                defaultValue="chats"
                className="w-full"
                onValueChange={setActiveTab}
            >
                <div className="flex items-center justify-between px-3 pt-3">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chats">Chats</TabsTrigger>
                        <TabsTrigger value="requests" className="relative">
                            Unread
                            {requestsCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center rounded-full justify-center p-0 text-xs"
                                >
                                    {requestsCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={
                                activeTab === "chats"
                                    ? "Search chats"
                                    : "Search unread chats"
                            }
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="chats" className="flex-1 mt-0">
                    <ScrollArea className="flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                Loading chats...
                            </div>
                        ) : (
                            <div className="space-y-1 p-2">
                                {filteredChats.length > 0 ? (
                                    filteredChats.map((user) =>
                                        renderUserItem(user)
                                    )
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No chats found
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="requests" className="flex-1 mt-0">
                    <ScrollArea className="flex-1">
                        <div className="space-y-1 p-2">
                            {filteredRequests.length > 0 ? (
                                <>
                                    <div className="px-2 py-3">
                                        <h3 className="text-sm font-medium">
                                            Unread Messages
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Messages from people you have not
                                            responded to yet
                                        </p>
                                    </div>
                                    {filteredRequests.map((request) =>
                                        renderUserItem(request, true)
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="rounded-full bg-muted p-3 mb-4">
                                        <Search className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-medium mb-1">
                                        No unread chats
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        When someone sends you a request
                                        message, or you do not reply to a
                                        message, it will appear here
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
