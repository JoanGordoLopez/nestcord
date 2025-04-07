"use client"
import { useUser } from "@/context/user-context"
import { useState } from "react"

import { ChatConversation } from "@/components/messages/chat-conversation"
import { Button } from "@/components/ui/button"
import type { User } from "@/components/messages/chat-container"
interface ChatButtonProps {
    user: User
}

export function ChatButton({ user }: ChatButtonProps) {
    const author = useUser()
    const [isOpen, setIsOpen] = useState(false)

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    const uuid1 = author.user?.id
    const uuid2 = user.id

    let channelId: string | undefined

    if (uuid1 && uuid2) {
        // Extraer la primera parte de cada UUID
        const firstPart1 = uuid1.split("-")[0]
        const firstPart2 = uuid2.split("-")[0]

        // Convertir de hexadecimal a decimal y sumar
        const decimal1 = parseInt(firstPart1, 16)
        const decimal2 = parseInt(firstPart2, 16)

        channelId = (decimal1 + decimal2).toString()

        return (
            <div className="fixed bottom-0 right-100 z-50 flex flex-col items-end">
                {/* Botón para abrir el chat */}
                <Button
                    onClick={toggleChat}
                    variant="default"
                    className="mb-2 rounded-full shadow-md"
                >
                    Direct Message @{user.name}
                </Button>

                {/* Chat de conversación */}
                {isOpen && channelId && (
                    <div className="fixed bottom-0 right-100 w-80 bg-white shadow-lg border rounded-lg">
                        <ChatConversation
                            user={user}
                            onBack={toggleChat}
                            channelId={channelId}
                        />
                    </div>
                )}
            </div>
        )
    }
}
