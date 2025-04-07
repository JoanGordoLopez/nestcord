import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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
