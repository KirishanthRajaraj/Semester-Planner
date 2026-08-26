import { TaskItem } from "@/interfaces/taskItem";
import { getChildren, getDescendants, getTaskProgress, isTaskOverdue } from "@/lib/taskOperations";

export const getLeaves = (tasks: TaskItem[]): TaskItem[] =>
    tasks.filter((task) => getChildren(tasks, task.id).length === 0);

export const getStatusCounts = (tasks: TaskItem[]) => {
    const leaves = getLeaves(tasks);

    let done = 0;
    let overdue = 0;
    let open = 0;

    for (const leaf of leaves) {
        if (leaf.status === "done") {
            done++;
        } else if (isTaskOverdue(leaf)) {
            overdue++;
        } else {
            open++;
        }
    }

    return { done, overdue, open, total: leaves.length };
}

export const getUpcomingTasks = (tasks: TaskItem[], days: number): TaskItem[] => {
    const until = new Date();
    until.setHours(0, 0, 0, 0);
    until.setDate(until.getDate() + days);

    const upcoming: TaskItem[] = [];

    for (const leaf of getLeaves(tasks)) {
        if (leaf.status === "done") continue;
        if (!leaf.date) continue;
        if (leaf.date > until) continue;
        upcoming.push(leaf);
    }

    upcoming.sort((a, b) => a.date!.getTime() - b.date!.getTime());
    return upcoming;
}

export const getBacklogPerModule = (tasks: TaskItem[], topTasks: TaskItem[]) => {
    return topTasks.map((topTask) => {
        const leaves = getDescendants(tasks, topTask.id).filter(
            (task) => getChildren(tasks, task.id).length === 0
        );

        let done = 0;
        let overdue = 0;
        let open = 0;

        for (const leaf of leaves) {
            if (leaf.status === "done") {
                done++;
            } else if (isTaskOverdue(leaf)) {
                overdue++;
            } else {
                open++;
            }
        }

        return { module: topTask.title, done, overdue, open };
    });
}

export const getOverallProgress = (tasks: TaskItem[], topTasks: TaskItem[]): number => {
    if (topTasks.length === 0) return 0;

    let sum = 0;
    for (const topTask of topTasks) {
        sum += getTaskProgress(tasks, topTask);
    }

    return sum / topTasks.length;
}

export const getCompletedBlocks = (tasks: TaskItem[]) => {
    const parents = tasks.filter((task) => getChildren(tasks, task.id).length > 0);

    let done = 0;
    for (const parent of parents) {
        const leaves = getDescendants(tasks, parent.id).filter(
            (task) => getChildren(tasks, task.id).length === 0
        );

        if (leaves.length > 0 && leaves.every((leaf) => leaf.status === "done")) {
            done++;
        }
    }

    return { done, total: parents.length };
}

export const getModuleTaskCounts = (tasks: TaskItem[], topTask: TaskItem) => {
    const leaves = getDescendants(tasks, topTask.id).filter(
        (task) => getChildren(tasks, task.id).length === 0
    );

    let done = 0;
    for (const leaf of leaves) {
        if (leaf.status === "done") {
            done++;
        }
    }

    return { done, total: leaves.length };
}


