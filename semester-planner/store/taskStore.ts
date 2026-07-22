import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskItem } from "@/interfaces/taskItem";
import { reviveDates } from "@/lib/persistStorage";

interface TaskStore {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
  getTaskById: (id: string) => TaskItem | undefined;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks: TaskItem[]) => set({ tasks }),
      getTaskById: (id: string) => get().tasks.find((t) => t.id === id),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),
    }
  )
);
