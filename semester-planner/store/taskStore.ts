import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { getDescendants } from "@/lib/taskOperations";
import { reviveDates } from "@/lib/persistStorage";



const DEFAULT_TASKS: TaskItem[] = [
  { id: "seed-modul-a", title: "modul a", depth: 0, status: "todo" },
  { id: "seed-emulator", title: "emulator installieren next week", depth: 1, parentId: "seed-modul-a", status: "todo", duration: 60 },
  { id: "seed-task-b", title: "task b week 4", depth: 1, parentId: "seed-modul-a", status: "todo" },
  { id: "seed-task-b-sub-a", title: "subtask a", depth: 2, parentId: "seed-task-b", status: "done" },
  { id: "seed-task-b-sub-b", title: "subtask b", depth: 2, parentId: "seed-task-b", status: "todo", duration: 120 },
  { id: "seed-task-c", title: "task c", depth: 1, parentId: "seed-modul-a", status: "todo" },
  { id: "seed-task-c-sub-a", title: "subtask a week 5", depth: 2, parentId: "seed-task-c", status: "todo" },
  { id: "seed-task-c-sub-b", title: "subtask b", depth: 2, parentId: "seed-task-c", status: "done" },
  { id: "seed-task-c-sub-c", title: "subtask c", depth: 2, parentId: "seed-task-c", status: "todo", duration: 180 },
  { id: "seed-prog1", title: "prog1", depth: 0, status: "todo" },
  { id: "seed-material", title: "material aufbaumodul überfliegen today", depth: 1, parentId: "seed-prog1", status: "done", duration: 240 },
  { id: "seed-w1", title: "w1", depth: 1, parentId: "seed-prog1", status: "todo" },
  { id: "seed-w1-theorie", title: "theorie lesen teil 1 next thursday", depth: 2, parentId: "seed-w1", status: "todo" },
  { id: "seed-w2", title: "w2 week 2", depth: 1, parentId: "seed-prog1", status: "todo", duration: 300 },
  { id: "seed-w2-theorie", title: "theorie lesen teil 2", depth: 2, parentId: "seed-w2", status: "todo" },
  { id: "seed-w2-rek1", title: "rekursionsaufgabe 1 lösen tomorrow", depth: 2, parentId: "seed-w2", status: "todo" },
  { id: "seed-w2-rek2", title: "rekursionsaufgabe 2 lösen", depth: 2, parentId: "seed-w2", status: "todo" },
  { id: "seed-mathe", title: "mathe", depth: 0, status: "todo" },
  { id: "seed-mathe-t1", title: "theorie teil 1", depth: 1, parentId: "seed-mathe", status: "done", duration: 30 },
  { id: "seed-al1", title: "aufgaben lösen 1 week 2", depth: 1, parentId: "seed-mathe", status: "todo" },
  { id: "seed-al1-rechenregeln", title: "rechenregeln repetieren & üben oct 12", depth: 2, parentId: "seed-al1", status: "todo", duration: 120 },
  { id: "seed-al1-aufgabe", title: "aufgabe lösen", depth: 2, parentId: "seed-al1", status: "todo" },
  { id: "seed-mathe-t2", title: "theorie teil 2", depth: 1, parentId: "seed-mathe", status: "todo" },
  { id: "seed-al2", title: "aufgaben lösen 2 week 7", depth: 1, parentId: "seed-mathe", status: "todo", duration: 60 },
];

interface TaskStore {
  tasks: TaskItem[];
  // wird nur von previewer mutationen hochgezählt (nicht vom textplaner)
  boardRevision: number;
  bumpBoardRevision: () => void;
  setTasks: (tasks: TaskItem[]) => void;
  getTaskById: (id: string) => TaskItem | undefined;
  setTaskStatusById: (id: string, status: TaskStatus) => void;
  deleteTaskById: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: DEFAULT_TASKS,
      boardRevision: 0,
      // simple counter, to trigger textareaPlanner.tsx for changes
      bumpBoardRevision: () => set({ boardRevision: get().boardRevision + 1 }),
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
          boardRevision: get().boardRevision + 1,
        });
      },
      deleteTaskById: (id: string) => set({
        tasks: get().tasks.filter((t) => t.id !== id),
        boardRevision: get().boardRevision + 1,
      })
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),
      // boardRevision nach page reload zurücksetzen
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
