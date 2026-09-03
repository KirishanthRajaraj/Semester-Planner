import * as chrono from "chrono-node";
import { TaskStatus } from "@/interfaces/taskItem";

export type Week = { startDate: Date; endDate: Date };

export interface ParsedLine {
    depth: number;
    title: string;
    date?: Date;
    noDay: boolean;
    duration?: number;
    status: TaskStatus;
    // zeilenindex des parents, undefined bei root zeilen
    parentIndex?: number;
    // wenn true kommen date/noDay vom parent, in dieser zeile steht kein datums token
    dateInherited?: boolean;
}

const DURATION_REGEX = /\b(\d+(?:\.\d+)?)\s?(hours?|hrs?|h)\b/i;

const parseLine = (line: string, weeks: Week[]): ParsedLine | undefined => {
    if (line.trim() === "") return undefined;

    const depth = line.match(/^\t*/)?.[0].length ?? 0;

    // :done: / :doing: rausnehmen
    let status: TaskStatus = "todo";
    let rest = line;
    const statusMatch = rest.match(/:(done|doing):/i);
    if (statusMatch && statusMatch.index !== undefined) {
        status = statusMatch[1].toLowerCase() === "done" ? "done" : "inprogress";
        const statusToken = rest.slice(statusMatch.index, statusMatch.index + statusMatch[0].length);
        rest = rest.replace(statusToken, "").trim();
    }

    // "week 3" -> gehört generell zu woche 3, kein bestimmter tag
    let noDay = false;
    let weekDate: Date | undefined = undefined;
    const weekMatch = rest.match(/\bweek\s?(\d+)\b/i);
    if (weekMatch && weekMatch.index !== undefined) {
        noDay = true;
        const weekNumber = parseInt(weekMatch[1]);
        weekDate = weeks[weekNumber - 1]?.endDate;
        const weekToken = rest.slice(weekMatch.index, weekMatch.index + weekMatch[0].length);
        rest = rest.replace(weekToken, "").trim();
    }

    // duration aus titel rausnehmen
    let duration = undefined;
    const durationMatch = rest.match(DURATION_REGEX);
    if (durationMatch && durationMatch.index !== undefined) {
        const durationToken = rest.slice(durationMatch.index, durationMatch.index + durationMatch[0].length);
        rest = rest.replace(durationToken, "").trim();
        const num = Number(durationMatch[0].match(/\d+(?:\.\d+)?/)?.[0]); // "1.5 hours" -> 1.5
        duration = num * 60;
    }

    const parsedDates = chrono.parse(rest);
    // nur das erste erkannte datum wird zum datum der task
    const date = parsedDates[0]?.start.date();

    // alle daten aus dem titel entfernen
    let title = rest;
    for (let i = 0; i < parsedDates.length; i++) {
        const lineText = parsedDates[i];
        title = title.slice(0, lineText.index) + title.slice(lineText.index + lineText.text.length);
    }
    title = title.replace(/\s+/g, " ").trim();

    // zeilen die nur aus tokens bestehen ignorieren
    if (title === "") return undefined;

    return {
        depth,
        title,
        date: weekDate ?? date,
        noDay,
        duration,
        status,
    };
};

// direkte children einer zeile, gleiche idee wie getChildren() in taskOperations
const childrenOf = (parsedLines: (ParsedLine | undefined)[], parentIndex: number): ParsedLine[] => {
    const children: ParsedLine[] = [];
    for (const parsedLine of parsedLines) {
        if (parsedLine !== undefined && parsedLine.parentIndex === parentIndex) {
            children.push(parsedLine);
        }
    }
    return children;
};

// parent done = alle children done
// parentIndex muss gesetzt sein
const cascadeStatusDown = (parsedLines: (ParsedLine | undefined)[]) => {
    for (const parsedLine of parsedLines) {
        if (parsedLine === undefined || parsedLine.parentIndex === undefined) continue;

        const parent = parsedLines[parsedLine.parentIndex];
        if (parent !== undefined && parent.status === "done") {
            parsedLine.status = "done";
        }
    }
};

// alle children done = alle ascendants done, falls siblings auch done
// rückwarts loop, weil einfacher. descendants stehen im textarea immer nach ihrem parent
const cascadeStatusUp = (parsedLines: (ParsedLine | undefined)[]) => {
    for (let i = parsedLines.length - 1; i >= 0; i--) {
        const parsedLine = parsedLines[i];
        if (parsedLine === undefined) continue;

        const children = childrenOf(parsedLines, i);
        if (children.length === 0) continue;

        let allChildrenDone = true;
        for (const child of children) {
            if (child.status !== "done") {
                allChildrenDone = false;
            }
        }

        if (allChildrenDone) {
            parsedLine.status = "done";
        }
    }
};

// datum vom parent an alle kinder, die noch kein date haben
const cascadeDateDown = (parsedLines: (ParsedLine | undefined)[]) => {
    for (const parsedLine of parsedLines) {
        if (parsedLine === undefined || parsedLine.parentIndex === undefined) continue;
        if (parsedLine.date !== undefined) continue; // eigenes datum überschreibt vererbung

        const parent = parsedLines[parsedLine.parentIndex];
        if (parent === undefined || parent.date === undefined) continue;

        parsedLine.date = parent.date;
        parsedLine.noDay = parent.noDay;
        parsedLine.dateInherited = true;
    }
};

// so wie taskItemsToText ein datum schreibt: "week 3" wenn es fuer die ganze woche
// gilt, sonst "03 Sept 2026"
export const formatDateToken = (date: Date, noDay: boolean, weeks: Week[]): string => {
    if (noDay) {
        const weekIndex = weeks.findIndex((w) => date >= w.startDate && date <= w.endDate);
        if (weekIndex !== -1) {
            return `week ${weekIndex + 1}`;
        }
    }
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const parseLines = (text: string, weeks: Week[]): (ParsedLine | undefined)[] => {
    const parsedLines: (ParsedLine | undefined)[] = [];
    // parentAtDepth = was ist der aktuelle parent, auf der aktuellen depth
    const parentAtDepth: (number | undefined)[] = [];

    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const parsedLine = parseLine(lines[i], weeks);
        parsedLines.push(parsedLine);
        if (parsedLine === undefined) continue; // leere Zeilen werden geskipped

        // falls root task, setze undefined
        if(parsedLine.depth > 0){
            parsedLine.parentIndex = parentAtDepth[parsedLine.depth - 1];
        } else {
            parsedLine.parentIndex = undefined;
        }

        // falls nicht root task, setze lineIndex als parentAtDepth
        parentAtDepth[parsedLine.depth] = i;

        // löscht die tiefere parenteinträge, wenn nächste zeile eine depth zurückgeht
        /*
            mathe
                - aufgaben lösen :done:
                    - aufgabe 2 lösen -> :done:
                    - aufgabe 1 lösen -> :done:
                - theorie lesen <- z.b. wir sind hier im loop
                    - 1.2 lesen
                    - 1.3 lesen
            parentAtDepth = [index mathe, index aufgaben lösen, aufgabe 1 lösen] -> [index mathe, index theorie lesen]
        */
        parentAtDepth.length = parsedLine.depth + 1;
    }

    cascadeStatusDown(parsedLines);
    cascadeStatusUp(parsedLines);
    cascadeDateDown(parsedLines);

    return parsedLines;
};
