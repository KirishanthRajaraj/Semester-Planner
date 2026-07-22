import { TaskItem } from "@/interfaces/taskItem";
import { useSortable } from "@dnd-kit/react/sortable";
import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
import { pointerIntersection } from "@dnd-kit/collision";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SortableTask({ task, index, group }: { task: TaskItem; index: number; group: string }) {
    const { ref, isDragging } = useSortable({
        id: task.id,
        type: 'item',
        accept: ['item', 'column'],
        index: index,
        group: group,
        // without this, a previously-hovered item/column can stay the perceived target via
        // shape-overlap fallback even after the pointer has moved to a different container.
        collisionDetector: pointerIntersection,
        // DO NOT REMOVE, OptimisticSortingPlugin (default) causes errors
        plugins: [SortableKeyboardPlugin],
    });

    return (
        <Card
            ref={ref}
            className={`text-sm font-semibold p-3 rounded-md bg-primary text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
        >
            {task.title}
        </Card>
    )
}