import { describe, expect, it } from "vitest";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { applyStatusCascade, getTaskProgress } from "@/lib/taskOperations";

const getStatus = (tasks: TaskItem[], id: string) => tasks.find((t) => t.id === id)?.status;


describe("getTaskProgress", () => {
    const modul: TaskItem = { id: "modul", title: "modul", status: "todo" };
    /*tasks:
        emulator; todo
            task-b; todo
                b1; todo
                b2; todo
    */
    const tasks: TaskItem[] = [
        modul,
        { id: "emulator", title: "emulator", parentId: "modul", status: "todo" },
        { id: "task-b", title: "task b", parentId: "modul", status: "todo" },
        { id: "b1", title: "b1", parentId: "task-b", status: "todo" },
        { id: "b2", title: "b2", parentId: "task-b", status: "todo" },
    ];

    it("weights a leaf on the first level higher than one further down", () => {
        const firstLevelDone = tasks.map((task) =>
            task.id === "emulator" ? { ...task, status: "done" as TaskStatus } : task
        );
        const secondLevelDone = tasks.map((task) =>
            task.id === "b1" ? { ...task, status: "done" as TaskStatus } : task
        );

        expect(getTaskProgress(firstLevelDone, modul)).toBe(0.5);
        expect(getTaskProgress(secondLevelDone, modul)).toBe(0.25);
    });
});

describe("applyStatusCascade", () => {
    /*
    tasks:
    modul; todo
        task-b; todo
            b1; todo
            b2; done
    */
    const tasks: TaskItem[] = [
        { id: "modul", title: "modul", status: "todo" },
        { id: "task-b", title: "task b", parentId: "modul", status: "todo" },
        { id: "b1", title: "b1", parentId: "task-b", status: "todo" },
        { id: "b2", title: "b2", parentId: "task-b", status: "done" },
    ];

    it("marks every ancestor done once the last open child is done", () => {
        const result = applyStatusCascade(tasks, "b1", "done");

        expect(getStatus(result, "b1")).toBe("done");
        expect(getStatus(result, "task-b")).toBe("done");
        expect(getStatus(result, "modul")).toBe("done");
    });

    it("resets the ancestors when a child becomes open again", () => {
        const allDone = applyStatusCascade(tasks, "b1", "done");
        const result = applyStatusCascade(allDone, "b1", "todo");

        expect(getStatus(result, "b1")).toBe("todo");
        expect(getStatus(result, "task-b")).toBe("todo");
        expect(getStatus(result, "modul")).toBe("todo");
    });
});