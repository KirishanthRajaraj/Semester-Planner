'use client';

import { useTaskStore } from "@/store/taskStore";
import DndArea from "@/components/dndArea";

export default function dnd() {
    return (
        <div className="container font-sans flex flex-col flex-1 justify-center">
            <h1 className="text-3xl font-bold mb-12 mt-16">Planung Drag & Drop</h1>
            <DndArea />
        </div>
    );
}
