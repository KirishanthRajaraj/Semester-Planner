import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Semester } from "@/interfaces/Semester";
import { reviveDates } from "@/lib/persistStorage";
import { getWeeks } from "@/lib/semesterOperations";

interface SemesterStore {
    semester: Semester;
    setSemester: (semester: Semester) => void;
    weeks: { startDate: Date; endDate: Date }[];
    setWeeks: (weeks: { startDate: Date; endDate: Date }[]) => void;
}

const initStart = new Date('2026-09-15');
const initEnd = new Date('2027-02-19')

export const useSemesterStore = create<SemesterStore>()(
    persist(
        (set) => ({
            semester: { startDate: initStart, endDate: initEnd },
            // weeks immer neu setzen, bei jedem semesterdaten change, sonst updaten die wochenanzeigen nicht bei dndarea und previewer
            setSemester: (semester) => set({
                semester,
                weeks: getWeeks(semester.startDate, semester.endDate),
            }),
            weeks: getWeeks(initStart, initEnd),
            setWeeks: (weeks) => set({ weeks }),
        }),
        {
            name: "semester-storage",
            storage: createJSONStorage(() => localStorage, { reviver: reviveDates }),

        }
    )
);
