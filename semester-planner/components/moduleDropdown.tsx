"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTaskStore } from "@/store/taskStore";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function TopTasksDropdown({ className, setModuleFilter }: { className?: string, setModuleFilter: React.Dispatch<React.SetStateAction<string>> }) {
    const tasks = useTaskStore((state) => state.tasks);

    const topTasks = tasks.filter((task) => task.parentId == undefined);
    const [position, setPosition] = useState<string>("All");
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger render={
                <Button variant="outline" className="mb-2">{position == "All" ? "All" : topTasks.find((t) => t.id == position)?.title}
                    <ChevronDown className="h-4 w-4" />
                </Button>} />
            <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Tasks</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={position} onValueChange={(value) => {
                        setModuleFilter(value)
                        setPosition(value)
                        setOpen(false);
                    }}>
                        <DropdownMenuRadioItem key={"allTasks"} value="All">
                            All
                        </DropdownMenuRadioItem>
                        {topTasks.map((task) => (
                            <DropdownMenuRadioItem key={task.id} value={task.id}>
                                {task.title}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
