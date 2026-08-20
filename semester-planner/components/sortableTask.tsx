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
            className={`group truncate w-full gap-0.5 ${task.parentId !== undefined ? '!pt-5': ''} relative overflow-visible font-semibold p-3 rounded-lg bg-primary text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
        >
            {task.parentId && <div className="absolute text-xs -left-1 -top-3 text-primary font-bold bg-background rounded-md px-2 py-1">
                <span>{constructParentString(task)}</span>
            </div> }
            <div className="w-full flex flex-row items-center justify-between gap-2">
                <p className="text-sm font-bold truncate">{task.title}</p>
                {task.duration && <p className="text-xs font-extrabold bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5">{task.duration !== undefined ? `${task.duration / 60}h` : ""}</p>}
            </div>

            <div className="w-6">
                <X
                    className="
            absolute -right-4 -top-4
            w-8 h-8
            scale-0
            transition-transform duration-200
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