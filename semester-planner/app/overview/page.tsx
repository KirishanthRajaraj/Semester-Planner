"use client"
import { BacklogChart, ModuleProgressChart, OverviewCharts } from "@/components/OverviewCharts";
import { TasksTable } from "@/components/TasksTable";

export default function Overview() {
    return (
        <>
            <div className="w-full font-sans flex flex-col flex-1 container p-4">

                <h1 className="text-3xl font-bold mb-12 mt-16">Übersicht</h1>

                <OverviewCharts />

                <div className="flex flex-col lg:flex-row gap-6 w-full mt-6">
                    <div className="flex-1 w-full lg:w-2/3">
                        <TasksTable />
                    </div>
                    <div className="flex-1 lg:mt-10">
                        <ModuleProgressChart />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 w-full mt-6">
                    <div className="w-full lg:w-1/2">
                        <BacklogChart />
                    </div>
                </div>
            </div>
        </>
    );
}
