'use client';

import DndArea from "@/components/dndArea";
import { SemesterDates } from "@/components/SemesterDates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react';

export default function dnd() {
    return (
        <div className="font-sans flex flex-col flex-1 justify-center w-full">
            <div>
                <Link href={"/"}>

                    <Button className="mt-16 gap-0.5">
                        <ChevronLeft></ChevronLeft>
                        Text Plan
                    </Button>
                </Link>

            </div>
            <div className="flex items-center gap-8 mb-8 mt-4 justify-between p-4">
                <h1 className="text-3xl font-bold">Planung Drag & Drop</h1>
                <SemesterDates />
            </div>
            <DndArea />
        </div>
    );
}
