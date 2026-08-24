'use client'
import { useEffect } from "react";
import { useSemesterStore } from "@/store/semesterStore";
import { useTaskStore } from "@/store/taskStore";
import { TaskItem } from "@/interfaces/taskItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { constructParentString } from "@/lib/taskOperations";
import { getWeeks } from "@/lib/semesterOperations";

function TaskColumn({ title, tasks }: { title: string; tasks: TaskItem[] }) {
    return (
        <>
            {title.includes("Week") ? (
                <div className="flex flex-col gap-1 p-4 rounded-md border-bottom gap-4">
                    <h2 className="text-lg font-bold border-b-4">{title}</h2>
                    <div className="flex flex-col gap-2">
                        {tasks.map((task) => (
                            <Card key={task.id} className="text-xs font-semibold p-2 rounded-md bg-primary text-background">
                                <p>{constructParentString(task)}{task.parentId !== undefined ? " > " : ""}{task.title}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card>

                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1">
                        {tasks.map((task) => (
                            <Card key={task.id} className="text-xs font-semibold p-1 rounded-md bg-primary text-background">
                                <p>{constructParentString(task)}{task.parentId !== undefined ? " < " : ""}{task.title}</p>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )
            }
        </>
    );
}

export default function PlanPreviewer({ className }: { className?: string }) {
    const semester = useSemesterStore((state) => state.semester);
    const setWeeks = useSemesterStore((state) => state.setWeeks);
    const weeks = useSemesterStore((state) => state.weeks);

    const tasks = useTaskStore((state) => state.tasks);

    const inbox = tasks.filter((task) => !task.date);
    const outsideOfSemester = tasks.filter(
        (task) => task.date && (task.date < semester.startDate || task.date > semester.endDate)
    );

    return (
        <ScrollArea className={`${className} max-h-96 overflow-y-auto w-full border-2 border-muted-foreground/20 rounded-xl`}>
            <div className="w-full flex flex-col gap-4 p-4">
                <p className="text-sm font-bold text-foreground/40">Preview</p>
                <TaskColumn title="Inbox" tasks={inbox} />
                {weeks.map((week, i) => (
                    <TaskColumn
                        key={i}
                        title={`Week ${i + 1}`}
                        tasks={tasks.filter(
                            (task) => task.date && task.date >= week.startDate && task.date <= week.endDate
                        )}
                    />
                ))}
                <TaskColumn title="Outside of semester" tasks={outsideOfSemester} />
            </div>
        </ScrollArea>
    );
}
