import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

/**
 * Handles a GET request to retrieve the latest 10 replies authored by a specific user.
 * The request must include an "id" query parameter and the user must be authenticated.
 *
 * @param req - The incoming HTTP request object.
 * 
 * @returns A JSON response containing the replies or an appropriate error message.
 */
export async function GET(req: Request) {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // Initialize the database client
    const db = await createClient()

    // Attempt to get the currently authenticated user
    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    // If no user is found and there's an error, return 401 Unauthorized
    if (!user && error) {
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "You must be authenticated to view replies.",
            },
            { status: 401 }
        )
    }

    // Query the 'status_replies' table for the latest 10 replies by the specified author ID
    const { data: replies, error: repliesError } = await db
        .from("status_replies")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .eq("author", id)
        .order("created_at", { ascending: false })
        .limit(10)

    // Return 500 Internal Server Error if query fails
    if (repliesError) {
        console.error(repliesError.code, repliesError.message)
        return NextResponse.json(
            {
                error: "Error fetching replies",
                message: "An error occurred while fetching replies.",
            },
            { status: 500 }
        )
    }

    // Return the retrieved replies in a 200 OK response
    return NextResponse.json(replies)
}
