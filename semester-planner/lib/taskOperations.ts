import { TaskItem } from "@/interfaces/taskItem";

export const isTaskOverdue = (task: TaskItem): boolean =>
    !!task.date && task.date < new Date();
