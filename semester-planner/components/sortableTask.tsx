import { TaskItem } from "@/interfaces/taskItem";
import { useSortable } from "@dnd-kit/react/sortable";
import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
import { pointerIntersection } from "@dnd-kit/collision";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DragDropIcon from "@/app/icons/dndIcon";
import { useTaskStore } from "@/store/taskStore";

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
    const getTaskById = useTaskStore((state) => state.getTaskById);

    const constructParentString = () : string => {
        let parentString : string = "";
        let parent: TaskItem | undefined = task;
        do {
            parent = parent.parentId !== undefined ? getTaskById(parent.parentId): undefined;
            parent !== undefined ? parentString += parent?.title : "";
            parent?.parentId !== undefined ? parentString += " < " : "";
        } while(parent !== undefined)
        
        return parentString;
    }

    return (
        <Card
            ref={ref}
            className={`flex flex-row items-center justify-between gap-4 text-sm font-semibold p-3 rounded-md bg-primary text-background cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
        >
                <p className=" font-bold">{task.title}</p>
                <p className="text-xs font-extrabold">{constructParentString()}</p>
            <div className="w-6">
                <DragDropIcon />
            </div>
        </Card>
    )
}