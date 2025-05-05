import { NotificationsContent } from "@/components/notifications/notifications-content";

export default function Notifications() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="mx-auto flex max-w-7xl">
                <NotificationsContent />
            </div>   
        </div>

    )
}