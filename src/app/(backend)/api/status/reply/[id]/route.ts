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
    { params }: { params: { id: string } }
) {
    const db = await createClient()
    const id = (await params).id

    const { data } = await db.from("status").select("id").eq("id", id).single()

    if (!data)
        return NextResponse.json(
            {
                error: "Unknown Status ID",
                message: "The specified status ID does not exist.",
            },
            { status: 404 }
        )

    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    if (!user && error)
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "You must be authenticated to create a reply.",
            },
            { status: 401 }
        )

    const { content } = await req.json()

    await db.from("status_replies").insert({
        author: user?.id,
        status_id: id,
        content: content,
    })

    return NextResponse.json({ message: "Reply created successfully." })
}

/**
 * Handles a GET request to retrieve replies for a specific status.
 */
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const db = await createClient()
    const id = params.id

    const { data } = await db.from("status").select("id").eq("id", id).single()

    if (!data)
        return NextResponse.json(
            {
                error: "Unknown Status ID",
                message: "The specified status ID does not exist.",
            },
            { status: 404 }
        )

    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    if (!user && error)
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "You must be authenticated to view replies.",
            },
            { status: 401 }
        )

    const { data: replies, error: repliesError } = await db
        .from("status_replies")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .eq("status_id", id)
        .order("created_at", { ascending: false })
        .limit(10)

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

    return new NextResponse(JSON.stringify({ statusReplies: replies }))
}
