"use server"

import { createClient } from "@/database/server"
import { redirect } from "next/navigation"

/**
 * fetchProfile
 *
 * Fetches the profile data of a user based on their `username`. If the user is not found, 
 * the function logs an error and redirects the user to the home page.
 *
 * @param username - The unique username of the user whose profile is being fetched.
 *
 * @returns The user object containing their profile data, including personal details, badges, etc.
 * @throws Redirects to the home page if the user is not found or if there is an error.
 */
export async function fetchProfile(username: string) {
    const db = await createClient()

    // Attempt to fetch the user data from the database
    const { data: user, error: userError } = await db
        .from("users")
        .select("*")
        .eq("username", username)
        .single()

    // If there was an error or no user found, log the error and redirect
    if (userError || !user) {
        console.error(
            "Error fetching user data for:",
            username,
            userError
        )
        redirect("/")
    }

    // Fetch badges and other user data if necessary (currently not implemented)

    return user
}
