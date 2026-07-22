import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskItem } from "@/interfaces/taskItem";
import { reviveDates } from "@/lib/persistStorage";

interface TaskStore {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks: TaskItem[]) => set({ tasks }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),
    }
  )
);
