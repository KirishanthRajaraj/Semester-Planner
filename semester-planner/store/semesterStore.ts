import { create } from "zustand";
import { TaskItem } from "@/interfaces/taskItem";
import { Semester } from "@/interfaces/Semester";

interface SemesterStore {
    semester: Semester;
    setSemester: (semester: Semester) => void;
    weeks: { startDate: Date; endDate: Date }[];
    setWeeks: (weeks: { startDate: Date; endDate: Date }[]) => void;
}

export const useSemesterStore = create<SemesterStore>((set) => ({
    semester: { startDate: new Date(), endDate: new Date() },
    setSemester: (semester) => set({ semester }),
    weeks: [],
    setWeeks: (weeks) => set({ weeks }),
}));
