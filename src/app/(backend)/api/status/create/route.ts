import { NextResponse } from "next/server"
import { createClient } from "@/database/server"
import { UserType } from "@/lib/types"

async function uploadAttachment(file: File): Promise<string | null> {
    const storage = (await createClient()).storage
    const filePath = `attachments/${file.name}`

    const { error } = await storage.from("attachments").upload(filePath, file)
    if (error) return null

    const { data: publicURL } = storage
        .from("attachments")
        .getPublicUrl(filePath)
    return publicURL.publicUrl
}

export async function POST(req: Request) {
    const formData = await req.formData()
    const content = formData.get("content") as string
    const attachment = formData.get("attachment") as File | null
    const user = JSON.parse(formData.get("user") as string) as UserType | null

    if (!content.trim() && !attachment) {
        return NextResponse.json(
            { error: "Content or attachment required" },
            { status: 400 }
        )
    }

    let attachmentUrl = null
    if (attachment) {
        attachmentUrl = await uploadAttachment(attachment)
        if (!attachmentUrl) {
            return NextResponse.json(
                { error: "Failed to upload attachment" },
                { status: 500 }
            )
        }
    }

    const statusData = {
        content: content.trim(),
        author: user?.id,
        attachment: attachmentUrl || null,
    }

    const db = await createClient()
    const { error } = await db.from("status").insert([statusData])
    if (error) {
        return NextResponse.json(
            { error: "Failed to insert post" },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true }, { status: 200 })
}
