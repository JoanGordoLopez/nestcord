import { createClient } from "@/database/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handles a GET request to retrieve the latest 10 posts made by a specific user.
 *
 * @param request - The incoming HTTP request object from Next.js.
 * @param params - An object containing route parameters, expected to include a user ID.
 * 
 * @returns A JSON response containing the user's posts or an appropriate error message.
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

    // Query the 'status' table for the latest 10 posts by the specified user
    const { data: userPosts, error: userError } = await db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .eq("author", id)
        .order("created_at", { ascending: false })
        .limit(10)

    // Return a 500 Internal Server Error response if the query fails
    if (userError || !userPosts) {
        return NextResponse.json(
            { error: "Error fetching user statuses" },
            { status: 500 }
        )
    }

    // Return the list of user posts in a 200 OK response
    return NextResponse.json(userPosts)
}
