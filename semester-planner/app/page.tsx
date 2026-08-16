'use client';
import PlanPreviewer from "@/components/planPreviewer";
import { SemesterDates } from "@/components/SemesterDates";
import TextareaPlanner from "@/components/textareaPlanner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSemesterStore } from "@/store/semesterStore";
import Image from "next/image";
import { useEffect, useState } from "react";

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
      <div className="font-sans flex  gap-4 w-full">
        <TextareaPlanner />
        <PlanPreviewer />
      </div>
    </div>

  );
}
