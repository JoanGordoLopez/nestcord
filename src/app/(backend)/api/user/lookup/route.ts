import { NextResponse } from "next/server"
import { createClient } from "@/database/server"

/**
 * Handles a GET request to search for users based on a query string.
 * Excludes the currently authenticated user from the results.
 *
 * Query Parameters:
 * - search: (optional) A string used to filter users by name or username.
 *
 * @param req - The incoming HTTP request object.
 * @returns A JSON response with a list of up to 5 matched users, or an error message.
 */
export async function GET(req: Request) {
    // Initialize the Supabase client
    const db = await createClient()

    // Extract the "search" query parameter from the URL
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    // Get the currently authenticated user
    const { data: userData } = await db.auth.getUser()

    // Construct a base query to select users, excluding the current user
    let query = db
        .from("users")
        .select("id, name, username, avatar")
        .neq("id", userData.user?.id)
        .limit(5)

    // If a search query is provided, add filters for name and username (case-insensitive partial match)
    if (search) {
        query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`)
    }

    // Execute the query
    const { data, error } = await query

    // Return 500 error response if the query fails
    if (error) {
        return NextResponse.json(
            {
                code: error.code,
                message: error.message,
            },
            { status: 500 }
        )
    }

    // Return the matched users in a 200 OK response
    return NextResponse.json(data)
}
