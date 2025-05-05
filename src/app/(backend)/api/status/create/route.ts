import { NextResponse } from "next/server"
import { createClient } from "@/database/server"
import { UserType } from "@/lib/types"

/**
 * Handles the upload of an attachment (e.g., an image or file) to a cloud storage.
 * 
 * @param file - The file to be uploaded.
 * @returns A string containing the public URL of the uploaded file, or null if the upload failed.
 */
async function uploadAttachment(file: File): Promise<string | null> {
    // Get the storage client from Supabase
    const storage = (await createClient()).storage

    // Define the file path in the storage bucket
    const filePath = `attachments/${file.name}`

    // Upload the file to the "attachments" bucket
    const { error } = await storage.from("attachments").upload(filePath, file)

    // If an error occurs during the upload, return null
    if (error) return null

    // Get the public URL of the uploaded file
    const { data: publicURL } = storage
        .from("attachments")
        .getPublicUrl(filePath)

    // Return the public URL of the file
    return publicURL.publicUrl
}

/**
 * Handles the POST request to create a new status (post) with optional content and attachment.
 * 
 * @param req - The incoming HTTP request object containing the form data.
 * @returns A JSON response with a success message or an error message if the operation fails.
 */
export async function POST(req: Request) {
    // Parse the form data from the request
    const formData = await req.formData()

    // Extract content, attachment, and user information from the form data
    const content = formData.get("content") as string
    const attachment = formData.get("attachment") as File | null
    const user = JSON.parse(formData.get("user") as string) as UserType | null

    // If neither content nor attachment is provided, return a 400 error
    if (!content.trim() && !attachment) {
        return NextResponse.json(
            { error: "Content or attachment required" },
            { status: 400 }
        )
    }

    let attachmentUrl = null

    // If an attachment is provided, upload it and get the public URL
    if (attachment) {
        attachmentUrl = await uploadAttachment(attachment)
        if (!attachmentUrl) {
            return NextResponse.json(
                { error: "Failed to upload attachment" },
                { status: 500 }
            )
        }
    }

    // Prepare the status data to be inserted into the database
    const statusData = {
        content: content.trim(),
        author: user?.id,
        attachment: attachmentUrl || null,
    }

    // Initialize the database client
    const db = await createClient()

    // Insert the new status into the "status" table
    const { error } = await db.from("status").insert([statusData])

    // If an error occurs while inserting the status, return a 500 error
    if (error) {
        return NextResponse.json(
            { error: "Failed to insert post" },
            { status: 500 }
        )
    }

    // Return a success response if the status was inserted successfully
    return NextResponse.json({ success: true }, { status: 200 })
}