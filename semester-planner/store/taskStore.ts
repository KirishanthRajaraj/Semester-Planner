import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { getDescendants } from "@/lib/taskOperations";
import { reviveDates } from "@/lib/persistStorage";

interface TaskStore {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
  getTaskById: (id: string) => TaskItem | undefined;
  setTaskStatusById: (id: string, status: TaskStatus) => void;
  deleteTaskById: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks: TaskItem[]) => set({ tasks }),
      getTaskById: (id: string) => get().tasks.find((t) => t.id === id),
      // marking a task "done" also marks all of its descendants "done"
      setTaskStatusById: (id: string, status: TaskStatus) => {
        const tasks = get().tasks;
        const idsToUpdate = new Set<string>([id]);
        if (status === "done" || status === "todo") {
          for (const descendant of getDescendants(tasks, id)) {
            idsToUpdate.add(descendant.id);
          }
        }
        set({
          tasks: tasks.map((t) => (idsToUpdate.has(t.id) ? { ...t, status } : t)),
        });
      },
      deleteTaskById: (id: string) => set({
        tasks: get().tasks.filter((t) => t.id !== id),
      })
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),
    }
  )
);
