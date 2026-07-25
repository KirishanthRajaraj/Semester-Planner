import { useSemesterStore } from "@/store/semesterStore";
import * as chrono from "chrono-node";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// input disguised as label text: no border/bg/padding, muted, subtle underline on hover/focus
const inlineInputClass =
    "inline-block field-sizing-content h-auto w-auto border-0 bg-transparent text-sm text-muted-foreground shadow-none underline-offset-4 hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:ring-0";

export function SemesterDates() {
    const semester = useSemesterStore((s) => s.semester);
    const setSemester = useSemesterStore((s) => s.setSemester);

    const [startText, setStartText] = useState(formatDate(semester.startDate));
    const [endText, setEndText] = useState(formatDate(semester.endDate));
    const [error, setError] = useState<string | null>(null);

    // resync the fields when the stored semester changes
    useEffect(() => {
        setStartText(formatDate(semester.startDate));
        setEndText(formatDate(semester.endDate));
    }, [semester.startDate, semester.endDate]);

    const textChanged =
        startText !== formatDate(semester.startDate) || endText !== formatDate(semester.endDate);

    const apply = () => {
        const start = chrono.parseDate(startText);
        const end = chrono.parseDate(endText);
        if (!start || !end) {
            setError("Bitte gültige Daten eingeben. (englisch oder dd.mm.yyyy)");
            return;
        }
        if (end <= start) {
            setError("Das Enddatum muss nach dem Startdatum liegen.");
            return;
        }
        setError(null);
        setSemester({ startDate: start, endDate: end });
    };

    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground mb-1">Aktuelles Semester:</p>

            <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
                <Input
                    value={startText}
                    onChange={(e) => setStartText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
                    className={inlineInputClass}
                />
                –
                <Input
                    value={endText}
                    onChange={(e) => setEndText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
                    className={inlineInputClass}
                />
                {textChanged && (
                    <Button size="sm" variant="secondary" className="ml-1 h-6 px-2 text-xs" onClick={apply}>
                        Submit
                    </Button>
                )}
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}