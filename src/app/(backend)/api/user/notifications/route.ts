import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

/**
 * Handles a GET request to retrieve the latest 10 notifications for the authenticated user.
 *
 * @returns A JSON response containing the notifications data or an appropriate error message.
 */
export async function GET() {
    // Initialize the Supabase client
    const db = await createClient()

    // Retrieve the authenticated user
    const { data: user } = await db.auth.getUser()

    // If no user is found, return a 404 Not Found response
    if (!user) {
        return NextResponse.json({ error: "No user found" }, { status: 404 })
    }

    // Query the 'notifications' table for the authenticated user's notifications
    const { data, error } = await db
        .from("notifications")
        .select("id, user(id, name, username, avatar), message, created_at")
        .eq("user", user.user?.id)
        .order("created_at", { ascending: false })
        .limit(10)

    // Return a 500 Internal Server Error response if the query fails
    if (error) {
        return NextResponse.json(
            { error: "Error fetching notifications" },
            { status: 500 }
        )
    }

    // Return the notifications data in a 200 OK response
    return NextResponse.json(data)
}
