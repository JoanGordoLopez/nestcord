import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

/**
 * Handles a POST request to create a reply to a specific status.
 * 
 * @param req - The incoming HTTP request object.
 * @param params - The parameters object, which contains the status ID in the URL.
 * @returns A JSON response confirming the creation of the reply, or an error message.
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Initialize the Supabase client
    const db = await createClient()

    // Extract the status ID from the request parameters
    const id = (await params).id

    // Check if the status with the given ID exists
    const { data } = await db.from("status").select("id").eq("id", id).single()

    // If the status doesn't exist, return a 404 error
    if (!data)
        return NextResponse.json(
            {
                error: "Unknown Status ID",
                message: "The specified status ID does not exist.",
            },
            { status: 404 }
        )

    // Get the authenticated user
    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    // If no user is authenticated, return a 401 Unauthorized error
    if (!user && error)
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "You must be authenticated to create a reply.",
            },
            { status: 401 }
        )

    // Parse the content of the reply from the request body
    const { content } = await req.json()

    // Insert the reply into the "status_replies" table
    await db.from("status_replies").insert({
        author: user?.id,
        status_id: id,
        content: content,
    })

    // Return a success response
    return NextResponse.json({ message: "Reply created successfully." })
}

/**
 * Handles a GET request to retrieve replies for a specific status.
 * 
 * @param req - The incoming HTTP request object.
 * @param params - The parameters object, which contains the status ID in the URL.
 * @returns A JSON response with the list of replies or an error message.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Initialize the Supabase client
    const db = await createClient()

    // Extract the status ID from the request parameters
    const id = (await params).id

    // Check if the status with the given ID exists
    const { data } = await db.from("status").select("id").eq("id", id).single()

    // If the status doesn't exist, return a 404 error
    if (!data)
        return NextResponse.json(
            {
                error: "Unknown Status ID",
                message: "The specified status ID does not exist.",
            },
            { status: 404 }
        )

    // Get the authenticated user
    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    // If no user is authenticated, return a 401 Unauthorized error
    if (!user && error)
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "You must be authenticated to view replies.",
            },
            { status: 401 }
        )

    // Retrieve the replies for the specified status, sorted by creation date
    const { data: replies, error: repliesError } = await db
        .from("status_replies")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .eq("status_id", id)
        .order("created_at", { ascending: false })
        .limit(10)

    // If there's an error fetching the replies, return a 500 error
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

    // Return the replies in a 200 OK response
    return new NextResponse(JSON.stringify({ statusReplies: replies }))
}
