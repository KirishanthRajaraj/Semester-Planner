import { TaskItem } from "@/interfaces/taskItem";
import { Card } from "./ui/card";
import { useTaskStore } from "@/store/taskStore";
import { constructParentString, getDescendants, isTaskOverdue } from "@/lib/taskOperations";
import { X, Lightbulb } from 'lucide-react';
import { useEffect } from "react";
import { TaskStatusToggle } from "./TaskStatusToggle";
import { Toggle } from "./ui/toggle";
import { useDraggable } from "@dnd-kit/react";

export default function DraggableTask({ task, index, group, dimmed, focused, onToggleFocus, selected, selectionSize, onToggleSelect }: {
    task: TaskItem; index: number; group: string;
    dimmed?: boolean; focused?: boolean;
    onToggleFocus: (task: TaskItem) => void;
    selected?: boolean; selectionSize?: number;
    onToggleSelect: (task: TaskItem) => void;
}) {
    const deleteTaskById = useTaskStore((state) => state.deleteTaskById);
    const tasks = useTaskStore((state) => state.tasks);

    const { ref: subtreeRef, isDragging: isSubtreeDragging } = useDraggable({
        id: `subtree-${task.id}`,
        type: 'item',
    });

    const subtreeCount = task.parentId !== undefined ? getDescendants(tasks, task.parentId).length : 1;
    const dragGroupSize = selected && selectionSize ? selectionSize : isSubtreeDragging ? subtreeCount : 1;

    const { ref, isDragging } = useDraggable({
        id: task.id,
        type: 'item',
        disabled: dimmed,
    });

    return (
        <Card
            ref={ref}
            onClick={(e) => {
                if (e.shiftKey) {
                    e.stopPropagation();
                    onToggleSelect(task);
                }
            }}
            className={`group duration-200 transition-colors truncate w-full ${task.status === 'done' ? 'bg-green-500' : 'bg-primary'}
             gap-0.5 ${task.parentId !== undefined ? '!pt-5' : ''} 
             relative overflow-visible font-semibold p-3 rounded-lg text-background cursor-grab active:cursor-grabbing
             ${isDragging ? "opacity-50" : ""} ${dimmed ? "opacity-30 pointer-events-none" : ""} 
             ${selected ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""}
             ${isTaskOverdue(task) ? 'bg-red-500' : ''}`
            }
        >
            {(isDragging) && dragGroupSize > 1 && (
                <span className="absolute -top-2 -right-2 z-20 bg-background text-primary text-xs font-bold rounded-full px-1.5 py-0.5">
                    +{dragGroupSize - 1}
                </span>
            )}

            {task.parentId &&
                <div
                    ref={subtreeRef}
                    className={`absolute text-xs -left-1 -top-3 text-primary font-bold bg-background rounded-md px-2 py-1 hover:z-20 max-w-32 overflow-hidden whitespace-nowrap
  text-ellipsis duration-200 transition hover:scale-125 hover:max-w-40 ${isSubtreeDragging ? 'max-w-40 whitespace-normal !overflow-visible z-20' : ''} hover:whitespace-normal`}>
                    {(isSubtreeDragging) && dragGroupSize > 1 && (
                        <span className="absolute -top-2.5 -right-2.5 bg-primary text-background border-background border-4 text-xs font-bold rounded-full px-1.5 py-0.5">
                            +{dragGroupSize - 1}
                        </span>
                    )}
                    <span>{constructParentString(task)}</span>

                </div>}

            <Toggle
                aria-label="Toggle focus"
                pressed={focused}
                onPressedChange={() => onToggleFocus(task)}
                className={`
                    transition-all duration-200
                    absolute -left-4 -bottom-4 size-8 z-10
                    hover:!scale-120
                    scale-0 group-hover:scale-100 ${focused ? "!scale-100" : ""}
                    cursor-pointer
                    bg-primary/50 aria-pressed:bg-primary
                    rounded-full border-6 border-background p-0.5
                `}
            >
                <Lightbulb className="!ring-0 !w-full !h-full !p-0" />
            </Toggle>

            <div className="w-full flex flex-row items-center gap-2">
                <TaskStatusToggle task={task} className="rounded-full !p-0 -ml-0.5 scale-0 duration-200 transition-all min-w-6 max-h-6 w-6 absolute group-hover:scale-80 hover:scale-100 !bg-muted/30 hover:bg-muted/70 " classNameIcons="!ring-0 border-3 !w-full !h-full !p-0"></TaskStatusToggle>
                <p className="text-sm font-bold truncate group-hover:ml-7 duration-200">{task.title}</p>
                {task.duration && <p className="text-xs font-extrabold bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5">{task.duration !== undefined ? `${task.duration / 60}h` : ""}</p>}
            </div>

            <div className="w-6 duration-200">
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