"use server"

import { createClient } from "@/database/server"
import { UserType } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

/**
 * handleAttachmentUpload
 *
 * Handles the upload of an attachment (file) to the storage service. 
 * Generates a unique file name and uploads the file to the "attachments" storage bucket.
 * Returns the public URL of the uploaded file.
 *
 * @param file - The file object to be uploaded.
 * @returns The public URL of the uploaded file if successful, otherwise null.
 */
async function handleAttachmentUpload(file: File): Promise<string | null> {
    const db = await createClient()

    // Generate a unique filename for the uploaded file
    const fileName = uuidv4()
    const filePath = `image/${fileName}`

    // Upload the file to the storage
    const { error } = await db.storage
        .from("attachments")
        .upload(filePath, file)

    if (error) {
        console.error("Error uploading file:", error)
        return null
    }

    // Retrieve the public URL for the uploaded file
    const { data: publicURL } = db.storage
        .from("attachments")
        .getPublicUrl(filePath)

    console.log("Uploaded file URL:", publicURL.publicUrl)
    return publicURL.publicUrl
}

/**
 * createPost
 *
 * Creates a new post with content and an optional attachment. The content is required, 
 * and if an attachment is provided, it will be uploaded first.
 * If both content and attachment are empty, no post is created.
 *
 * @param formData - The form data containing the content for the post.
 * @param attachment - The optional file attachment for the post.
 * @param user - The authenticated user creating the post.
 * @returns True if the post is successfully created, otherwise nothing.
 */
export async function createPost(
    formData: FormData,
    attachment: File | null, // We use File instead of string to handle the file
    user: UserType | null
) {
    // Extract content from the form data
    const content = formData.get("content") as string

    // Check if both content and attachment are empty or null
    if (!content.trim() && !attachment) {
        return // If both are empty, do nothing
    }

    let attachmentUrl = null

    // If there is an attachment, upload it and get the URL
    if (attachment) {
        attachmentUrl = await handleAttachmentUpload(attachment)
        if (!attachmentUrl) {
            return // If there was an error uploading the file, do not create the post
        }
    }

    // Prepare the post data
    const statusData = {
        content: content.trim(), // Ensure no leading or trailing spaces
        author: user?.id,
        attachment: attachmentUrl || null, // Save the attachment URL in the 'attachment' column
    }

    const db = await createClient()

    // Insert the new post into the database
    await db.from("status").insert([statusData])

    return true
}