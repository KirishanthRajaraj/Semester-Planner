'use client';

import { useTaskStore } from "@/store/taskStore";
import DndArea from "@/components/dndArea";

export default function dnd() {
    return (
        <div className="container font-sans flex flex-col flex-1 items-center justify-center">
            dnd area
            <DndArea />
        </div>
    );
}
