"use client";
import { useUser } from "@/context/user-context";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, User } from "lucide-react";

export default function SidebarMobile() {
    const { user } = useUser();
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/home" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: Bell, label: "Notifications", href: "/notifications" },
        { icon: User, label: "Profile", href: `/${user?.username}` },
    ];

    return (
        <section className="fixed bottom-0 left-0 w-full bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90 border-t border-gray-200 dark:border-gray-800 z-50">
            <nav className="flex justify-around items-center py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                isActive ? "text-indigo-500" : "text-gray-600 dark:text-gray-300"
                            }`}
                            aria-label={item.label}
                        >
                            <item.icon
                                className={`h-6 w-6 ${
                                    isActive ? "text-indigo-500" : "text-gray-600 dark:text-gray-300"
                                }`}
                            />
                        </a>
                    );
                })}
            </nav>
        </section>
    );
}
