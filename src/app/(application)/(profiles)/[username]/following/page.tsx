import { Suspense } from "react"
import { notFound } from "next/navigation"
import Sidebar from "@/components/navigation/sidebar/sidebar"
import { Loader2 } from "lucide-react"
import { ProfileAside } from "@/components/navigation/aside/aside"
import { ChatContainer } from "@/components/messages/chat-container"
import { fetchProfile } from "@/actions/fetch-profile"
import { FollowingContent } from "@/components/profile/following/following-content"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    try {
        const { username } = await params
        const user = await fetchProfile(username)

        return {
            title: `People followed by ${user.name} (@${user.username}) | Nestcord`,
            description:
                user.biography || `People followed by ${user.name} (@${user.username}) on Nestcord`,
            openGraph: {
                images: [{ url: user.avatar }],
            },
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            title: "Profile not found | Nestcord",
            description: "This profile does not exist or is not available",
        }
    }
}

export default async function ProfileFollowers({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    let user
    const { username } = await params
    try {
        user = await fetchProfile(username)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="mx-auto flex max-w-7xl">
                <Sidebar />

                <main className="flex-1 border-x border-gray-200 dark:border-gray-800 min-h-screen">
                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                            </div>
                        }
                    >
                        <FollowingContent user={user} />
                    </Suspense>
                </main>

                <ProfileAside />
                <ChatContainer />
            </div>
        </div>
    )
}