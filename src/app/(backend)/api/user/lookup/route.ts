import { NextResponse } from "next/server"

import { createClient } from "@/database/server"

export async function GET(req: Request) {
    const db = await createClient()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    const { data: userData } = await db.auth.getUser()

    let query = db
        .from("users")
        .select("id, name, username, avatar")
        .neq("id", userData.user?.id)
        .limit(5)

    if (search) {
        query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            {
                code: error.code,
                message: error.message,
            },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}
