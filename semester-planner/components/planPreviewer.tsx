'use client'
import { useEffect, useMemo, useState } from "react";
import { useSemesterStore } from "@/store/semesterStore";
import { useTaskStore } from "@/store/taskStore";
import { TaskItem } from "@/interfaces/taskItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { constructParentString } from "@/lib/taskOperations";


function getWeeks(start: Date, end: Date) {
    const weeks: { startDate: Date; endDate: Date }[] = [];
    let weekStart = new Date(start);
    while (weekStart < end) {
        // Sunday
        const weekEnd = new Date(weekStart);
        let startDay = weekStart.getDay(); // 0=Sun - 6=Sat
        const weekdayIndex = (startDay + 6) % 7; // konvertieren zu, Mon=0 - Sun=6, damit es einfacher ist zum rechnen
        const daysToSunday = 6 - weekdayIndex;
        weekEnd.setDate(weekStart.getDate() + daysToSunday);
        weeks.push({ startDate: weekStart, endDate: weekEnd < end ? weekEnd : end });
        weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() + 1);
    }
    return weeks;
}

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
    const tasks = useTaskStore((state) => state.tasks);

    const weeks = getWeeks(semester.startDate, semester.endDate);

    useEffect(() => {
        setWeeks(weeks);
    }, [weeks, setWeeks]);

    const inbox = tasks.filter((task) => !task.date);
    const outsideOfSemester = tasks.filter(
        (task) => task.date && (task.date < semester.startDate || task.date > semester.endDate)
    );

    return (
        <ScrollArea className={`${className} max-h-96 overflow-y-auto w-full`}>
            <div className="w-full flex flex-col gap-4 p-4">
                <TaskColumn title="Inbox" tasks={inbox} />
                {weeks.map((week, i) => (
                    <TaskColumn
                        key={i}
                        title={`Week ${i + 1}`}
                        tasks={tasks.filter(
                            (task) => task.date && task.date >= week.startDate && task.date < week.endDate
                        )}
                    />
                ))}
                <TaskColumn title="Outside of semester" tasks={outsideOfSemester} />
            </div>
        </ScrollArea>
    );
}
