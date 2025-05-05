import { createClient } from "@/database/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handles a GET request to retrieve the latest 10 followers of a specific user.
 *
 * @param request - The incoming HTTP request object from Next.js.
 * @param params - An object containing route parameters, expected to include a user ID.
 * 
 * @returns A JSON response containing the list of followers and the count, or an error message.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await the parameters and extract the user ID
    const { id } = await params

    // Return a 400 Bad Request response if no user ID is provided
    if (!id) {
        return NextResponse.json(
            { error: "No User ID was provided" },
            { status: 400 }
        )
    }

    // Initialize the database client
    const db = await createClient()

    // Query the 'follows' table for the latest 10 users who follow the specified user
    const { data, error } = await db
        .from("follows")
        .select("id, follower(id, name, username, avatar, biography), author, created_at")
        .eq("author", id)
        .order("created_at", { ascending: false })
        .limit(10)

    // Return a 500 Internal Server Error response if the query fails
    if (error) {
        return NextResponse.json(
            { error: "Error fetching user followers" },
            { status: 500 }
        )
    }

    // Count the number of followers retrieved
    const count = data.length

    // Return the follower data and count in a 200 OK response
    return NextResponse.json({
        data, count
    })
}
