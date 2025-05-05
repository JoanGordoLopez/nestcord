import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * GET /api/feed/following
 *
 * Fetches posts from users the authenticated user is following, with pagination support.
 * Requires user to be authenticated via Supabase.
 *
 * Query Parameters:
 * - cursor (optional): ISO timestamp used for pagination (returns posts before this timestamp).
 * - limit (optional): Number of posts to fetch (default: 10).
 *
 * Returns:
 * - 200: { status: [...], nextCursor: string | null }
 * - 500: { error: string }
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const db = await createClient()

    // Get authenticated user
    const user = await db.auth.getUser()
    const userId = user.data.user?.id

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized: no user found" },
            { status: 401 }
        )
    }

    // Fetch IDs of authors followed by the current user
    const { data: follows, error: followsError } = await db
        .from("follows")
        .select("author")
        .eq("follower", userId)

    if (followsError) {
        return NextResponse.json(
            { error: "Error fetching follows" },
            { status: 500 }
        )
    }

    const followedAuthorIds = follows.map((f) => f.author)

    if (followedAuthorIds.length === 0) {
        return NextResponse.json(
            { status: [], nextCursor: null },
            { status: 200 }
        )
    }

    // Build query to fetch statuses from followed users
    let query = db
        .from("status")
        .select(
            "id, author(id, name, username, avatar, biography, created_at), content, attachment, comments, likes, views, created_at, updated_at"
        )
        .in("author", followedAuthorIds)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit + 1)

    // Cursor-based pagination: fetch posts created before the cursor
    if (cursor) {
        const validCursor = new Date(cursor.split(".")[0]).toISOString()
        query = query.lt("created_at", validCursor)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { error: "Error fetching following feed" },
            { status: 500 }
        )
    }

    const hasMore = data.length > limit
    const status = hasMore ? data.slice(0, limit) : data
    const nextCursor =
        hasMore && status.length > 0
            ? status[status.length - 1].created_at
            : null

    return new NextResponse(JSON.stringify({ status, nextCursor }), {
        status: 200,
        headers: { "Cache-Control": "no-store" }, // Disable caching for fresh data
    })
}
