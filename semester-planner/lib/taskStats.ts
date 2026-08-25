import { TaskItem } from "@/interfaces/taskItem";
import { getChildren, getDescendants, isTaskOverdue } from "@/lib/taskOperations";

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

export const getTasksPerWeek = (tasks: TaskItem[], weeks: { startDate: Date; endDate: Date }[]) => {
    const leaves = getLeaves(tasks);

    return weeks.map((week, index) => {
        let done = 0;
        let open = 0;

        for (const leaf of leaves) {
            if (!leaf.date) continue;
            if (leaf.date < week.startDate || leaf.date > week.endDate) continue;
            if (leaf.status === "done") {
                done++;
            } else {
                open++;
            }
        }

        return { week: `${index + 1}`, done, open };
    });
}

export const getTasksPerModule = (tasks: TaskItem[], topTasks: TaskItem[]) => {
    return topTasks.map((topTask) => {
        const leaves = getDescendants(tasks, topTask.id).filter(
            (task) => getChildren(tasks, task.id).length === 0
        );

        let done = 0;
        let open = 0;

        for (const leaf of leaves) {
            if (leaf.status === "done") {
                done++;
            } else {
                open++;
            }
        }

        return { module: topTask.title, done, open };
    });
}

export const getDurationPerModule = (tasks: TaskItem[], topTasks: TaskItem[]) => {
    return topTasks.map((topTask) => {
        const descendants = getDescendants(tasks, topTask.id);

        let minutes = 0;
        for (const task of descendants) {
            minutes += task.duration ?? 0;
        }

        return { module: topTask.title, hours: minutes / 60 };
    });
}

export const getDurationCoverage = (tasks: TaskItem[]) => {
    const leaves = getLeaves(tasks);

    let withDuration = 0;
    for (const leaf of leaves) {
        if (leaf.duration) {
            withDuration++;
        }
    }

    return { withDuration, total: leaves.length };
}
