"use client"
import { TasksTable } from "@/components/TasksTable";
import { Progress } from "@/components/ui/progress";
import { getTaskProgress } from "@/lib/taskOperations";
import { useTaskStore } from "@/store/taskStore";


export default function Overview() {

    const tasks = useTaskStore((state) => state.tasks);
    const topTasks = tasks.filter((task) => task.parentId === undefined);

    return (
        <>
            <div className="w-full font-sans flex flex-col flex-1 container p-4">

                <h1 className="text-3xl font-bold mb-12 mt-16">Übersicht</h1>

                <div className="flex flex-col md:flex-row gap-12 w-full">
                    <TasksTable />

                    {(topTasks.length > 0) &&
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold mb-4 mt-16">Progress</h2>
                            {topTasks.map((topTask) => {
                                return (
                                    <div key={topTask.id}>
                                        <p className="font-bold mb-2">{topTask.title}</p>
                                        <Progress value={getTaskProgress(tasks, topTask) * 100} className="w-[80%]" />
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>
        </>
    );
}