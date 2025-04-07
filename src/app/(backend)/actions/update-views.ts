"use server"

import { createClient } from "@/database/server"

/**
 * Server function to update the view count of a status.
 * This function updates the view count for a given status in the database.
 *
 * @param {string} id - The unique identifier for the status.
 * @param {number} views - The new view count for the status.
 * @param {string} authorId - The unique identifier for the author of the status.
 *
 * @returns {Promise<void>} - A promise that resolves when the status is updated.
 * @throws {Error} If there is an error during the database operation.
 */

export async function updateStatusViews(id: string, views: number) {
    const db = await createClient()

    const viewsNumber = Number(views)

    const { data } = await db
        .from("status")
        .update({
            views: viewsNumber,
        })
        .eq("id", id)
        .single()

    if (!data) {
        const { data } = await db
            .from("status_replies")
            .update({
                views: viewsNumber,
            })
            .eq("id", id)
            .single()

        if (data) return true
    }

    if (data) return true
}
