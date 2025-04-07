"use server"

import { createClient } from "@/database/server"
import { redirect } from "next/navigation"

export async function fetchProfile(username: string) {
    const db = await createClient()

    const { data: user, error: userError } = await db
        .from("users")
        .select("*")
        .eq("username", username)
        .single()

    if (userError || !user) {
        console.error(
            "Error al obtener datos del usuario:",
            username,
            userError
        )
        redirect("/")
    }

    // Obtener los badges del usuario

    return user
}
