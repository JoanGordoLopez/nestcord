import ApplicationFeed from "@/components/app/app-feed"
import { ChatContainer } from "@/components/messages/chat-container"
import { createClient } from "@/database/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export default async function Home() {
    /** Custom Page Middleware to prevent unauthenticated users accessing pages */
    const db = await createClient()
    const user = await db.auth.getUser()
    if (!user) redirect("/")

    return (
        <>
            <ApplicationFeed />

            <ChatContainer />
        </>
    )
}
