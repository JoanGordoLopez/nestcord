"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ThemeSwitchProps {
    variant?: "dropdown" | "button"
}

export function ThemeSwitch({ variant = "button" }: ThemeSwitchProps) {
    const { theme, setTheme } = useTheme()

    if (variant === "dropdown") {
        return (
            <>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme("light")
                        console.info(
                            "\x1b[36m%s\x1b[0m",
                            "[LOG]",
                            `Application theme switched to "Light"`
                        )
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                >
                    <Sun className="h-5 w-5" />
                    <span>Light Theme</span>
                    {theme === "light" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        setTheme("dark")
                        console.info(
                            "\x1b[36m%s\x1b[0m",
                            "[LOG]",
                            `Application theme switched to "Dark"`
                        )
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 py-3 px-4 text-black dark:text-white"
                >
                    <Moon className="h-5 w-5" />
                    <span>Dark Theme</span>
                    {theme === "dark" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
            </>
        )
    }

    return (
        <div className="flex gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme("light")}
                className={`rounded-full ${theme === "light" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
            >
                <Sun className="h-5 w-5" />
                <span className="sr-only">Tema claro</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme("dark")}
                className={`rounded-full ${theme === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
            >
                <Moon className="h-5 w-5" />
                <span className="sr-only">Tema oscuro</span>
            </Button>
        </div>
    )
}
