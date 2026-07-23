"use client"
import { TasksTable } from "@/components/TasksTable";
import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";


export default function Overview() {

    const tasks = useTaskStore((state) => state.tasks);

    return (
        <>
            <h1 className="text-3xl font-bold mb-12 mt-16">Übersicht</h1>
            <TasksTable />
        </>
    );
}