import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { useState } from "react";
import SortableTask from "./sortableTask";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import Droppable from "./droppable";
import { useSemesterStore } from "@/store/semesterStore";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function dndArea() {
    const setTasks = useTaskStore((state) => state.setTasks);
    const tasks = useTaskStore((state) => state.tasks);
    const weeks = useSemesterStore((state) => state.weeks);
    const semester = useSemesterStore((state) => state.semester);

    // implementation day droppables
    //check which days each week has in the background
    //if it needs to be corrected, correct it, should start on mondays.
    //have each weekday of that week in an array or use weeks startdate and loop through until enddate, which should be sunday

    //change ondragend to support day
    //render
    //handle the edge cases

    const COL_START_BY_DAY: Record<number, string> = {
        0: "col-start-7", // Sun
        1: "col-start-1", // Mon
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6", // Sat
    };

    //to return an array of days, from the input week
    function getDays({ startDate, endDate }: { startDate: Date; endDate: Date }): Date[] {
        const days: Date[] = [];
        const d = new Date(startDate);
        while (d <= endDate) {
            days.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return days;
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;

                const { target, source } = event.operation;
                if (!target) return;

                const destGroup = isSortable(target) ? String(target.group) : String(target.id);
                const draggedTaskId = source?.id;

                let isGeneralWeek = false;
                let newDate: Date | undefined = undefined;
                if (destGroup.startsWith("week-")) {
                    isGeneralWeek = true;
                    const weekIndex = parseInt(destGroup.split("-")[1]) - 1;
                    let d = new Date(weeks[weekIndex].endDate);
                    
                    if(destGroup.includes("-day-")) {
                        isGeneralWeek = false;
                        const dayIndex = parseInt(destGroup.split("-")[3]) - 1;
                        const days = getDays(weeks[weekIndex]);
                        d = days[dayIndex];
                    }
                    newDate = d;
                }
                console.log(newDate);
                const newTasks = tasks.map((task) =>
                    task.id === draggedTaskId ? { ...task, date: newDate, noDay: isGeneralWeek } : task
                );
                // defer so dnd-kit finishes its own drag-end teardown before React re-renders
                // do not remove
                queueMicrotask(() => setTasks(newTasks));
            }}
        >
            <div className="w-full flex items-start gap-8 p-4">
                <div className="flex flex-col gap-8 w-80">
                    <Droppable id={`inbox`} title={`Inbox`}>
                        {tasks.filter((task) => !task.date).map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} group="inbox" />
                        ))}
                    </Droppable>
                    {tasks.filter((task) => task.date && (task.date < semester.startDate || task.date > semester.endDate)).length > 0 &&
                        <Droppable id={`outside-semester`} title={`Outside semester`}>
                            {tasks.filter((task) => task.date && (task.date < semester.startDate || task.date > semester.endDate)).map((task, index) => (
                                <SortableTask key={task.id} task={task} index={index} group="outside-semester" />
                            ))}
                        </Droppable>
                    }
                </div>
                <ScrollArea className={`h-[calc(100vh-200px)] w-full`}>

                    <div className="w-full flex flex-col gap-2 p-4">
                        {weeks.map((week, weekIndex) => (
                            <>
                                <Droppable id={`week-${weekIndex + 1}`} title={`Week ${weekIndex + 1}`} key={weekIndex + 1} className={`w-full`}>
                                    {tasks.filter(task => task.date && task.date >= week.startDate && task.date <= week.endDate && task.noDay).map((task, index) => (
                                        <SortableTask key={task.id} task={task} index={index} group={`week-${weekIndex + 1}`} />
                                    ))}
                                </Droppable>

                                <div className="w-full grid grid-cols-7 gap-1">
                                    {getDays(week).map((day, dayIndex) => (
                                        <Droppable id={`week-${weekIndex + 1}-day-${dayIndex + 1}`} title={day.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()} isDay={true} key={`week-${weekIndex + 1}-day-${dayIndex + 1}`} className={`gap-3 bg-transparent ring-0 align-bottom h-min ${day.getDay() != 1 && dayIndex == 0 ? COL_START_BY_DAY[day.getDay()] : ''}`}>
                                            {tasks.filter(task => task.date && task.date.toDateString() === day.toDateString() && !task.noDay).map((task, index) => (
                                                <SortableTask key={task.id} task={task} index={index} group={`week-${weekIndex + 1}-day-${dayIndex + 1}`} />
                                            ))}
                                        </Droppable>
                                    ))}
                                </div>
                            </>
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </DragDropProvider>
    )
}