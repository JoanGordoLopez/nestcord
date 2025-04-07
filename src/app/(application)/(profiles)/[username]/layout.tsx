import { UserContextProvider } from "@/context/user-context"
import type { ReactNode } from "react"

interface AppLayoutProps {
    children: ReactNode
}

const ProfileLayout = (props: AppLayoutProps) => {
    return (
        <main className="min-h-screen bg-white text-black dark:bg-background dark:text-white">
            <UserContextProvider>{props.children}</UserContextProvider>
        </main>
    )
}

export default ProfileLayout
