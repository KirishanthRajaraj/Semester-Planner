import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DivideCircleIcon } from "lucide-react";
import React from "react";

export default function droppable({ id, title, isDay, className, children }: { id: string; title: string; isDay?: boolean; className?: string; children: React.ReactNode }) {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: 'column',
        accept: 'item',
    });
    const style = isDropTarget ? '!border-foreground border-2 !border-solid !border-foreground rounded-lg p-2' : 'border-2 rounded-lg p-2';


    return (
        <>
            {(title.includes("Week")) ?
                (
                    <div className={`flex flex-col gap-1 rounded-md border-bottom gap-4 ${className}`}>
                        <h2 className={`text-lg font-bold border-b-4 ${isDay ? 'opacity-50 text-sm' : ''}`}>{title}</h2>
                        <div className={`flex flex-col w-full gap-1 min-h-10 overflow-hidden items-center justify-center`}>
                            <div ref={ref} className={`flex flex-col w-full gap-1 min-h-16 border-2 border-dashed border-foreground/50 items-center justify-center text-foreground/50 ${style}`}>
                                {!(React.Children.count(children) > 0) && <span className={isDay ? 'opacity-50 text-sm' : ''}>until end of week</span>}
                                {children}
                            </div>
                        </div>
                    </div >
                )
                :
                (
                    <Card className={`${className}`}>
                        <CardContent ref={ref} className={`flex flex-col gap-1 min-h-10 ${style} ${isDay ? 'border-2 border-dashed border-foreground/50' : 'border-transparent'} p-2 overflow-hidden items-center justify-center`}>
                            <CardTitle className={isDay ? 'opacity-50 text-sm' : ''}>{title}</CardTitle>
                            <div className="flex flex-col gap-2 w-full items-start">
                                {children}
                            </div>
                        </CardContent>
                    </Card >
                )
            }

        </>
    );
}