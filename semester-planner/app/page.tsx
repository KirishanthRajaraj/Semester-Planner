'use client';
import PlanPreviewer from "@/components/planPreviewer";
import { SemesterDates } from "@/components/SemesterDates";
import TextareaPlanner from "@/components/textareaPlanner";
import { TextAreaTooltip } from "@/components/textAreaTooltip";
import { ArrowRightToLine } from "lucide-react";

export default function Home() {
  /*
  const [semesterStart, setSemesterStart] = useState<Date | null>(null);
  const [semesterEnd, setSemesterEnd] = useState<Date | null>(null);*/
  return (
    <div className="w-full p-4 ">
      <div className="flex items-center gap-8 mb-8 mt-20 justify-between">
        <h1 className="text-3xl font-bold">Semester Planner</h1>
        <SemesterDates />
      </div>

      <div className="flex flex-col gap-4 mb-8">
      <TextAreaTooltip></TextAreaTooltip>        
        <div className="font-sans flex flex-col lg:flex-row gap-4 w-full">
          <TextareaPlanner />
          <PlanPreviewer />
        </div>
      </div>

    </div>

  );
}
