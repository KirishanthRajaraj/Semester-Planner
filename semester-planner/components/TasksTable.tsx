import {
  ColumnDef,
} from "@tanstack/react-table"


import { Circle, CircleDot, CircleCheck } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { constructParentString, getDescendants, isTaskOverdue } from "@/lib/taskOperations";
import { DataTable } from "./ui/datatable";
import { Toggle } from "./ui/toggle";
import { DropdownMenu } from "./ui/dropdown-menu";
import { TopTasksDropdown } from "./moduleDropdown";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function TaskStatusCell({ task }: { task: TaskItem }) {
  const setStatus = useTaskStore((state) => state.setTaskStatusById);
  const status = task.status ?? "todo";

  return (
    <div className="group relative flex h-8 w-32 items-center ">
      <Toggle
        aria-label="Toggle status"
        pressed={status == "done"}
        onPressedChange={(pressed) => setStatus(task.id, pressed ? "done" : "todo")}
        className="aria-pressed:bg-transparent hover:!bg-muted size-10 hover:cursor-pointer"
      >
        <Circle className="group-aria-pressed/toggle:hidden size-4" />
        <CircleCheck className="group-aria-pressed/toggle:block hidden size-4" />
      </Toggle>
    </div>
  );
}

export function TasksTable() {

  const tasks = useTaskStore((state) => state.tasks);
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>(tasks);

  useEffect(() => {
    filterTasks(moduleFilter);
  }, [moduleFilter, tasks]);

  const filterTasks = (moduleFilter: string) => {
    if (!moduleFilter) return tasks;
    if (moduleFilter === "All") {
      setFilteredTasks(tasks);
      return;
    }
    const root = tasks.find((t) => t.id === moduleFilter);
    let filteredTasks = root ? [root, ...getDescendants(tasks, root.id)] : tasks;
    setFilteredTasks(filteredTasks);
  }

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.original.date?.toLocaleDateString("de-CH") ?? "—",
    },
    {
      id: "parents",
      header: "Parents",
      cell: ({ row }) => constructParentString(row.original),

    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TaskStatusCell task={row.original} />,
    },
  ]

  return (
    <div className="w-full mx-auto py-10">
      <TopTasksDropdown className="mb-4" setModuleFilter={setModuleFilter} />

      <DataTable
        columns={columns}
        data={filteredTasks}
        getRowClassName={(task) => {
          if (task.status == "done") {
            return "bg-green-700/50"
          }
          if (isTaskOverdue(task)) {
            return isTaskOverdue(task) ? "bg-red-500/60" : ""
          }
          // tasks due next 7 days
          if (task.date && task.date?.getDate() < (new Date().getDate() + 7)) {
            return "bg-yellow-400/60"
          }
          return "";
        }}
      />
    </div>
  );
}