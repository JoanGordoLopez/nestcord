import { NextResponse } from "next/server"
import { createClient } from "@/database/server"
import Redis from "ioredis"

const CACHE_DURATION = 60 * 60 // 1 hora en segundos
const redis = new Redis(process.env.REDIS_DATABASE_URL!)

const getWordFrequencies = (texts: string[]) => {
    const wordCount = new Map<string, number>()

    for (const text of texts) {
        const words = text
            .toLowerCase()
            .replace(/[^\w\s#]/g, "")
            .split(/\s+/)
        for (const word of words) {
            if (word.length > 2) {
                wordCount.set(word, (wordCount.get(word) || 0) + 1)
            }
        }
    }

    return Array.from(wordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word, count]) => ({ word, count }))
}

export async function GET() {
    try {
        // Intenta recuperar de Redis
        const cacheTrends = await redis.get("trends")
        if (cacheTrends) {
            if (process.env.NODE_ENV !== "production") {
                console.log("[REDIS]: Cached trends")
            }
            return NextResponse.json(JSON.parse(cacheTrends), { status: 200 })
        }

        // Si no hay cache, obtener desde Supabase
        const db = await createClient()
        const { data, error } = await db
            .from("status")
            .select("content")
            .order("created_at", { ascending: false })
            .limit(100)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data || data.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        const texts = data.map((row) => row.content)
        const trends = getWordFrequencies(texts)

        // Almacenar en cache por 1 hora
        await redis.set("trends", JSON.stringify(trends), "EX", CACHE_DURATION)

        return NextResponse.json(trends, { status: 200 })
    } catch (err) {
        console.error("[ERROR]:", err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
