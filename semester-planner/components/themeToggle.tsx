'use client'
import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export function ThemeToggle() {
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {
        }
    };

    return (
        <SidebarMenuButton
            tooltip="Theme"
            onClick={toggleTheme}
            aria-label="Theme wechseln"
            className="cursor-pointer w-auto"
        >
            <span className="relative flex size-4 shrink-0 items-center justify-center">
                <Sun
                    className="absolute text-[oklch(0.795 0.184 86.047)] sun-glow transition-all duration-500
                               rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    className="absolute transition-all duration-500
                               rotate-90 scale-0 dark:rotate-0 dark:scale-100"
                />
            </span>
        </SidebarMenuButton>
    );
}
