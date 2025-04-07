"use server"

import { createClient } from "@/database/server"
import { revalidatePath } from "next/cache"

type UserUpdate = {
    name?: string
    username?: string
    website?: string
    biography?: string
}

export async function updateUser(updates: UserUpdate) {
    const db = await createClient()
    const { data: user, error } = await db.auth.getUser()

    if (error || !user?.user?.id) {
        console.error("Error fetching authenticated user:", error)
        throw new Error("User not authenticated")
    }

    // Filtrar solo los campos definidos
    const updatedFields = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(updatedFields).length === 0) {
        console.log("No fields to update")
        return
    }

    // ✅ Verificar si el `name` ya existe en la base de datos
    if (updates.username) {
        const { data: existingUsers, error: nameCheckError } = await db
            .from("users")
            .select("id")
            .eq("username", updates.username)
            .neq("id", user.user.id) // Evita comparar con el mismo usuario

        if (nameCheckError) {
            console.error("Error checking name availability:", nameCheckError)
            throw new Error("Failed to verify name availability")
        }

        if (existingUsers.length > 0) {
            throw new Error("This name is already taken")
        }
    }

    // ✅ Actualizar usuario en la base de datos
    const { error: updateError } = await db
        .from("users")
        .update(updatedFields)
        .eq("id", user.user.id)

    if (updateError) {
        console.error("Error updating user:", updateError)
        throw new Error("Failed to update user")
    }

    await revalidatePath("/home")
    return true
}
