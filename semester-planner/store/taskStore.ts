import { create } from "zustand";
import { TaskItem } from "@/interfaces/taskItem";

interface TaskStore {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
