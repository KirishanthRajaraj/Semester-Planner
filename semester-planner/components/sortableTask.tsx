import { TaskItem } from "@/interfaces/taskItem";
import { useSortable } from "@dnd-kit/react/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SortableTask({ task, index }: { task: TaskItem; index: number }) {
    const { ref, isDragging } = useSortable({ id: task.id, index: index });

    return (
        <Card
            ref={ref}
            className={`text-sm font-semibold p-3 rounded-md bg-primary text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
            key={task.id}
            id={task.id}
        >
            {task.title}
        </Card>
    )
}