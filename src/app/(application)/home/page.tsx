import ApplicationFeed from "@/components/app/app-feed"
import { createClient } from "@/database/client"
import { redirect } from "next/navigation"

export default async function Home() {
    /** Custom Page Middleware to prevent unauthenticated users accessing pages */
    const db = createClient()
    const user = await db.auth.getUser()
    if (!user) redirect("/")

    return (
        <>
            <ApplicationFeed />
        </>
    )
}
