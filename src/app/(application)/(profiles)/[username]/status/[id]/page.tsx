import { fetchStatus } from "@/actions/fetch-status"

import Sidebar from "@/components/navigation/sidebar/sidebar"
import { Aside } from "@/components/navigation/aside/aside"

import { Statuscomment } from "@/components/app/comment-feed"
import { ChatContainer } from "@/components/messages/chat-container"

export default async function Status({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const status = await fetchStatus(id)
    if (status) {
        return (
            <main className="min-h-screen bg-white text-black dark:bg-background dark:text-white">
                <div className="mx-auto flex max-w-7xl">
                    <Sidebar />
                    <Statuscomment id={status.id} />
                    <Aside />
                    <ChatContainer />
                </div>
            </main>
        )
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const status = await fetchStatus(id)
    return {
        title: `On Nestcord: "${status?.content}"`,
    }
}
