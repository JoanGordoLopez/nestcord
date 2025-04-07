"use server"
import { createClient } from "@/database/server"

export async function fetchProfileLikes(id: string) {
    const db = await createClient()

    // Aquí, seleccionamos los datos de la tabla `status` relacionados con los likes
    const { data: likes, error } = await db
        .from("likes")
        .select(
            "id, user_id, status(id, author(id, name, username, avatar), content, attachment, comments, views, likes, created_at, updated_at)"
        ) // Selecciona todos los campos de la tabla `status` usando `status(*)`
        .eq("user_id", id) // Filtra por el `user_id`

    console.log(JSON.stringify(likes))
    if (error) {
        console.error("Error al obtener los likes:", error)
        return null
    }

    return likes || []
}
