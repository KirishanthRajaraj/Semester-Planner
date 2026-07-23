import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Circle, CircleDot, CircleCheck } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { isTaskOverdue } from "@/lib/taskOperations";
import { DataTable } from "./ui/datatable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: typeof Circle; className: string }> = {
  todo: { label: "To do", icon: Circle, className: "text-muted-foreground" },
  inprogress: { label: "In progress", icon: CircleDot, className: "text-amber-500" },
  done: { label: "Done", icon: CircleCheck, className: "text-green-500" },
};

function TaskStatusCell({ task }: { task: TaskItem }) {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const status = task.status ?? "todo";
  const current = STATUS_CONFIG[status];
  const CurrentIcon = current.icon;

  const setStatus = (newStatus: TaskStatus) => {
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
  };

  return (
    // fixed size so the badge<->toggle-group crossfade doesn't reflow the row;
    // pointer-events toggled with opacity so the hidden layer isn't clickable
    <div className="group relative flex h-8 w-32 items-center">
      <div className={`absolute flex items-center gap-1.5 text-xs transition-opacity group-hover:opacity-0 ${current.className}`}>
        <CurrentIcon className="size-4" />
        {current.label}
      </div>
      <ToggleGroup
        value={[status]}
        onValueChange={(values) => values[0] && setStatus(values[0] as TaskStatus)}
        className="absolute pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
      >
        {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((key) => {
          const { icon: Icon, label, className } = STATUS_CONFIG[key];
          return (
            <ToggleGroupItem key={key} value={key} aria-label={label} className={className}>
              <Icon className="size-4" />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}

export function TasksTable() {
  const tasks = useTaskStore((state) => state.tasks);
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TaskStatusCell task={row.original} />,
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={tasks}
        getRowClassName={(task) => (isTaskOverdue(task) ? "bg-red-500" : "")}
      />
    </div>
  );
}