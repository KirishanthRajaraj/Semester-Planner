import { useDroppable } from "@dnd-kit/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function droppable({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const { ref } = useDroppable({
        id,
    });

    return (
        <>
            {(title.includes("Week")) ?
                (
                    <div className="flex flex-col gap-1 p-4 rounded-md border-bottom gap-4">
                        <h2 className="text-lg font-bold border-b-4">{title}</h2>
                        <div ref={ref} className="flex flex-col gap-2 min-h-12">
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
                        <CardContent ref={ref} className="flex flex-col gap-1 min-h-12">
                            {children}
                        </CardContent>
                    </Card >
                )
            }

        </>
    );
}