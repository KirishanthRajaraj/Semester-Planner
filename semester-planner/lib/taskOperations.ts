import { TaskItem } from "@/interfaces/taskItem";

export const isTaskOverdue = (task: TaskItem): boolean =>
    !!task.date && task.date < new Date();

// get direct children of a task
export const getChildren = (tasks: TaskItem[], parentId: string): TaskItem[] =>
    tasks.filter((t) => t.parentId === parentId);
