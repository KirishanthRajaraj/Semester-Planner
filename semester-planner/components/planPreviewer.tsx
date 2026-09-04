'use client'
import { useSemesterStore } from "@/store/semesterStore";
import { useTaskStore } from "@/store/taskStore";
import { TaskItem } from "@/interfaces/taskItem";
import { constructParentString, getChildren, isTaskOverdue } from "@/lib/taskOperations";
import { getDays } from "@/lib/semesterOperations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";

// identical to dndArea handling
const COL_START_BY_DAY: Record<number, string> = {
    0: "col-start-7", // So
    1: "col-start-1", // Mo
    2: "col-start-2",
    3: "col-start-3",
    4: "col-start-4",
    5: "col-start-5",
    6: "col-start-6", // Sa
};

const WEEKDAY_LABELS = ["M", "D", "M", "D", "F", "S", "S", "?"];

// heatmap, mehr tasks = hellere farbe, für später vielleicht in /10er schritten
function heatClass(count: number): string {
    if (count === 0) return "bg-muted/40";
    if (count === 1) return "bg-primary/20";
    if (count === 2) return "bg-primary/40";
    if (count === 3) return "bg-primary/60";
    if (count === 4) return "bg-primary/80";
    return "bg-primary";
}

function statusClass(task: TaskItem): string {
    if (task.status === "done") return "bg-green-500";
    if (isTaskOverdue(task)) return "bg-red-500";
    return "bg-primary";
}

function taskLabel(task: TaskItem): string {
    const parents = constructParentString(task);
    return parents ? `${task.title} < ${parents}` : task.title;
}

// one small square per task, draggable
function TaskDot({ task, large }: { task: TaskItem; large?: boolean }) {
    const { ref, isDragging } = useDraggable({ id: task.id, type: "item" });

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <div
                        ref={ref}
                        className={`${large ? "w-full h-auto py-0.5 px-2 font-bold text-xs text-background rounded-md whitespace-nowrap overflow-hidden text-ellipsis" : "size-3"} rounded-[2px] shrink-0 cursor-grab active:cursor-grabbing
                            transition-[width,height] duration-300
                            ${statusClass(task)} ${isDragging ? "opacity-40" : ""}`}
                    >{large ? task.title : ''}</div>
                }
            />
            <TooltipContent>{taskLabel(task)}</TooltipContent>
        </Tooltip>
    );
}

// droppable for the cells
function DotCell({ id, tasks, isToday, className, large }: { id: string; tasks: TaskItem[]; isToday?: boolean; className?: string; large?: boolean }) {
    const { ref, isDropTarget } = useDroppable({ id, type: "column", accept: "item" });

    return (
        <div
            ref={ref}
            className={`flex flex-wrap gap-0.5 content-start rounded-[3px] p-0.5 transition-all duration-300
                ${large ? "min-h-10" : "min-h-5"}
                ${tasks.length === 0 ? "bg-muted/20" : "bg-muted/40"}
                ${isDropTarget ? "ring-1 ring-foreground" : isToday ? "ring-1 ring-primary/50" : ""} ${className ?? ""}`}
        >
            {tasks.map((task) => <TaskDot key={task.id} task={task} large={large} />)}
        </div>
    );
}

function HeatCell({ id, tasks, label, isToday, className, large }: { id: string; tasks: TaskItem[]; label: string; isToday?: boolean; className?: string; large?: boolean }) {
    const { ref, isDropTarget } = useDroppable({ id, type: "column", accept: "item" });

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <div
                        ref={ref}
                        className={`${large ? "h-7" : "h-3.5"} rounded-[3px] transition-all duration-300 ${heatClass(tasks.length)}
                            ${isDropTarget ? "ring-1 ring-foreground" : isToday ? "ring-1 ring-foreground/50" : ""} ${className ?? ""}`}
                    />
                }
            />
            <TooltipContent>
                {tasks.length === 0
                    ? `${label}: keine Tasks`
                    : `${label}: ${tasks.map(taskLabel).join(" · ")}`}
            </TooltipContent>
        </Tooltip>
    );
}

export default function PlanPreviewer({ className }: { className?: string }) {
    const semester = useSemesterStore((state) => state.semester);
    const weeks = useSemesterStore((state) => state.weeks);
    const tasks = useTaskStore((state) => state.tasks);
    const setTasks = useTaskStore((state) => state.setTasks);
    const bumpBoardRevision = useTaskStore((state) => state.bumpBoardRevision);

    // leaves = tasks ohne children
    const leaves = tasks.filter((t) => getChildren(tasks, t.id).length === 0);
    const inbox = leaves.filter((t) => !t.date);
    const outside = leaves.filter((t) => t.date && (t.date < semester.startDate || t.date > semester.endDate));
    const today = new Date().toDateString();

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!isFullscreen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFullscreen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isFullscreen]);

    const tasksOfDay = (day: Date) =>
        leaves.filter((t) => t.date && !t.noDay && t.date.toDateString() === day.toDateString());
    const tasksOfWeekGeneral = (week: { startDate: Date; endDate: Date }) =>
        leaves.filter((t) => t.date && t.noDay && t.date >= week.startDate && t.date <= week.endDate);

    const renderRows = (mode: "heat" | "dots") => (
        <div className="flex flex-col gap-0.5">
            {/* Headerrow */}
            <div className="flex items-center gap-1 mt-1 ml-5">
                <div className="grid grid-cols-8 gap-0.5 flex-1">
                    {WEEKDAY_LABELS.map((d, i) => (
                        <span key={i} className="text-[9px] text-muted-foreground text-center leading-none">{d}</span>
                    ))}
                </div>
            </div>

            {/* content */}
            {weeks.map((week, weekIndex) => {
                const days = getDays(week);
                const isPast = week.endDate < new Date();
                const weekGeneral = tasksOfWeekGeneral(week);

                return (
                    <div key={weekIndex} className={`flex items-stretch gap-1 ${isPast ? "opacity-40" : ""}`}>
                        <span className="w-5 text-[9px] text-muted-foreground text-right leading-4">
                            {weekIndex + 1}
                        </span>
                        <div className="grid grid-cols-8 gap-0.5 flex-1">
                            {days.map((day, dayIndex) => {
                                const offset = day.getDay() !== 1 && dayIndex === 0 ? COL_START_BY_DAY[day.getDay()] : "";
                                // gleiche id convention wie in dndArea
                                const dayId = `week-${weekIndex + 1}-day-${dayIndex + 1}`;
                                return mode === "heat" ? (
                                    <HeatCell
                                        key={dayIndex}
                                        id={dayId}
                                        tasks={tasksOfDay(day)}
                                        label={day.toLocaleDateString("de-CH")}
                                        isToday={day.toDateString() === today}
                                        className={offset}
                                        large={isFullscreen}
                                    />
                                ) : (
                                    <DotCell
                                        key={dayIndex}
                                        id={dayId}
                                        tasks={tasksOfDay(day)}
                                        isToday={day.toDateString() === today}
                                        className={offset}
                                        large={isFullscreen}
                                    />
                                );
                            })}
                            {mode === "heat" ? (
                                <HeatCell id={`week-${weekIndex + 1}`} tasks={weekGeneral} label={`Woche ${weekIndex + 1} allgemein`} className={""} large={isFullscreen} />
                            ) : (
                                <DotCell id={`week-${weekIndex + 1}`} tasks={weekGeneral} className={""} large={isFullscreen} />
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
    );

    const handleDragEnd = (event: { canceled: boolean; operation: { source: { id: string | number } | null; target: { id: string | number } | null } }) => {
        if (event.canceled) return;
        const { source, target } = event.operation;
        if (!target || !source) return;

        const destDroppable = String(target.id);
        const draggedTaskId = String(source.id);

        // "inbox" faellt bewusst durch: kein Datum, kein noDay
        let noDay = false;
        let newDate: Date | undefined = undefined;
        if (destDroppable.startsWith("week-")) {
            noDay = true;
            const weekIndex = parseInt(destDroppable.split("-")[1]) - 1;
            const week = weeks[weekIndex];
            if (!week) return;
            let d = new Date(week.endDate);
            if (destDroppable.includes("-day-")) {
                noDay = false;
                const dayIndex = parseInt(destDroppable.split("-")[3]) - 1;
                d = getDays(week)[dayIndex];
                if (!d) return;
            }
            newDate = d;
        }

        const newTasks = tasks.map((task) =>
            task.id === draggedTaskId ? { ...task, date: newDate, noDay, dateInherited: false } : task
        );

        // defer, damit dnd-kit sein drag-end fertig abwickelt bevor React neu rendert
        queueMicrotask(() => {
            setTasks(newTasks);
            // update text planer, sonst überschreibt der naechste tastendruck im editor diese änderung
            bumpBoardRevision();
        });
    };

    return (
        <div className={`w-full ${!isFullscreen ? 'sticky top-0 pt-4 -mt-4' : ''}`}>
            <DragDropProvider onDragEnd={handleDragEnd}>

                <div
                    className={`${isFullscreen
                        ? "fixed inset-4 z-50 overflow-auto shadow-2xl animate fade-in-0 zoom-in-95 duration-200"
                        : `${className} w-full`
                        } border-2 border-muted-foreground/20 rounded-xl bg-background p-3`}
                >
                    <Tabs defaultValue="dots">
                        <div className="flex items-center justify-between gap-2">
                            <TabsList className="p-1.5 rounded-lg bg-card">
                                <TabsTrigger className="data-[active]:!bg-primary data-[active]:text-background p-1 cursor-pointer" value="dots">Tasks</TabsTrigger>
                                <TabsTrigger className="data-[active]:!bg-primary data-[active]:text-background p-1 cursor-pointer" value="heat">Heatmap</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                {outside.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground">{outside.length} outside semester</span>
                                )}
                                <Button className="cursor-pointer" variant="ghost" size="icon-xs" onClick={() => setIsFullscreen((v) => !v)}>
                                    {isFullscreen ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="dots">{renderRows("dots")}</TabsContent>
                        <TabsContent value="heat">{renderRows("heat")}</TabsContent>

                        {/* inbox, tasks ohne datum */}
                        <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                            <p className="text-[9px] text-muted-foreground mb-1">Inbox ({inbox.length})</p>
                            <DotCell id="inbox" tasks={inbox} className="min-h-6" large={isFullscreen} />
                        </div>
                    </Tabs>
                </div>
            </DragDropProvider>
        </div>
    );
}
