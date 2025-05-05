"use server"

import { createClient } from "@/database/server"

/**
 * fetchStatus
 *
 * Fetches a status or its reply from the database based on the provided `id`.
 * The function first checks if the given `id` corresponds to a status. 
 * If not, it will look for a reply in the `status_replies` table.
 *
 * @param id - The unique identifier of the status or reply to fetch.
 *
 * @returns The status or reply object, containing details like `id`, `author`, `content`, `comments`, `likes`, etc.
 * @throws Throws an error if both the status and the reply are not found.
 */
export async function fetchStatus(id: string) {
    const db = await createClient()

    // Try fetching the status
    const { data: status } = await db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), attachment, content, comments, likes, views, created_at"
        )
        .eq("id", id)
        .single()

    // If not found, try fetching the reply
    if (!status) {
        const { data: status } = await db
            .from("status_replies")
            .select(
                "id, author(id, name, username, avatar, biography, created_at), attachment, content, comments, likes, views, created_at"
            )
            .eq("id", id)
            .single()

        return status
    }

    return status
}
