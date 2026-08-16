'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KanbanSquare, LayoutDashboard, NotepadText } from "lucide-react";
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
    { title: "Editor", url: "/", icon: NotepadText },
    { title: "Übersicht", url: "/overview", icon: LayoutDashboard },
    { title: "Planung", url: "/plan", icon: KanbanSquare },
];

export default function AppSidebar() {
    const pathname = usePathname();

    return (

        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="flex items-end justify-center">
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                    render={<Link href={item.url} />}
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
