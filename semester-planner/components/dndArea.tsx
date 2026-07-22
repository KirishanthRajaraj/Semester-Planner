import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { useState } from "react";
import SortableTask from "./sortableTask";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import DroppableWeek from "./droppable";
import { useSemesterStore } from "@/store/semesterStore";
import Droppable from "./droppable";

export default function dndArea() {
    const setTasks = useTaskStore((state) => state.setTasks);
    const tasks = useTaskStore((state) => state.tasks);
    const weeks = useSemesterStore((state) => state.weeks);

    return (
        <div>
            <DragDropProvider
                onDragEnd={(event) => {
                    if (event.canceled) return;

                    const { target, source } = event.operation;
                    if (!target) return;

                    // target is either a sibling task (sortable → read its group) or a bare
                    // container (read its id). both resolve to the destination group id.
                    const destGroup = isSortable(target) ? String(target.group) : String(target.id);
                    const draggedTaskId = source?.id;

                    // group is derived from date at render, so we only need to set the date:
                    // inbox → no date; a week → a date nudged one day inside the week so it
                    // doesn't land on the shared week boundary and match two weeks at once.
                    let newDate: Date | undefined = undefined;
                    if (destGroup.startsWith("week-")) {
                        const weekIndex = parseInt(destGroup.split("-")[1]) - 1;
                        const d = new Date(weeks[weekIndex].startDate);
                        d.setDate(d.getDate() + 1);
                        newDate = d;
                    }

                    const newTasks = tasks.map((task) =>
                        task.id === draggedTaskId ? { ...task, date: newDate } : task
                    );
                    console.log(newTasks);
                    
                    // defer so dnd-kit finishes its own drag-end teardown before React re-renders
                    // do not remove
                    queueMicrotask(() => setTasks(newTasks));
                }}
            >
                <div className="w-80 flex flex-col gap-2 p-4">
                    <Droppable id={`inbox`} title={`Inbox`}>
                        {tasks.filter((task) => !task.date).map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} group="inbox" />
                        ))}
                    </Droppable>
                </div>


                {weeks.map((week, weekIndex) => (
                    <Droppable id={`week-${weekIndex + 1}`} title={`Week ${weekIndex + 1}`} key={weekIndex + 1}>
                        {tasks.filter(task => task.date && task.date >= week.startDate && task.date <= week.endDate).map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} group={`week-${weekIndex + 1}`}  />
                        ))}
                    </Droppable>
                ))}

            </DragDropProvider>
        </div>
    )
}