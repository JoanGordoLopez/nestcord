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

    const { data, error } = await db
    .from("follows")
    .select("id, follower(id, name, username, avatar, biography), author, created_at")
    .eq("author", id)
    .order("created_at", { ascending: false })
    .limit(10)

    if (error) {
        return NextResponse.json(
            { error: "Error fetching user followers" },
            { status: 500 }
        )
    }

    const count = data.length

    return NextResponse.json({
        data, count
    })
}
