import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic" // This indicates that the page should always be dynamically rendered

/**
 * Handles the GET request for fetching status posts.
 * Supports pagination via cursor and filtering by a specific status ID.
 * 
 * @param req - The incoming HTTP request object.
 * @returns A JSON response containing status posts and the next cursor for pagination.
 */
export async function GET(req: Request) {
    // Retrieve the query parameters from the request URL
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor") // The cursor for pagination
    const id = searchParams.get("id") // A specific status ID for filtering
    const limit = parseInt(searchParams.get("limit") || "10", 10) // The limit of status posts to fetch

    // Initialize the database client
    const db = await createClient()

    // Start the query to fetch status posts from the "status" table
    let query = db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .order("created_at", { ascending: false }) // Order by created_at in descending order
        .order("id", { ascending: false }) // Order by status ID in descending order
        .limit(limit + 1) // Fetch one extra record to check for pagination

    // If a cursor is provided, filter statuses created before the cursor timestamp
    if (cursor) {
        const validCursor = new Date(cursor.split(".")[0]).toISOString()
        query = query.lt("created_at", validCursor)
    }

    // If an ID is provided, filter the statuses by that ID
    if (id) {
        query = query.eq("id", id)
    }

    // Execute the query
    const { data, error } = await query

    // If there's an error fetching the statuses, return a 500 error response
    if (error) {
        return NextResponse.json(
            { error: "Error fetching statuses" },
            { status: 500 }
        )
    }

    // Check if there are more statuses to load (pagination)
    const hasMore = data.length > limit
    // Slice the data to return only the requested number of statuses
    const status = hasMore ? data.slice(0, limit) : data
    // Set the next cursor to the created_at value of the last status if there are more statuses
    const nextCursor =
        hasMore && status.length > 0
            ? status[status.length - 1].created_at
            : null

    // Return the status posts and the next cursor for pagination
    return new NextResponse(
        JSON.stringify({ status, nextCursor }),
        { status: 200, headers: { "Cache-Control": "no-store" } } // Prevent caching of the response
    )
}
