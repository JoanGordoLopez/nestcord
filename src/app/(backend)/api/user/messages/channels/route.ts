import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export async function GET() {
    const db = await createClient()
    const user = await db.auth.getUser()

    if (!user.data.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = user.data.user.id

    // 1. Fetch all messages with both sender and recipient information
    const { data: allMessages, error } = await db
        .from("messages")
        .select(
            `
            id, 
            author, 
            read_state, 
            channel_id, 
            delivered_to(id, name, username, avatar, biography, created_at), 
            content, 
            created_at,
            profiles:author(id, name, username, avatar, biography, created_at)
        `
        )
        .or(`author.eq.${currentUserId},delivered_to.eq.${currentUserId}`)
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. Find all users the current user has sent messages to
    const usersIHaveMessaged = new Set(
        allMessages
            .filter((msg) => msg.author === currentUserId)
            .map((msg) => {
                // Handle both array and object formats for delivered_to
                if (Array.isArray(msg.delivered_to)) {
                    return msg.delivered_to[0]?.id
                }
                return msg.delivered_to
            })
            .filter(Boolean)
    )

    // 3. Organize messages into regular chats and requests
    const regularChats = new Map()
    const requestChats = new Map()

    allMessages.forEach((msg) => {
        // Determine if this is a message I sent or received
        const isSentByMe = msg.author === currentUserId

        // Get the other user's ID and data (the one I'm chatting with)
        let otherUserId
        let otherUserData

        if (isSentByMe) {
            // If I sent the message, the other user is the recipient
            if (Array.isArray(msg.delivered_to)) {
                otherUserId = msg.delivered_to[0]?.id
                otherUserData = msg.delivered_to[0]
            } else {
                otherUserId = msg.delivered_to
                otherUserData = msg.delivered_to
            }
        } else {
            // If I received the message, the other user is the author
            otherUserId = msg.author[0]?.id
            otherUserData = msg.profiles // Use the joined profiles data
        }

        // Get the conversation key (channel_id or user ID)
        const key = msg.channel_id ?? otherUserId

        if (!key || !otherUserData) return // Skip if we can't identify the conversation or don't have user data

        // If I received this message and I've never messaged this person before,
        // it's a request. Otherwise, it's a regular chat.
        if (!isSentByMe && !usersIHaveMessaged.has(otherUserId)) {
            // This is a request - only add if we don't already have this conversation
            if (!requestChats.has(key) && !regularChats.has(key)) {
                requestChats.set(key, {
                    ...msg,
                    sender: otherUserData, // Include the sender's information
                    isRequest: true,
                })
            }
        } else {
            // This is a regular chat - only add if we don't already have this conversation
            if (!regularChats.has(key)) {
                regularChats.set(key, {
                    ...msg,
                    otherUser: otherUserData, // Include the other user's information
                    isRequest: false,
                })
            }
        }
    })

    // 4. Combine the results
    const result = {
        chats: Array.from(regularChats.values()),
        requests: Array.from(requestChats.values()),
        requestsCount: requestChats.size,
    }

    return NextResponse.json(result)
}
