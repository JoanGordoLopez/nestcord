import { createClient } from "@/database/server"
import { NextResponse } from "next/server"

export async function GET() {
    const db = await createClient()
    const {
        data: { user },
        error,
    } = await db.auth.getUser()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data, error: userError } = await db
        .from("users")
        .select(
            "id, name, username, avatar, biography, category, website, followers, following, banner"
        )
        .eq("id", user?.id)
        .single()

    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
}
