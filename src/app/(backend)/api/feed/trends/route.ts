import { NextResponse } from "next/server"
import { createClient } from "@/database/server"
import Redis from "ioredis"

const CACHE_DURATION = 60 * 60 // 1 hour in seconds
const redis = new Redis(process.env.REDIS_DATABASE_URL!)

/**
 * Analyzes an array of text content and returns the top 3 most frequent words (min length 3).
 * 
 * @param texts - An array of strings representing post content.
 * @returns An array of objects with word and frequency count.
 */
const getWordFrequencies = (texts: string[]) => {
    const wordCount = new Map<string, number>()

    for (const text of texts) {
        const words = text
            .toLowerCase()
            .replace(/[^\w\s#]/g, "") // Remove punctuation but keep hashtags
            .split(/\s+/) // Split by whitespace

        for (const word of words) {
            if (word.length > 2) {
                wordCount.set(word, (wordCount.get(word) || 0) + 1)
            }
        }
    }

    // Sort by frequency and return top 3
    return Array.from(wordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word, count]) => ({ word, count }))
}

/**
 * GET /api/trends
 * 
 * Fetches trending words from recent posts. Uses Redis to cache results for 1 hour.
 * 
 * @returns A JSON response with the most common words and their frequency.
 */
export async function GET() {
    try {
        // Try fetching trends from Redis cache
        const cacheTrends = await redis.get("trends")
        if (cacheTrends) {
            if (process.env.NODE_ENV !== "production") {
                console.log("[REDIS]: Cached trends")
            }
            return NextResponse.json(JSON.parse(cacheTrends), { status: 200 })
        }

        // If not cached, fetch the latest 100 statuses from Supabase
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

        // Extract trends from content
        const texts = data.map((row) => row.content)
        const trends = getWordFrequencies(texts)

        // Cache trends in Redis for 1 hour
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
