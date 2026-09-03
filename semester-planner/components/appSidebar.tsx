'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, KanbanSquare, LayoutDashboard, NotepadText, Settings } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { ThemeToggle } from "./themeToggle";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "./ui/sidebar";

function AppLogo() {
    const { state, isMobile } = useSidebar();
    const collapsed = !isMobile && state === "collapsed";

    return (
        <div className="relative h-5 w-20 shrink-0 transition-[width] duration-200 ease-in-out group-data-[collapsible=icon]:w-5">
            <Link href={"/"}>
                <div className={`absolute left-0 top-0 px-1 ${collapsed ? "invisible" : ""}`}>
                    <RoughNotation type="highlight" show={!collapsed} animate={false} color="var(--primary)">
                        <span className="font-black text-background text-sm px-0.5 whitespace-nowrap">
                            Plänlify
                        </span>
                    </RoughNotation>
                </div>
                <div className={`absolute left-0 top-0 px-1 ${!collapsed ? "invisible" : ""}`}>
                    <RoughNotation type="highlight" show={collapsed} animate={false} color="var(--primary)">
                        <span className="font-black text-background text-sm px-0.5">
                            P
                        </span>
                    </RoughNotation>
                </div>
            </Link>
        </div>
    );
}

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
            <SidebarHeader className="bg-muted/20 flex flex-row items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col">
                <AppLogo />
                <SidebarTrigger className="cursor-pointer" />
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
                        <SidebarMenuItem className="">

                        </SidebarMenuItem>
                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="w-auto flex justify-end">
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
