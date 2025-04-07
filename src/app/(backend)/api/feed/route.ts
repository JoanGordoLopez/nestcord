import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const id = searchParams.get("id")
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const db = await createClient()

    let query = db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit + 1)

    if (cursor) {
        const validCursor = new Date(cursor.split(".")[0]).toISOString()
        query = query.lt("created_at", validCursor)
    }

    if (id) {
        query = query.eq("id", id)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { error: "Error fetching statuses" },
            { status: 500 }
        )
    }

    const hasMore = data.length > limit
    const status = hasMore ? data.slice(0, limit) : data
    const nextCursor =
        hasMore && status.length > 0
            ? status[status.length - 1].created_at
            : null

    return new NextResponse(
        JSON.stringify({ status, nextCursor }),
        { status: 200, headers: { "Cache-Control": "no-store" } } // Evita que Next.js almacene en caché
    )
}
