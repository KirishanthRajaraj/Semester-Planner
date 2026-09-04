import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";

export const isTaskOverdue = (task: TaskItem): boolean => {
    if (!task.date || task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
};

export const isDateOverdue = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
};

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

// status cascade done and todo.
// all children done -> walk up ancestors to set done
// all parents done -> walk down descendants to set done
export const applyStatusCascade = (tasks: TaskItem[], id: string, status: TaskStatus): TaskItem[] => {
    const idsToUpdate = new Set<string>([id]);
    for (const descendant of getDescendants(tasks, id)) {
        idsToUpdate.add(descendant.id);
    }

    let updatedTasks = tasks.map((t) => (idsToUpdate.has(t.id) ? { ...t, status } : t));

    let current = updatedTasks.find((t) => t.id === id);
    while (current && current.parentId !== undefined) {
        const parentId = current.parentId;
        const siblings = getChildren(updatedTasks, parentId);

        let allSiblingsDone = true;
        for (const sibling of siblings) {
            if (sibling.status !== "done") {
                allSiblingsDone = false;
            }
        }

        const parentStatus: TaskStatus = allSiblingsDone ? "done" : "todo";
        updatedTasks = updatedTasks.map((t) => (t.id === parentId ? { ...t, status: parentStatus } : t));
        current = updatedTasks.find((t) => t.id === parentId);
    }

    return updatedTasks;
}

export const getTaskProgress = (tasks: TaskItem[], task: TaskItem): number => {
    const children = getChildren(tasks, task.id);

    //base case
    if (children.length === 0) {
        return task.status === "done" ? 1 : 0;
    }

    let sum = 0;
    for (const child of children) {
        sum += getTaskProgress(tasks, child);
    }

    return sum / children.length;
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

export const insertTask = (tasks: TaskItem[], newTask: TaskItem): TaskItem[] => {
    const parentId = newTask.parentId;
    if (parentId === undefined) return [...tasks, newTask];

    const subtreeIds = new Set([parentId, ...getDescendants(tasks, parentId).map((t) => t.id)]);
    const lastIndex = tasks.findLastIndex((t) => subtreeIds.has(t.id));

    // parent gibt es nicht
    if (lastIndex === -1) return [...tasks, newTask];

    // task hinten anhängen
    return [...tasks.slice(0, lastIndex + 1), newTask, ...tasks.slice(lastIndex + 1)];
};
