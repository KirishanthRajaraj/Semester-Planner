import { useDroppable, useDragOperation } from "@dnd-kit/react";
import { Card, CardContent, CardTitle } from "./ui/card";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddTaskDialog from "./addTaskDialog";
import { useTaskStore } from "@/store/taskStore";

// wo ein neuer task landet, wenn man in diesem droppable auf das plus klickt.
// fehlt der prop, gibt es hier kein plus (z.b. bei "outside semester", das ist
// eine ueberlaufansicht und kein sinnvolles ziel).
export type AddTarget = { date?: Date; noDay: boolean };

export default function Droppable({ id, title, isDay, className, children, week, isToday, addTarget, dayDate }: {
    id: string; title: string; isDay?: boolean; className?: string; children: React.ReactNode,
    week?: { startDate: Date, endDate: Date }, isToday?: boolean, addTarget?: AddTarget, dayDate?: Date
}) {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: 'column',
        accept: 'item',
    });

    // waehrend eines drags waere die fuellung nur stoerend
    const { source } = useDragOperation();
    const isDragActive = source != null;

    const [addOpen, setAddOpen] = useState(false);

    const style = isDropTarget ? ' border-2 !border-solid !border-foreground rounded-lg p-2' : 'border-2 rounded-lg p-2';

    // liegt hinter den task karten (die sind relative, also weiter oben im stapel).
    // klicks auf eine karte treffen die karte, klicks daneben das plus.
    const addOverlay = addTarget && !isDragActive && (
        <button
            type="button"
            aria-label={`Task in ${title} hinzufügen`}
            onClick={() => setAddOpen(true)}
            className="absolute z-10 inset-0 flex cursor-pointer items-center justify-center rounded-lg
                       bg-muted/60 opacity-0 scale-95 transition-all duration-200 ease-out
                       hover:opacity-100 hover:scale-100"
        >
            <Plus onClick={() => setAddOpen(true)} className="size-6 text-primary transition-transform duration-200 group-hover:rotate-90" />
        </button>
    );

    const addDialog = addTarget && (
        <AddTaskDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            targetTitle={String(title).charAt(0).toUpperCase() + String(title).slice(1) + " " + (isDay ? dayDate?.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) ?? '' : '')}
            date={addTarget.date}
            noDay={addTarget.noDay}
        />
    );

    return (
        <>
            {(title.includes("Week")) ?
                (
                    <div className={`flex flex-col gap-1 rounded-md border-bottom gap-4 ${className}`}>
                        <div className="flex justify-between items-center w-full gap-4">
                            <h2 className={`border-b-3 text-lg font-bold border-b-foreground ${isDay ? 'opacity-50 text-sm' : ''}`}>{title}</h2>
                            <span className={`text-sm text-foreground/40 justify-end`}>
                                {week && (
                                    <>{week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                                )}
                            </span>
                        </div>

                        <div className={`flex flex-col w-full gap-1 overflow-visible items-center justify-center`}>
                            <div ref={ref} className={`group relative overflow-visible w-full gap-3 min-h-10 mb-4`}>
                                {addOverlay}
                                <div className={`z-20 w-full min-h-full flex flex-col gap-3 border-2 border-dashed border-foreground/50 items-center justify-center text-foreground/50  ${style}`}>
                                    {!(React.Children.count(children) > 0) && <span className={`${isDay ? 'opacity-50 text-sm' : ''}`}>general</span>}
                                    {children}
                                </div>
                            </div>
                        </div>
                        {addDialog}
                    </div >
                )
                :
                (
                    <Card className={`${className} py-1 overflow-visible`}>
                        <CardContent ref={ref}
                            className={`group relative flex flex-col gap-1 min-h-10 ${style} ${isDay ? 'border-2 border-dashed border-foreground/50' : 'border-transparent'} ${isToday ? 'border-primary' : ''}
                        p-2 overflow-visible items-center justify-center`}>
                            {addOverlay}
                            <CardTitle className={`relative ${isDay ? 'opacity-50 text-sm' : ''}`}>{title}</CardTitle>
                            <div className="flex flex-col gap-3 w-full items-start z-20">
                                {children}
                            </div>
                        </CardContent>
                        {addDialog}
                    </Card >
                )
            }

        </>
    );
}
