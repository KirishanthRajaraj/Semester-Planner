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

export function TopTasksDropdown() {
    const tasks = useTaskStore((state) => state.tasks);
    const topTasks = tasks.filter((task) => task.parentId == undefined);

    const [position, setPosition] = React.useState("bottom")

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
            <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Modules</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
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
