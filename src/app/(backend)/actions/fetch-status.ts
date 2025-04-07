"use server";

import { createClient } from "@/database/server";

export async function fetchStatus(id: string) {
  const db = await createClient();

  const { data: status } = await db
    .from("status")
    .select(
      "id, author(id, name, username, avatar, biography, created_at), attachment, content, comments, likes, views, created_at",
    )
    .eq("id", id)
    .single();

  if (!status) {
    const { data: status } = await db
      .from("status_replies")
      .select(
        "id, author(id, name, username, avatar, biography, created_at), attachment, content, comments, likes, views, created_at",
      )
      .eq("id", id)
      .single();

    return status;
  }

  return status;
}
