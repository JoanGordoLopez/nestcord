"use server"

import { createClient } from "@/database/server"
import { revalidatePath } from "next/cache"

type UserUpdate = {
    name?: string
    username?: string
    website?: string
    biography?: string
}

/**
 * updateUser
 *
 * Updates user information in the `users` table of the database.
 * Validates the `username` to ensure it's not already taken by another user.
 * If the update is successful, it triggers a revalidation of the `/home` page.
 *
 * @param updates - An object containing the fields to update (name, username, website, biography).
 *
 * @throws Error if the user is not authenticated, the username is already taken, or the update fails.
 * @returns `true` if the update is successful, else throws an error.
 */
export async function updateUser(updates: UserUpdate) {
    const db = await createClient()
    const { data: user, error } = await db.auth.getUser()

    if (error || !user?.user?.id) {
        console.error("Error fetching authenticated user:", error)
        throw new Error("User not authenticated")
    }

    // Filter out fields that are undefined
    const updatedFields = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(updatedFields).length === 0) {
        console.log("No fields to update")
        return
    }

    // Check if the `username` is already taken
    if (updates.username) {
        const { data: existingUsers, error: nameCheckError } = await db
            .from("users")
            .select("id")
            .eq("username", updates.username)
            .neq("id", user.user.id) // Exclude current user from the check

        if (nameCheckError) {
            console.error("Error checking name availability:", nameCheckError)
            throw new Error("Failed to verify name availability")
        }

        if (existingUsers.length > 0) {
            throw new Error("This name is already taken")
        }
    }

    // Update user in the database
    const { error: updateError } = await db
        .from("users")
        .update(updatedFields)
        .eq("id", user.user.id)

    if (updateError) {
        console.error("Error updating user:", updateError)
        throw new Error("Failed to update user")
    }

    // Revalidate the path for the `/home` page
    await revalidatePath("/home")
    return true
}
