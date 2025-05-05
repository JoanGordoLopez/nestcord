"use server"

import { createClient } from "@/database/server"

/**
 * uploadBanner
 *
 * Uploads a user banner image to Supabase Storage and updates the user's profile with the banner URL.
 *
 * @param attachment - A File object representing the banner image to upload.
 * @param id - The ID of the user whose banner is being updated.
 *
 * @throws Error if the upload fails.
 */
export async function uploadBanner(attachment: File, id: string) {
    const db = await createClient()

    const extension = attachment.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${extension}`

    const { data, error } = await db.storage
        .from("banners")
        .upload(fileName, attachment)

    if (error) {
        throw new Error(error.name)
    }

    if (data) {
        const banner =
            "https://frhbjqrfnnemrkilykjd.supabase.co/storage/v1/object/public/banners/" +
            fileName

        await db.from("users").update({ banner: banner }).eq("id", id)
    }
}
