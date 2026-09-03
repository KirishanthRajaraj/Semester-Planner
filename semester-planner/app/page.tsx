'use client';
import PlanPreviewer from "@/components/planPreviewer";
import { SemesterDates } from "@/components/SemesterDates";
import TextareaPlanner from "@/components/textareaPlanner";
import { TextAreaTooltip } from "@/components/textAreaTooltip";
import { InfoModal } from "@/components/infoModal";
import { ArrowRightToLine } from "lucide-react";
import { RoughNotation } from "react-rough-notation";

export default function Home() {

  return (
    <div className="w-full p-4 ">
      <InfoModal />

      <div className="flex items-center gap-8 mb-8 mt-12 justify-between">
        <div className="flex gap-4 mb-5">
          <RoughNotation type="underline" color="var(--primary)" animationDuration={300} strokeWidth={2} show>
            <span className="font-black text-foreground text-3xl">Plan like you are in your notes.</span>
          </RoughNotation>{" "}
          <TextAreaTooltip></TextAreaTooltip>
        </div>
        <SemesterDates />
      </div>

      <div className="flex flex-col gap-4 mb-8">



        <div className="font-sans flex flex-col lg:flex-row items-start gap-4 w-full">
          <TextareaPlanner />
          <PlanPreviewer />
        </div>
      </div>

    </div>

  );
}
