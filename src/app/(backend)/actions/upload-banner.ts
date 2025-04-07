"use server";

import { createClient } from "@/database/server";

export async function uploadBanner(attachment: File, id: string) {
  const db = await createClient();

  const extension = attachment.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await db.storage
    .from("banners")
    .upload(fileName, attachment);

  if (error) {
    throw new Error(error.name);
  }

  if (data) {
    const banner =
      "https://frhbjqrfnnemrkilykjd.supabase.co/storage/v1/object/public/banners/" +
      fileName;
    await db.from("users").update({ banner: banner }).eq("id", id);
  }
}
