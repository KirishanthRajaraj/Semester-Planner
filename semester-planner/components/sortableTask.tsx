import { TaskItem } from "@/interfaces/taskItem";
import { useSortable } from "@dnd-kit/react/sortable";
import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
import { pointerIntersection } from "@dnd-kit/collision";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DragDropIcon from "@/icons/dndIcon";
import { useTaskStore } from "@/store/taskStore";
import { constructParentString } from "@/lib/taskOperations";

export default function SortableTask({ task, index, group }: { task: TaskItem; index: number; group: string }) {
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
            className={`w-full flex flex-row items-center justify-between gap-4 text-sm font-semibold p-3 rounded-md bg-primary text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
        >
                <p className=" font-bold">{task.title}</p>
                <p className="text-xs font-extrabold bg-primary/30 dark:bg-primary/50 rounded-sm p-0.5 shadow-background/10 shadow-sm">{constructParentString(task)}</p>
                <p className="text-xs font-extrabold bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5">{task.duration !== undefined ? `${task.duration / 60}h` : ""}</p>
            <div className="w-6">
                <DragDropIcon />
            </div>
        </Card>
    )
}