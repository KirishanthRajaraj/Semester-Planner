import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function droppable({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: 'column',
        accept: 'item',
        // deprioritize the column's own collision box relative to the items inside it, so
        // hovering near an item targets the item (for group/insert position), while an empty
        // column (no items to collide with) still correctly falls back to the column itself.
        collisionPriority: CollisionPriority.Low,
    });
    const style = isDropTarget ? '!bg-black' : undefined;


    return (
        <>
            {(title.includes("Week")) ?
                (
                    <div className="flex flex-col gap-1 p-4 rounded-md border-bottom gap-4">
                        <h2 className="text-lg font-bold border-b-4">{title}</h2>
                        <div ref={ref} className={`flex flex-col gap-1 min-h-12 bg-white ${style}`}>
                            {children}
                        </div>
                    </div >
                )
                :
                (
                    <Card>
                        <CardHeader>
                            <CardTitle>{title}</CardTitle>
                        </CardHeader>
                        <CardContent ref={ref} className={`flex flex-col gap-1 min-h-12 ${style}`}>
                            {children}
                        </CardContent>
                    </Card >
                )
            }

        </>
    );
}