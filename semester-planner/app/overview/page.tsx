"use client"
import { TasksTable } from "@/components/TasksTable";
import { Progress } from "@/components/ui/progress";
import { TaskItem } from "@/interfaces/taskItem";
import { getChildren } from "@/lib/taskOperations";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useState } from "react";


export default function Overview() {

    const tasks = useTaskStore((state) => state.tasks);
    const [tasksProgress, setTaskProgress] = useState<{ task: TaskItem, progress: number }[]>([]);
    let topTasks = tasks.filter((task) => task.parentId == undefined);
    let amountDone: number;
    let amountTop: number;
    let tempPercentage: number = 0;
    let fraction = 1;

    useEffect(() => {
        // getprogress function only appends, so the array needs to be cleared before function recall
        setTaskProgress([]);
        getProgressOfAllTopTasks(topTasks);
    }, [tasks]);

    useEffect(() => {
        // console.log(tasksProgress)
    }, [tasksProgress]);

    const getProgressOfAllTopTasks = (topTasks: TaskItem[]) => {
        topTasks.forEach((topTask) => {
            let topTChildren = getChildren(tasks, topTask.id);
            if (topTChildren.length > 0) {
                amountDone = topTChildren.filter((task) => task.status === "done").length;
                amountTop = topTChildren.length;
                //remember previous fraction to handle siblings
                const tempFraction = fraction;
                // condition to avoid accounting lvl1 siblings to progress (nur progress von einem Modul, nicht allen)
                if (topTask.depth != 0) {
                    fraction = fraction * (1 / topTasks.length);
                }
                tempPercentage += fraction * (amountDone / amountTop);

                getProgressOfAllTopTasks(topTChildren);
                fraction = tempFraction;
                //check if we reached level 1 task items
                if (topTask.parentId == undefined) {
                    // weird react state setting timing bug, do not remove
                    const progress = tempPercentage;
                    setTaskProgress(prev => [...prev, { task: topTask, progress: progress }])
                    tempPercentage = 0;
                    fraction = 1;
                }
            } else {
                // base condition:
                return;
            }
        });
    }

    return (
        <>
            <div className="w-full font-sans flex flex-col flex-1 justify-center">

                <h1 className="text-3xl font-bold mb-12 mt-16">Übersicht</h1>

                <div className="flex gap-12 w-full">
                    <TasksTable />

                    {(tasksProgress.length > 0) &&
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold mb-4 mt-16">Progress</h2>
                            {tasksProgress.map((task) => {
                                return (
                                    <div key={task.task.id}>
                                        <p className="font-bold mb-2">{task.task.title}</p>
                                        <Progress value={(task.progress) * 100} className="w-[40%]" />
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