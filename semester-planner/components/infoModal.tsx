'use client'
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfoPage from "@/components/infoPage";
import { useGeneralStore } from "@/store/generalStore";

export function InfoModal() {
    const showInfoHint = useGeneralStore((state) => state.showInfoHint);
    const hideInfoHint = useGeneralStore((state) => state.hideInfoHint);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (!showInfoHint) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") hideInfoHint();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showInfoHint, hideInfoHint]);

    if (!isMounted || !showInfoHint) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-8"
            onClick={hideInfoHint}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[85vh] overflow-auto rounded-xl border-2 border-muted-foreground/20 bg-background p-10 shadow-2xl
                    animate-in fade-in-0 zoom-in-95 duration-200"
            >
                <div className="flex justify-end">
                    <Button className="cursor-pointer" variant="ghost" size="icon-lg" onClick={hideInfoHint}>
                        <X className="size-5" />
                    </Button>
                </div>
                <InfoPage />
            </div>
        </div>
    );
}
