import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

/**
 * Handles a GET request to retrieve the authenticated user's profile information.
 *
 * @returns A JSON response containing the user's profile data or an appropriate error message.
 */
export async function GET() {
    // Initialize the database client
    const db = await createClient()

    // Attempt to retrieve the currently authenticated user
    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    // Return a 500 Internal Server Error response if authentication fails
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Query the 'users' table for the authenticated user's profile information
    const { data, error: userError } = await db
        .from("users")
        .select(
            "id, name, username, avatar, biography, category, website, followers, following, banner"
        )
        .eq("id", user?.id)
        .single()

    // Return a 500 Internal Server Error response if the user data could not be retrieved
    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Return the user's profile data in a 200 OK response
    return NextResponse.json(data, { status: 200 })
}
