import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { Circle, CircleCheck } from "lucide-react";
import { Toggle } from "./ui/toggle";

export function TaskStatusToggle({ task, className, classNameIcons }: { task: TaskItem, className?: string, classNameIcons?: string }) {
  const setStatus = useTaskStore((state) => state.setTaskStatusById);
  const status = task.status ?? "todo";

  return (
      <Toggle
        aria-label="Toggle status"
        pressed={status == "done"}
        onPressedChange={(pressed) => setStatus(task.id, pressed ? "done" : "todo")}
        className={`hover:bg-muted hover:cursor-pointer ${className}`}>
        <Circle className={`group-aria-pressed/toggle:hidden ${classNameIcons}`} />
        <CircleCheck className={`group-aria-pressed/toggle:block hidden ${classNameIcons}`} />
      </Toggle>
  );
}