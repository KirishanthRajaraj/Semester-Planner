import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Semester } from "@/interfaces/Semester";
import { reviveDates } from "@/lib/persistStorage";

interface SemesterStore {
    semester: Semester;
    setSemester: (semester: Semester) => void;
    weeks: { startDate: Date; endDate: Date }[];
    setWeeks: (weeks: { startDate: Date; endDate: Date }[]) => void;
}

export const useSemesterStore = create<SemesterStore>()(
    persist(
        (set) => ({
            semester: { startDate: new Date(), endDate: new Date() },
            setSemester: (semester) => set({ semester }),
            weeks: [],
            setWeeks: (weeks) => set({ weeks }),
        }),
        {
            name: "semester-storage",
            storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),
        }
    )
);
