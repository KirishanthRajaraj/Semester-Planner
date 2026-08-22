import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { useMemo, useState } from "react";
import SortableTask from "./sortableTask";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import Droppable from "./droppable";
import { useSemesterStore } from "@/store/semesterStore";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { getChildren, getDescendants } from "@/lib/taskOperations";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function dndArea() {
    const setTasks = useTaskStore((state) => state.setTasks);
    const tasks = useTaskStore((state) => state.tasks);
    const weeks = useSemesterStore((state) => state.weeks);
    const semester = useSemesterStore((state) => state.semester);

    // the exact task that has focuse toggled
    const [focusedId, setFocusedId] = useState<string | undefined>(undefined);
    const [focusMode, setFocusMode] = useState<"siblings" | "descendants">("siblings");

    const highlightedIds = useMemo(() => {
        if (!focusedId) return undefined;
        const focused = tasks.find((t) => t.id === focusedId);
        if (!focused) return undefined;
        if (focusMode === "siblings") {
            const siblings = focused.parentId !== undefined
                ? getChildren(tasks, focused.parentId)
                : tasks.filter((t) => t.parentId === undefined);
            return new Set(siblings.map((t) => t.id));
        }

        // first get siblings, then the descendants of each sibling, into a flat array of ids
        const siblings = focused.parentId !== undefined
            ? getChildren(tasks, focused.parentId)
            : tasks.filter((t) => t.parentId === undefined);

        // set to make lookup O(1)
        return new Set(siblings.flatMap((sibling) => [sibling.id, ...getDescendants(tasks, sibling.id).map((t) => t.id)],));
    }, [tasks, focusedId, focusMode]);

    const toggleFocus = (task: TaskItem) => {
        setFocusedId((prev) => (prev === task.id ? undefined : task.id));
    };

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


                const destDroppable = String(target.id);
                const draggedTaskId = source?.id;

                let isGeneralWeek = false;
                let newDate: Date | undefined = undefined;
                if (destDroppable.startsWith("week-")) {
                    isGeneralWeek = true;
                    const weekIndex = parseInt(destDroppable.split("-")[1]) - 1;
                    let d = new Date(weeks[weekIndex].endDate);

                    if (destDroppable.includes("-day-")) {
                        isGeneralWeek = false;
                        const dayIndex = parseInt(destDroppable.split("-")[3]) - 1;
                        const days = getDays(weeks[weekIndex]);
                        d = days[dayIndex];
                    }
                    newDate = d;
                }

                //breadcrumb handling
                let idsToMove = undefined;

                if (draggedTaskId?.toString().startsWith("subtree-")) {
                    const breadcrumbDraggedTaskId = draggedTaskId.toString().slice("subtree-".length);
                    const { getTaskById } = useTaskStore.getState();
                    if (breadcrumbDraggedTaskId) {
                        const bTask = getTaskById(breadcrumbDraggedTaskId);

                        if (bTask?.parentId) {
                            idsToMove = new Set(getDescendants(tasks, bTask.parentId).map((t) => t.id));
                        }
                    }
                }

                // wenn nur ein task
                let newTasks = tasks.map((task) =>
                    task.id === draggedTaskId ? { ...task, date: newDate, noDay: isGeneralWeek } : task
                );

                // wenn breadcrumb, newtasks überschreiben
                if (draggedTaskId?.toString().startsWith("subtree-")) {
                    newTasks = tasks.map((task) =>
                        idsToMove !== undefined && idsToMove.has(task.id) ? { ...task, date: newDate, noDay: isGeneralWeek } : task
                    );
                }

                // defer so dnd-kit finishes its own drag-end teardown before React re-renders
                // do not remove
                queueMicrotask(() => setTasks(newTasks));
            }}
        >
            <div className="flex w-full justify-center">
                {focusedId && (
                    <ToggleGroup
                        value={[focusMode]}
                        onValueChange={(values) => values[0] && setFocusMode(values[0] as "siblings" | "descendants")}
                        className={`font-bold`}
                    >
                        <ToggleGroupItem
                            value="siblings"
                            className={`${focusMode == 'siblings' ? '!bg-primary !text-background' : ''}`}
                        >Siblings</ToggleGroupItem>
                        <ToggleGroupItem
                            value="descendants"
                            className={`${focusMode == 'descendants' ? '!bg-primary !text-background' : ''}`}
                        >Siblings + Descendants</ToggleGroupItem>
                    </ToggleGroup>
                )}
            </div>
            <div className="w-full flex items-start gap-8 p-4">
                <div className="flex flex-col gap-8 w-32 md:w-52 lg:w-80">
                    <Droppable id={`inbox`} title={`Inbox`}>
                        {tasks.filter((task) => !task.date && getChildren(tasks, task.id).length == 0).map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} group="inbox" dimmed={highlightedIds !== undefined && !highlightedIds.has(task.id)} focused={focusedId === task.id} onToggleFocus={toggleFocus} />
                        ))}
                    </Droppable>
                    {tasks.filter((task) => task.date && (task.date < semester.startDate || task.date > semester.endDate)).length > 0 &&
                        <Droppable id={`outside-semester`} title={`Outside semester`}>
                            {tasks.filter((task) => task.date && getChildren(tasks, task.id).length == 0 && (task.date < semester.startDate || task.date > semester.endDate)).map((task, index) => (
                                <SortableTask key={task.id} task={task} index={index} group="outside-semester" dimmed={highlightedIds !== undefined && !highlightedIds.has(task.id)} focused={focusedId === task.id} onToggleFocus={toggleFocus} />
                            ))}
                        </Droppable>
                    }
                </div>
                <ScrollArea className={`h-[calc(100vh-200px)] w-full`}>

                    <div className="w-full flex flex-col gap-2 p-4">
                        {weeks.map((week, weekIndex) => (
                            <div key={`weekwrapper-${weekIndex + 1}`}>
                                <Droppable id={`week-${weekIndex + 1}`} title={`Week ${weekIndex + 1}`} key={weekIndex + 1} week={week} className={`w-full`}>
                                    {tasks.filter(task => task.date && getChildren(tasks, task.id).length == 0 && task.date >= week.startDate && task.date <= week.endDate && task.noDay).map((task, index) => (
                                        <SortableTask key={task.id} task={task} index={index} group={`week-${weekIndex + 1}`} dimmed={highlightedIds !== undefined && !highlightedIds.has(task.id)} focused={focusedId === task.id} onToggleFocus={toggleFocus} />
                                    ))}
                                </Droppable>

                                <div className="w-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 mb-4">
                                    {getDays(week).map((day, dayIndex) => (
                                        <Droppable id={`week-${weekIndex + 1}-day-${dayIndex + 1}`}
                                            title={day.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()}
                                            isDay={true} key={`week-${weekIndex + 1}-day-${dayIndex + 1}`}
                                            className={`gap-3 bg-transparent ring-0 align-bottom h-min ${day.getDay() != 1 && dayIndex == 0 ? COL_START_BY_DAY[day.getDay()] : ''}`}
                                            isToday={day.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)}>
                                            {tasks.filter(task => task.date && getChildren(tasks, task.id).length == 0 && task.date.toDateString() === day.toDateString() && !task.noDay).map((task, index) => (
                                                <SortableTask key={`day-${dayIndex + 1}-${task.id}`} task={task} index={index} group={`week-${weekIndex + 1}-day-${dayIndex + 1}`} dimmed={highlightedIds !== undefined && !highlightedIds.has(task.id)} focused={focusedId === task.id} onToggleFocus={toggleFocus} />
                                            ))}
                                        </Droppable>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </DragDropProvider>
    )
}