import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)

    const db = await createClient()
    const id = searchParams.get("id")
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
        .eq("author", id)
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

    return NextResponse.json(replies)
}
