"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/database/server"

export async function followUser(followerId: string, authorId: string) {
    const db = await createClient()
  if (!followerId || !authorId) {
    return { success: false, error: "IDs de usuario no válidos" }
  }

  try {
    // Verificar si ya existe la relación de seguimiento
    const { data: existingFollow } = await db
      .from("follows")
      .select("id")
      .eq("follower", followerId)
      .eq("author", authorId)
      .single()

    if (existingFollow) {
      // Si ya existe, eliminar la relación (dejar de seguir)
      await db.from("follows").delete().eq("follower", followerId).eq("author", authorId)

      revalidatePath(`/${authorId}`)
      revalidatePath(`/${followerId}`)
      revalidatePath(`/${authorId}/followers`)
      revalidatePath(`/${followerId}/following`)

      return { success: true, action: "unfollow" }
    } else {
      // Si no existe, crear la relación (seguir)
      await db.from("follows").insert({
        follower: followerId,
        author: authorId,
      })

      revalidatePath(`/${authorId}`)
      revalidatePath(`/${followerId}`)
      revalidatePath(`/${authorId}/followers`)
      revalidatePath(`/${followerId}/following`)

      return { success: true, action: "follow" }
    }
  } catch (error) {
    console.error("Error al seguir/dejar de seguir:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}
