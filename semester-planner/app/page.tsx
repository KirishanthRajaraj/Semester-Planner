'use client';
import PlanPreviewer from "@/components/planPreviewer";
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


  useEffect(() => {
    /*
    const storedStart = localStorage.getItem("semesterStart");
    const storedEnd = localStorage.getItem("semesterEnd");*/
    setSemester({ startDate: new Date("2026-09-15"), endDate: new Date("2027-1-30") });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-12">Semester Planner</h1>

      <div className="font-sans flex justify-center gap-16 w-full">
        <TextareaPlanner className="w-96" />
        <PlanPreviewer className="w-96" />
      </div>
    </div>

  );
}
