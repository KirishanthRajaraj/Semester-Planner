import { ArrowRightToLine, CircleQuestionMark, SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function TextAreaTooltip() {
    return (
        <div className="!bg-background font-foreground ">
            <Tooltip>
                <TooltipTrigger className={"!bg-background font-foreground  "} render={<Button variant="outline" size="icon-sm"><CircleQuestionMark className="border-primary ring-primary  " /></Button>} />
                <TooltipContent className={"bg-background font-foreground p-2 flex gap-2 py-4 max-w-none"}>
                    {/* Legende */}
                    <div className="flex items-center gap-4 py-2 text-muted-foreground text-sm">
                        <span className="flex items-center gap-3">
                            <ArrowRightToLine className="w-10 h-6 border-2 py-0.5 pl-1 border-foreground rounded-sm" color="var(--foreground)" /> <span> child task </span>
                        </span>
                        |
                        <span className="flex items-center gap-3">
                            e. g. <span className="bg-primary/70 p-0.5 text-background font-bold rounded-md">next week</span> due date
                        </span>
                        |
                        <span className="flex items-center gap-3">
                            e. g. <span className="bg-cyan-400/70 p-0.5 text-background font-bold rounded-md">0.5h</span> duration
                        </span>
                        |
                        <span className="flex items-center gap-3">
                            task b <span className="text-green-600">:done:</span> status
                        </span>
                        |
                        <span className="flex items-center gap-3">
                            <span className="bg-red-500/40 p-0.5 text-background font-bold rounded-md">overdue task!</span>
                        </span>
                    </div>
                    {/* Legende */}
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
