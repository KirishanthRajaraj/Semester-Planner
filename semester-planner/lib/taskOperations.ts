import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";

export const isTaskOverdue = (task: TaskItem): boolean =>
    !!task.date && task.date < new Date();

// get direct children of a task
export const getChildren = (tasks: TaskItem[], parentId: string): TaskItem[] =>
    tasks.filter((t) => t.parentId === parentId);

export const getDescendants = (tasks: TaskItem[], parentId: string): TaskItem[] => {
    const children = getChildren(tasks, parentId);
    // base case
    if (children.length === 0) {
        return [];
    }

    // flatmap to return a flat array instead of multiarrays
    return children.flatMap(child => [
        child,
        ...getDescendants(tasks, child.id),
    ]);
}

export const constructParentString = (task: TaskItem): string => {
    const { getTaskById } = useTaskStore.getState();

    let parentString: string = "";
    let parent: TaskItem | undefined = task;
    do {
        parent = parent.parentId !== undefined ? getTaskById(parent.parentId) : undefined;
        parent !== undefined ? parentString += parent?.title : "";
        parent?.parentId !== undefined ? parentString += " < " : "";
    } while (parent !== undefined)

    return parentString;
}

export const parentTasksSet = (tasks: TaskItem[]): Set<string> =>
    new Set(tasks.map((t) => t.parentId).filter((pId): pId is string => pId !== undefined && pId !== null && pId.length > 0))
