"use client"
import { useUser } from "@/context/user-context"
import { useIsMobile } from "@/hooks/use-mobile"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { ChatList } from "@/components/messages/chat-list"
import { ChatConversation } from "@/components/messages/chat-conversation"

export type User = {
    id: string
    name: string
    username: string
    avatar: string
    lastMessage?: string
    lastMessageTime?: string
    online?: boolean
    unread?: number
    created_at: string
}

export type ChatData = {
    otherUser: User
    sender: {
        id: string
        name: string
        avatar: string
        username: string
        biography: string
        created_at: string
    }
    read_state: boolean
    channel_id: string
    id: string
    author: string
    content: string
    created_at: string
    delivered_to: {
        id: string
        name: string
        avatar: string
        username: string
        biography: string
        created_at: string
    }
}

export type Message = {
    id: string
    senderId: string
    text: string
    timestamp: string
}

export function ChatContainer() {
    const author = useUser()
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const toggleOpen = () => {
        if (!isOpen) {
            setIsMinimized(false)
        }
        setIsOpen(!isOpen)
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    const handleUserSelect = (user: User) => {
        setSelectedUser(user)
    }

    const handleBackToList = () => {
        setSelectedUser(null)
    }

    const uuid1 = author.user?.id
    const uuid2 = selectedUser?.id

    let channelId: string | undefined

    if (uuid1 && uuid2) {
        // Extraer la primera parte de cada UUID
        const firstPart1 = uuid1.split("-")[0]
        const firstPart2 = uuid2.split("-")[0]

        // Convertir de hexadecimal a decimal y sumar
        const decimal1 = parseInt(firstPart1, 16)
        const decimal2 = parseInt(firstPart2, 16)

        channelId = (decimal1 + decimal2).toString()
    }

    if (channelId) {
        console.log("[Server]: Established connection at channel:", channelId)
    }

    if (isMobile) return null

    return (
        <div className="fixed bottom-0 right-2 z-50 flex flex-col items-end">
            {/* Chat button */}
            <Button
                onClick={toggleOpen}
                variant="default"
                hidden={isOpen}
                className="mb-2 rounded-full shadow-md"
            >
                Direct Messages
            </Button>

            {/* Chat container */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            height: isMinimized ? "auto" : 480,
                        }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full sm:w-80 md:w-96"
                    >
                        <Card className="flex h-full flex-col border shadow-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b p-3">
                                <h3 className="text-sm font-medium">
                                    {selectedUser
                                        ? `@${selectedUser.name}'s chat`
                                        : "Direct Messages"}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={toggleMinimize}
                                    >
                                        {isMinimized ? (
                                            <Maximize2 className="h-4 w-4" />
                                        ) : (
                                            <Minimize2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={toggleOpen}
                                    >
                                        {isOpen ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            <X className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            {!isMinimized && (
                                <div className="flex flex-1 flex-col">
                                    {selectedUser && channelId ? (
                                        <div className="flex-1 overflow-auto">
                                            <ChatConversation
                                                channelId={channelId}
                                                user={selectedUser}
                                                onBack={handleBackToList}
                                            />
                                        </div>
                                    ) : (
                                        <ChatList
                                            onSelectUser={handleUserSelect}
                                        />
                                    )}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
