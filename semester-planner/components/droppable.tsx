import { useDroppable } from "@dnd-kit/react";
import { Card, CardContent, CardTitle } from "./ui/card";
import React from "react";

export default function droppable({ id, title, isDay, className, children, week, isToday }: { id: string; title: string; isDay?: boolean; className?: string; children: React.ReactNode, week?: { startDate: Date, endDate: Date }, isToday?: boolean }) {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: 'column',
        accept: 'item',
    });
    const style = isDropTarget ? ' border-2 !border-solid !border-foreground rounded-lg p-2' : 'border-2 rounded-lg p-2';

    return (
        <>
            {(title.includes("Week")) ?
                (
                    <div className={`flex flex-col gap-1 rounded-md border-bottom gap-4 ${className}`}>
                        <div className="flex justify-between items-center w-full gap-4">
                            <h2 className={`border-b-3 text-lg font-bold ${isDay ? 'opacity-50 text-sm' : ''}`}>{title}</h2>
                            <span className={`text-sm text-foreground/40 justify-end`}>
                                {week && (
                                    <>{week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                                )}
                            </span>
                        </div>

                        <div className={`flex flex-col w-full gap-1 min-h-10 overflow-hidden items-center justify-center`}>
                            <div ref={ref} className={`flex flex-col overflow-visible w-full gap-3 min-h-16 border-2 border-dashed border-foreground/50 items-center justify-center text-foreground/50 ${style}`}>
                                {!(React.Children.count(children) > 0) && <span className={isDay ? 'opacity-50 text-sm' : ''}>general</span>}
                                {children}
                            </div>
                        </div>
                    </div >
                )
                :
                (
                    <Card className={`${className} py-1 overflow-visible`}>
                        <CardContent ref={ref} 
                        className={`flex flex-col gap-1 min-h-10 ${style} ${isDay ? 'border-2 border-dashed border-foreground/50' : 'border-transparent'} ${isToday ? 'border-primary' : ''} 
                        p-2 overflow-visible items-center justify-center`}>
                            <CardTitle className={isDay ? 'opacity-50 text-sm' : ''}>{title}</CardTitle>
                            <div className="flex flex-col gap-3 w-full items-start">
                                {children}
                            </div>
                        </CardContent>
                    </Card >
                )
            }

        </>
    );
}