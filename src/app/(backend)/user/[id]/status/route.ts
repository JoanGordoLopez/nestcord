import { createClient } from "@/database/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json(
            { error: "No User ID was provided" },
            { status: 400 }
        )
    }

    const db = await createClient()

    const { data: userPosts, error: userError } = await db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .eq("author", id)
        .order("created_at", { ascending: false })
        .limit(10)

    if (userError || !userPosts) {
        return NextResponse.json(
            { error: "Error fetching user statuses" },
            { status: 500 }
        )
    }

    return NextResponse.json(userPosts)
}
