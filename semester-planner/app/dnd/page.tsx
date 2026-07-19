'use client';

import { useTaskStore } from "@/store/taskStore";

export default function dnd() {
    return (
        <div className="container font-sans flex flex-col flex-1 items-center justify-center">
            dnd area
            <p className="text-sm text-muted-foreground">
                {useTaskStore((state) => state.tasks).map((task) => (
                    <div key={task.id}>
                        {task.title} - {task.date?.toDateString()}
                    </div>
                ))}
            </p>
        </div>
    );
}
