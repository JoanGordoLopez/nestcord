"use server";

import { createClient } from "@/database/server";

export async function uploadAvatar(attachment: File, id: string) {
  const db = await createClient();

  const extension = attachment.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await db.storage
    .from("avatars")
    .upload(fileName, attachment);

  if (error) {
    throw new Error(error.name);
  }

  if (data) {
    const avatar =
      "https://frhbjqrfnnemrkilykjd.supabase.co/storage/v1/object/public/avatars/" +
      fileName;
    await db.from("users").update({ avatar: avatar }).eq("id", id);
  }
}
