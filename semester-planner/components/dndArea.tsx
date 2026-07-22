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
                    console.log("test");
                    if (target?.id.toString().includes("week")) {
                    console.log("test1");

                        const weekIndex = parseInt(target.id.toString().split("-")[1]) - 1;
                        const startDate = weeks[weekIndex].startDate;
                        const endDate = weeks[weekIndex].endDate;
                        const draggedTaskId = source?.id;
                        console.log(draggedTaskId);
                        //Das Datum neu setzen für den Task der in eine neue Wochegedragged wurde
                        console.log(target.id)
                        setTasks(tasks.map((task) =>
                            task.id === draggedTaskId ? { ...task, date: new Date(startDate.getDate() + (weekIndex * 7)) } : task
                        ));
                    }
                }}
            >
                <div className="w-80 flex flex-col gap-2 p-4">
                    <Droppable id={`inbox`} title={`Inbox`}>
                        {tasks.map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} />
                        ))}
                    </Droppable>
                </div>


                {weeks.map((week, index) => (
                    <Droppable id={`week-${index + 1}`} title={`Week ${index + 1}`} key={`week-${index + 1}`}>
                        {tasks.filter(task => task.date && task.date >= week.startDate && task.date <= week.endDate).map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} />
                        ))}
                    </Droppable>
                ))}

            </DragDropProvider>
        </div>
    )
}