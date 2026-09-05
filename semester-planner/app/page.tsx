'use client';
import PlanPreviewer from "@/components/planPreviewer";
import { SemesterDates } from "@/components/SemesterDates";
import TextareaPlanner from "@/components/textareaPlanner";
import { TextAreaTooltip } from "@/components/textAreaTooltip";
import { InfoModal } from "@/components/infoModal";
import { ArrowRightToLine, CircleQuestionMark, TriangleAlert } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {

  return (
    <div className="w-full p-4 ">
      <InfoModal />

      <div className="mb-8 mt-12">
        <div className="flex items-center gap-8 justify-between">
          <div className="flex gap-4 mb-1">
            <RoughNotation type="underline" color="var(--primary)" animationDuration={300} strokeWidth={2} show>
              <span className="font-black text-foreground text-3xl">Plan like you are in your notes.</span>
            </RoughNotation>{" "}
            <TextAreaTooltip></TextAreaTooltip>
          </div>
          <SemesterDates />
        </div>
      </div>


      <div className="mb-3">
        <Tooltip>
          <TooltipTrigger className={"!bg-background font-foreground  "} render={<Button variant="outline" className="w-auto h-auto p-2"><TriangleAlert className="border-primary ring-primary size-4" /></Button>} />
          <TooltipContent className={"bg-background font-foreground p-2 flex gap-2 py-4 max-w-none"}>
            <ul className="flex flex-col gap-2">
              <li>
                  <div>
                    <span className="text-xs">Disclaimer</span><p className="text-muted-foreground text-xs">This textarea is a realtime bulk edit tool. If you delete all text from the text area, all your tasks will be permanently deleted everywhere aswell.</p>
                    <p className="text-muted-foreground text-xs">Backing up your plan text somewhere is recommended.</p>
                    <p className="text-muted-foreground text-xs">There is also no cross browser tab syncing of your tasks yet...</p>
                  </div>
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
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
