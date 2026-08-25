import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { applyStatusCascade } from "@/lib/taskOperations";
import { reviveDates } from "@/lib/persistStorage";

const DEFAULT_TASKS: TaskItem[] = [

  { id: "seed-example-warning", title: "|=====Example Plan : remove=====|", depth: 0, status: "todo" },
  // programmieren 1
  { id: "seed-prog1", title: "programmieren 1", depth: 0, status: "todo" },
  { id: "seed-prog1-w1", title: "w1 material week 1", depth: 1, parentId: "seed-prog1", status: "done" },
  { id: "seed-prog1-w1-theorie", title: "theorie lesen teil 1 25 Aug 2026", depth: 2, parentId: "seed-prog1-w1", status: "done" },
  { id: "seed-prog1-w1-uebung", title: "übung 1 lösen 26 Aug 2026", depth: 2, parentId: "seed-prog1-w1", status: "done", duration: 60 },
  { id: "seed-prog1-algorithmen", title: "algorithmen week 3", depth: 1, parentId: "seed-prog1", status: "todo" },
  { id: "seed-prog1-algo-quicksort", title: "quicksort implementieren week 2", depth: 2, parentId: "seed-prog1-algorithmen", status: "done", duration: 120 },
  { id: "seed-prog1-algo-theorie", title: "theorie repetieren week 3", depth: 2, parentId: "seed-prog1-algorithmen", status: "done", duration: 240 },
  { id: "seed-prog1-algo-aufgabe1", title: "aufgabe 1 lösen 03 Sept 2026", depth: 2, parentId: "seed-prog1-algorithmen", status: "todo" },
  { id: "seed-prog1-algo-aufgabe1-testfaelle", title: "testfälle schreiben 18 Aug 2026", depth: 3, parentId: "seed-prog1-algo-aufgabe1", status: "todo" },
  { id: "seed-prog1-algo-aufgabe1-edgecases", title: "edge cases prüfen week 3", depth: 3, parentId: "seed-prog1-algo-aufgabe1", status: "done", duration: 60 },
  { id: "seed-prog1-algo-towers", title: "towers of hanoi week 9", depth: 2, parentId: "seed-prog1-algorithmen", status: "todo" },
  { id: "seed-prog1-algo-knapsack", title: "knapsack problem week 10", depth: 2, parentId: "seed-prog1-algorithmen", status: "todo", duration: 180 },
  { id: "seed-prog1-projekt", title: "projekt abschluss week 10", depth: 1, parentId: "seed-prog1", status: "todo" },
  { id: "seed-prog1-projekt-abgabe", title: "abgabe vorbereiten week 10", depth: 2, parentId: "seed-prog1-projekt", status: "todo" },
  { id: "seed-prog1-projekt-codereview", title: "code review week 11", depth: 2, parentId: "seed-prog1-projekt", status: "todo" },
  { id: "seed-prog1-projekt-codereview-feedback", title: "feedback einarbeiten week 11", depth: 3, parentId: "seed-prog1-projekt-codereview", status: "todo", duration: 60 },

  // mathe
  { id: "seed-mathe", title: "mathe", depth: 0, status: "todo" },
  { id: "seed-mathe-grundlagen", title: "grundlagen week 1", depth: 1, parentId: "seed-mathe", status: "done" },
  { id: "seed-mathe-grundlagen-mengenlehre", title: "mengenlehre repetieren", depth: 2, parentId: "seed-mathe-grundlagen", status: "done" },
  { id: "seed-mathe-grundlagen-folgen", title: "folgen und reihen 31 Aug 2026", depth: 2, parentId: "seed-mathe-grundlagen", status: "done", duration: 60 },
  { id: "seed-mathe-diff", title: "differentialrechnung week 4", depth: 1, parentId: "seed-mathe", status: "todo" },
  { id: "seed-mathe-diff-ableitungsregeln", title: "ableitungsregeln üben week 4", depth: 2, parentId: "seed-mathe-diff", status: "done" },
  { id: "seed-mathe-diff-kettenregel", title: "kettenregel anwenden week 5", depth: 2, parentId: "seed-mathe-diff", status: "todo", duration: 120 },
  { id: "seed-mathe-integral", title: "integralrechnung week 8", depth: 1, parentId: "seed-mathe", status: "todo" },
  { id: "seed-mathe-integral-partielle", title: "partielle integration week 8", depth: 2, parentId: "seed-mathe-integral", status: "done" },
  { id: "seed-mathe-integral-substitution", title: "substitution üben 20 Oct 2026", depth: 2, parentId: "seed-mathe-integral", status: "todo" },
  { id: "seed-mathe-pruefung", title: "prüfungsvorbereitung week 12", depth: 1, parentId: "seed-mathe", status: "todo" },
  { id: "seed-mathe-pruefung-alte", title: "alte prüfungen durchgehen week 12", depth: 2, parentId: "seed-mathe-pruefung", status: "todo" },
  { id: "seed-mathe-pruefung-alte-p1", title: "prüfung 1 ohne timer", depth: 3, parentId: "seed-mathe-pruefung-alte", status: "todo" },
  { id: "seed-mathe-pruefung-alte-p2", title: "prüfung 2 aufgaben mit timer", depth: 3, parentId: "seed-mathe-pruefung-alte", status: "todo" },
  { id: "seed-mathe-pruefung-alte-loesungen", title: "lösungen vergleichen week 12", depth: 3, parentId: "seed-mathe-pruefung-alte", status: "todo", duration: 60 },

  // informationssysteme
  { id: "seed-insy", title: "informationssysteme", depth: 0, status: "todo" },
  { id: "seed-insy-systemanalyse", title: "systemanalyse week 2", depth: 1, parentId: "seed-insy", status: "todo" },
  { id: "seed-insy-systemanalyse-anforderungen", title: "anforderungen erheben week 2", depth: 2, parentId: "seed-insy-systemanalyse", status: "todo" },
  { id: "seed-insy-systemanalyse-usecases", title: "use cases modellieren week 2", depth: 2, parentId: "seed-insy-systemanalyse", status: "done", duration: 60 },
  { id: "seed-insy-er", title: "er modellierung week 3", depth: 1, parentId: "seed-insy", status: "todo" },
  { id: "seed-insy-er-entitaeten", title: "entitäten definieren 04 Sept 2026", depth: 2, parentId: "seed-insy-er", status: "todo" },
  { id: "seed-insy-er-beziehungen", title: "beziehungen modellieren week 3", depth: 2, parentId: "seed-insy-er", status: "todo", duration: 120 },
  { id: "seed-insy-er-beziehungen-kardinalitaeten", title: "kardinalitäten prüfen 11 Aug 2026", depth: 3, parentId: "seed-insy-er-beziehungen", status: "todo" },
  { id: "seed-insy-er-beziehungen-normalform", title: "normalform anwenden week 3", depth: 3, parentId: "seed-insy-er-beziehungen", status: "todo", duration: 60 },
  { id: "seed-insy-relmodell", title: "relationales modell week 7", depth: 1, parentId: "seed-insy", status: "todo" },
  { id: "seed-insy-relmodell-tabellen", title: "tabellen ableiten week 7", depth: 2, parentId: "seed-insy-relmodell", status: "done" },
  { id: "seed-insy-sql", title: "sql grundlagen week 10", depth: 1, parentId: "seed-insy", status: "todo" },
  { id: "seed-insy-sql-select", title: "select abfragen üben week 10", depth: 2, parentId: "seed-insy-sql", status: "todo" },
  { id: "seed-insy-sql-joins", title: "joins üben 15 Nov 2026", depth: 2, parentId: "seed-insy-sql", status: "todo", duration: 120 },
  { id: "seed-insy-abschluss", title: "abschlussprojekt week 13", depth: 1, parentId: "seed-insy", status: "todo" },
  { id: "seed-insy-abschluss-datenmodell", title: "datenmodell finalisieren week 13", depth: 2, parentId: "seed-insy-abschluss", status: "todo" },
  { id: "seed-insy-abschluss-implementierung", title: "implementierung week 13", depth: 2, parentId: "seed-insy-abschluss", status: "todo", duration: 180 },

  // swef
  { id: "seed-swef", title: "swef", depth: 0, status: "todo" },
  { id: "seed-swef-anforderungsanalyse", title: "anforderungsanalyse week 2", depth: 1, parentId: "seed-swef", status: "todo" },
  { id: "seed-swef-anforderungsanalyse-usecases", title: "use cases sammeln 01 Sept 2026", depth: 2, parentId: "seed-swef-anforderungsanalyse", status: "todo" },
  { id: "seed-swef-anforderungsanalyse-lastenheft", title: "lastenheft schreiben week 2", depth: 2, parentId: "seed-swef-anforderungsanalyse", status: "todo", duration: 120 },
  { id: "seed-swef-architektur", title: "architektur entwerfen week 4", depth: 1, parentId: "seed-swef", status: "todo" },
  { id: "seed-swef-architektur-uml", title: "uml diagramme erstellen week 4", depth: 2, parentId: "seed-swef-architektur", status: "done" },
  { id: "seed-swef-implementierung", title: "implementierung week 8", depth: 1, parentId: "seed-swef", status: "todo" },
  { id: "seed-swef-implementierung-feature1", title: "feature 1 umsetzen week 8", depth: 2, parentId: "seed-swef-implementierung", status: "todo" },
  { id: "seed-swef-implementierung-feature2", title: "feature 2 umsetzen week 9", depth: 2, parentId: "seed-swef-implementierung", status: "todo", duration: 240 },
  { id: "seed-swef-implementierung-feature2-unittests", title: "unit tests schreiben 01 Nov 2026", depth: 3, parentId: "seed-swef-implementierung-feature2", status: "todo" },
  { id: "seed-swef-implementierung-feature2-integrationtests", title: "integration tests week 9", depth: 3, parentId: "seed-swef-implementierung-feature2", status: "todo", duration: 120 },
  { id: "seed-swef-dokumentation", title: "dokumentation week 11", depth: 1, parentId: "seed-swef", status: "todo" },
  { id: "seed-swef-dokumentation-readme", title: "readme schreiben week 11", depth: 2, parentId: "seed-swef-dokumentation", status: "todo" },
  { id: "seed-swef-abgabe", title: "abgabe week 14", depth: 1, parentId: "seed-swef", status: "todo" },
  { id: "seed-swef-abgabe-praesentation", title: "präsentation vorbereiten week 14", depth: 2, parentId: "seed-swef-abgabe", status: "todo" },
  { id: "seed-swef-abgabe-codefreeze", title: "code freeze 20 Dec 2026", depth: 2, parentId: "seed-swef-abgabe", status: "todo" },
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
      setTaskStatusById: (id: string, status: TaskStatus) => {
        set({
          tasks: applyStatusCascade(get().tasks, id, status),
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
