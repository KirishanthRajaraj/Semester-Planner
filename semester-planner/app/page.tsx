'use client';
import PlanPreviewer from "@/components/planPreviewer";
import { SemesterDates } from "@/components/SemesterDates";
import TextareaPlanner from "@/components/textareaPlanner";
import { useSemesterStore } from "@/store/semesterStore";
import { ArrowRightToLine } from "lucide-react";

export default function Home() {
  /*
  const [semesterStart, setSemesterStart] = useState<Date | null>(null);
  const [semesterEnd, setSemesterEnd] = useState<Date | null>(null);*/
  const setSemester = useSemesterStore((state) => state.setSemester);

  return (
    <div className="w-full p-4 ">
      <div className="flex items-center gap-8 mb-8 justify-between">
        <h1 className="text-3xl font-bold">Semester Planner</h1>
        <SemesterDates />
      </div>

      <div className="flex flex-col  gap-4 mb-8">
        {/* Legende */}
        <div className="flex items-center gap-4 py-2 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <ArrowRightToLine className="w-10 h-6 border-2 py-0.5 pl-1 rounded-sm" color="white" /> <span> = child task </span>
          </span>
          |
          <span>
            e. g. <span className="bg-primary/70 p-0.5 text-background font-bold rounded-md">next week</span> = due date
          </span>
          |
          <span>
            e. g. <span className="bg-cyan-400/70 p-0.5 text-background font-bold rounded-md">0.5h</span> = duration
          </span>
          |
          <span>
            task b <span className="text-green-600">:done:</span> = status
          </span>
        </div>
        {/* Legende */}
        
        <div className="font-sans flex  gap-4 w-full">
          <TextareaPlanner />
          <PlanPreviewer />
        </div>
      </div>

    </div>

  );
}
