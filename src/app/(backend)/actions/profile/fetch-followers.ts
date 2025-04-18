"use client";
import { createClient } from "@/database/server";

export async function fetchProfileFollowers(username: string) {
    const db = await createClient();

    const { data, error } = await db
    .from("follows")
    .select("id, follower(id, name, username, avatar), author(id, name, username, avatar), created_at")
    .eq("follower", username)
    .order("created_at", { ascending: false })
    .limit(10)

    if (error) {
        console.error("Error fetching followers:", error);
        return;
    }
    
    console.log(data);
    return data || [];

}