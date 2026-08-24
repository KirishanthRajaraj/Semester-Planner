import {
  Column,
  ColumnDef,
} from "@tanstack/react-table"


import { useTaskStore } from "@/store/taskStore";
import { TaskItem } from "@/interfaces/taskItem";
import { constructParentString, getDescendants, isTaskOverdue } from "@/lib/taskOperations";
import { DataTable } from "./ui/datatable";
import { TopTasksDropdown } from "./moduleDropdown";
import { useEffect, useState } from "react";
import { TaskStatusToggle } from "./TaskStatusToggle";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
  const sorted = column.getIsSorted();
  return (
    <Button className={"hover:cursor-pointer !pl-0"} variant="ghost" onClick={() => column.toggleSorting(sorted === "asc")}>
      {label}
      {sorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {sorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
      {!sorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
    </Button>
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
      header: ({ column }) => <SortableHeader column={column} label="Title" />,
      meta: {
        className: "max-w-62",
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => row.original.date?.toLocaleDateString("de-CH") ?? "—",
    },
    {
      id: "parents",
      // ohne accessorFn hat die Spalte keinen Wert zum Vergleichen - sortingFn lief
      // bisher nur auf undefined === undefined, daher keine sichtbare Umsortierung
      accessorFn: (row) => constructParentString(row),
      sortingFn: 'alphanumeric',
      header: ({ column }) => <SortableHeader column={column} label="Parents" />,
      cell: ({ row }) => constructParentString(row.original),
      meta: {
        className: "max-w-62",
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => <TaskStatusToggle task={row.original} className="aria-pressed:bg-transparent" />,
    },
  ]

  return (
    <div className="w-full mx-auto py-10 max-w-2/3">
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