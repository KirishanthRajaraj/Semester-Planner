'use client'
import { useMemo, useState } from "react";

import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { constructParentString, insertTask, parentTasksSet } from "@/lib/taskOperations";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "./ui/combobox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

export default function AddTaskDialog({ open, onOpenChange, targetTitle, date, noDay }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetTitle: string;
    date?: Date;
    noDay: boolean;
}) {
    const tasks = useTaskStore((state) => state.tasks);
    const setTasks = useTaskStore((state) => state.setTasks);
    const bumpBoardRevision = useTaskStore((state) => state.bumpBoardRevision);

    const [title, setTitle] = useState("");
    const [parent, setParent] = useState<TaskItem | null>(null);

    const parentTasks = useMemo(() => {
        const parentIds = parentTasksSet(tasks);
        return tasks.filter((task) => parentIds.has(task.id));
    }, [tasks]);

    const reset = () => {
        setTitle("");
        setParent(null);
    };

    const handleSubmit = () => {
        if (title.trim() === "" || parent === null) return;

        const newTask: TaskItem = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date: date,
            noDay: noDay,
            dateInherited: false,
            status: "todo",
            parentId: parent.id,
            depth: (parent.depth ?? 0) + 1,
        };

        setTasks(insertTask(tasks, newTask));
        bumpBoardRevision();
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) reset();
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New task</DialogTitle>
                    <DialogDescription>
                        Wird in <span className="font-semibold text-foreground">{targetTitle}</span> abgelegt.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <label htmlFor="new-task-title" className="text-sm font-semibold">Title</label>
                    <Input
                        id="new-task-title"
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="e.g. aufgabe 3 lösen"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="new-task-parent" className="text-sm font-semibold">Parent</label>
                    <Combobox<TaskItem>
                        items={parentTasks}
                        value={parent}
                        onValueChange={setParent}
                        itemToStringLabel={(task) => task.title}
                        filter={(task, query) =>
                            `${task.title} ${constructParentString(task)}`
                                .toLowerCase()
                                .includes(query.toLowerCase())
                        }
                    >
                        <ComboboxInput id="new-task-parent" placeholder="Select parent task..." />
                        <ComboboxContent>
                            <ComboboxEmpty>No parent tasks found.</ComboboxEmpty>
                            <ComboboxList>
                                {(task: TaskItem) => (
                                    <ComboboxItem key={task.id} value={task}>
                                        <span className="truncate -ml-6">
                                            <span className="font-semibold">{task.title}</span>
                                            {constructParentString(task) !== "" && (
                                                <span className="text-muted-foreground"> · {constructParentString(task)}</span>
                                            )}
                                        </span>
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>

                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        disabled={title.trim() === "" || parent === null}
                        onClick={handleSubmit}
                    >
                        Add task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
