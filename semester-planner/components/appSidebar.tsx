'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, KanbanSquare, LayoutDashboard, NotepadText, Settings } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "./ui/sidebar";

const navItems = [
    { title: "Text Plan", url: "/", icon: NotepadText },
    { title: "Plan", url: "/plan", icon: KanbanSquare },
    { title: "Overview", url: "/overview", icon: LayoutDashboard },
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Info", url: "/info", icon: Info },
];

export default function AppSidebar() {
    const pathname = usePathname();

    return (

        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="bg-muted/20 flex items-end justify-center">
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent className="bg-muted/20">
                <SidebarGroup>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                    render={<Link href={item.url} />}
                                    className={`${pathname == item.url ? '!bg-primary !text-background' : ''}`}
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
