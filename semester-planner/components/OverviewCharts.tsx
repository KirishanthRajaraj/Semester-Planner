"use client"
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useTaskStore } from "@/store/taskStore";
import { constructParentString, getTaskProgress, isTaskOverdue } from "@/lib/taskOperations";
import { getBacklogPerModule, getModuleTaskCounts, getStatusCounts, getUpcomingTasks } from "@/lib/taskStats";

const statusConfig = {
    done: { label: "Erledigt", color: "var(--color-green-500)" },
    open: { label: "Offen", color: "var(--primary)" },
    overdue: { label: "Überfällig", color: "var(--color-red-500)" },
};


export function OverviewCharts() {
    const tasks = useTaskStore((state) => state.tasks);

    const status = getStatusCounts(tasks);
    const upcoming = getUpcomingTasks(tasks, 14);

    const statusData = [
        { status: "done", count: status.done, fill: "var(--color-done)" },
        { status: "open", count: status.open, fill: "var(--color-open)" },
        { status: "overdue", count: status.overdue, fill: "var(--color-overdue)" },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={statusConfig} className="mx-auto aspect-square min-h-64 max-h-64">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                            <Pie data={statusData} dataKey="count" nameKey="status" innerRadius="55%" outerRadius="80%">
                                {/*Viewbox nötig für innerhalb svg placement*/}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 16}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {status.total}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 8}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Tasks
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Nächste zwei Wochen</CardTitle>
                    <CardDescription>
                        {upcoming.length} offene Aufgaben
                        {status.overdue > 0 && <span className="text-red-500"> · {status.overdue} überfällig</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                    {upcoming.length === 0 && (
                        <p className="text-sm text-muted-foreground">Keine offenen Aufgaben in den nächsten zwei Wochen.</p>
                    )}
                    {upcoming.map((task) => {
                        const overdue = isTaskOverdue(task);

                        return (
                            <div
                                key={task.id}
                                className={`flex items-center justify-between gap-3 rounded-md border-l-1 py-1.5 pl-2.5 pr-2 text-sm
                                    ${overdue ? "border-red-500 bg-red-500/10" : "border-primary bg-muted/40"}`}
                            >
                                <div className="min-w-0">
                                    <p className="text-[11px] leading-none text-muted-foreground truncate">
                                        {constructParentString(task)}
                                    </p>
                                    <p className="font-medium truncate">{task.title}</p>
                                </div>
                                <span
                                    className={`shrink-0 text-xs ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                                >
                                    {task.date?.toLocaleDateString("de-CH")}
                                </span>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}

export function ModuleProgressChart() {
    const tasks = useTaskStore((state) => state.tasks);
    const topTasks = tasks.filter(
        (task) => task.parentId === undefined && tasks.some((t) => t.parentId === task.id)
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Fortschritt pro Modul</CardTitle>
                <CardDescription>Gewichtet nach Tiefe des Tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {topTasks.map((topTask) => {
                    const counts = getModuleTaskCounts(tasks, topTask);

                    return (
                        <div key={topTask.id}>
                            <div className="flex items-baseline justify-between mb-2">
                                <p className="font-bold">{topTask.title}</p>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {counts.done}/{counts.total} · {Math.round(getTaskProgress(tasks, topTask) * 100)}%
                                </span>
                            </div>
                            <Progress className="duration-200" value={getTaskProgress(tasks, topTask) * 100} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export function BacklogChart() {
    const tasks = useTaskStore((state) => state.tasks);
    const topTasks = tasks.filter(
        (task) => task.parentId === undefined && tasks.some((t) => t.parentId === task.id)
    );

    const perModule = getBacklogPerModule(tasks, topTasks);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Rückstand pro Modul</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={statusConfig} className="max-h-72 w-full">
                    <BarChart data={perModule} layout="vertical" accessibilityLayer>
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="module" width={110} tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="done" stackId="a" fill="var(--color-done)" radius={[8, 0, 0, 8]} />
                        <Bar dataKey="open" stackId="a" fill="var(--color-open)" />
                        <Bar dataKey="overdue" stackId="a" fill="var(--color-overdue)" radius={[0, 8, 8, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
