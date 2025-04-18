import { createClient } from "@/database/server";
import { NextResponse } from "next/server";

export async function GET() {
    const db = await createClient();

    const { data: user } = await db.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "No user found" }, { status: 404 })
    }

    const { data, error } = await db
    .from("notifications")
    .select("id, user(id, name, username, avatar), message, created_at")
    .eq("user", user.user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

    if (error) {
        return NextResponse.json(
            { error: "Error fetching notifications" },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}