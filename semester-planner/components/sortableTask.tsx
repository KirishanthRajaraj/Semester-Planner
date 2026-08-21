import { TaskItem } from "@/interfaces/taskItem";
import { useSortable } from "@dnd-kit/react/sortable";
import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
import { pointerIntersection } from "@dnd-kit/collision";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DragDropIcon from "@/icons/dndIcon";
import { useTaskStore } from "@/store/taskStore";
import { constructParentString } from "@/lib/taskOperations";
import { CircleX } from 'lucide-react';
import { X } from 'lucide-react';
import { useEffect } from "react";
import { TaskStatusToggle } from "./TaskStatusToggle";

export default function SortableTask({ task, index, group }: { task: TaskItem; index: number; group: string }) {
    const deleteTaskById = useTaskStore((state) => state.deleteTaskById);
    const tasks = useTaskStore((state) => state.tasks);
    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    const { ref, isDragging } = useSortable({
        id: task.id,
        type: 'item',
        accept: ['item', 'column'],
        index: index,
        group: group,
        collisionDetector: pointerIntersection,
        // DO NOT REMOVE, OptimisticSortingPlugin (default) causes errors
        plugins: [SortableKeyboardPlugin],
    });

    return (
        <Card
            ref={ref}
            className={`group duration-200 truncate w-full ${task.status === 'done' ? 'bg-green-500' : 'bg-primary'} gap-0.5 ${task.parentId !== undefined ? '!pt-5' : ''} relative overflow-visible font-semibold p-3 rounded-lg text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
        >
            {task.parentId && <div className="absolute text-xs -left-1 -top-3 text-primary font-bold bg-background rounded-md px-2 py-1">
                <span>{constructParentString(task)}</span>
            </div>}
            <div className="w-full flex flex-row items-center gap-2">
                <TaskStatusToggle task={task} className="rounded-full !p-0 -ml-0.5 scale-0 duration-200 transition-all min-w-6 max-h-6 w-6 absolute group-hover:scale-100 !bg-muted/30 hover:bg-muted/70 " classNameIcons="!ring-0 border-3 !w-full !h-full !p-0"></TaskStatusToggle>
                <p className="text-sm font-bold truncate group-hover:ml-7 duration-200">{task.title}</p>
                {task.duration && <p className="text-xs font-extrabold bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5">{task.duration !== undefined ? `${task.duration / 60}h` : ""}</p>}
            </div>

            <div className="w-6 duration-300">
                <X
                    className="
                              transition-all 
            duration-200
            absolute -right-3.5 -top-3.5 size-7
            hover:size-8 hover:-right-4 hover:-top-4
            scale-0
            group-hover:scale-100
            cursor-pointer
            bg-red-700/90
            rounded-full
            stroke-5
            border-6
            shadown
            border-black
            p-0.5
            ring-0
        "
                    onClick={() => deleteTaskById(task.id)}
                ></X>
            </div>
        </Card>
    )
}