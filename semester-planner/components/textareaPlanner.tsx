'use client'
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { Decoration, EditorView, ViewPlugin, WidgetType, keymap, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { type Range } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import * as chrono from "chrono-node";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { TaskItem } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { useSemesterStore } from "@/store/semesterStore";
import { ChevronRight } from "lucide-react"
import { isDateOverdue } from "@/lib/taskOperations";
import { formatDateToken, parseLines } from "@/lib/textParsing";

// text editor styles
const editorTheme = EditorView.theme({
    "&": {
        backgroundColor: "transparent",
        color: "var(--foreground)",
        border: "2px solid var(--border)",
        borderRadius: "var(--radius)",
    },
    "&.cm-focused": {
        outline: "none",
        borderColor: "var(--ring)",
    },
    ".cm-content": {
        caretColor: "var(--foreground)",
        color: "var(--foreground)",
        padding: "12px",
    },
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--foreground)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "color-mix(in oklch, var(--primary) 35%, transparent)",
    },
    ".cm-gutters": {
        backgroundColor: "transparent",
        border: "none",
    },
    ".cm-placeholder": {
        color: "var(--muted-foreground)",
    },
});

// zeigt am zeilenende an, welches datum das child vom parent erben würde, reine anzeige
class InheritedDateWidget extends WidgetType {
    constructor(readonly label: string) {
        super();
    }

    // ohne eq wrde codemirror das widget bei jedem tastendruck neu bauen
    eq(other: InheritedDateWidget) {
        return other.label === this.label;
    }

    toDOM() {
        const chip = document.createElement("span");
        chip.className = "ml-2 px-1 rounded-sm text-xs align-middle bg-primary/15 text-muted-foreground select-none";
        chip.textContent = `\u21b3 ${this.label}`;
        return chip;
    }

    ignoreEvent() {
        return true;
    }
}

export default function TextareaPlanner({ className }: { className?: string }) {
    const [textAreaText, setTextAreaText] = useState<string>("");
    const router = useRouter();
    const DURATION_REGEX = /\b(\d+(?:\.\d+)?)\s?(hours?|hrs?|h)\b/i;

    const boardRevision = useTaskStore((state) => state.boardRevision);
    const tasks = useTaskStore((state) => state.tasks)

    // parse once on mount, for seeded tasks
    useEffect(() => {
        const text = taskItemsToText();
        textToTaskItem(text, true);
    }, []);

    // after mutations to the previewer, build the text again with the update tasks from zustand store
    useEffect(() => {
        if (boardRevision === 0) return;
        taskItemsToText();
    }, [boardRevision]);

    useEffect(() => {
        console.log(tasks);
    }, [tasks]);


    // collect every markation to submit to DecorationSet all at once
    function buildDecorations(text: string): DecorationSet {
        const ranges: Range<Decoration>[] = [];
        // gleiche methodenableitung wie textToTaskItem, damit cascading auch in den decorations realtime angezeigt wird
        const parsedLines = parseLines(text, useSemesterStore.getState().weeks);

        // mark dates, chrono parse returns arrays of results with index, so no loop needed
        chrono.parse(text).forEach((result) => {
            ranges.push(
                Decoration.mark({ class: "bg-primary/30 dark:bg-primary/50 rounded-sm p-0.5" })
                    .range(result.index, result.index + result.text.length)
            );
        });

        // mark parenttasks opacity, toptask underline
        const lines = text.split("\n");
        let offsetLine = 0;
        lines.forEach((line, index) => {
            const depth = line.match(/^\t*/)?.[0].length ?? 0;

            // status nach dem cascading, nicht nur der token in dieser zeile
            const isDone = parsedLines[index]?.status === "done";

            // mark :done:, :doing:
            const statusMatch = line.match(/:(done|doing):/i);
            if (statusMatch && statusMatch.index !== undefined) {
                const isDoneToken = statusMatch[1].toLowerCase() === "done";
                const tokenStart = offsetLine + statusMatch.index;
                ranges.push(
                    Decoration.mark({ class: isDoneToken ? "text-green-500 font-bold" : "text-amber-500 font-bold" })
                        .range(tokenStart, tokenStart + statusMatch[0].length)
                );
            }

            // durchstreichen, auch wenn der status nur geerbt/abgeleitet ist
            if (isDone) {
                ranges.push(
                    Decoration.mark({ class: "line-through opacity-60" })
                        .range(offsetLine + depth, offsetLine + line.length)
                );
            }

            // chip mit dem datum das diese zeile vom parent erben wuerde
            const parsedLine = parsedLines[index];
            if (parsedLine?.dateInherited && parsedLine.date !== undefined) {
                const label = formatDateToken(
                    parsedLine.date,
                    parsedLine.noDay,
                    useSemesterStore.getState().weeks
                );
                ranges.push(
                    Decoration.widget({ widget: new InheritedDateWidget(label) })
                        .range(offsetLine + line.length)
                );
            }

            // mark durations
            const durationMatch = line.match(DURATION_REGEX);
            if (durationMatch && durationMatch.index !== undefined) {
                const durationStart = offsetLine + durationMatch.index;
                ranges.push(
                    Decoration.mark({ class: "bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5" })
                        .range(durationStart, durationStart + durationMatch[0].length)
                );
            }

            //mark week {index}
            const weekMatch = line.match(/\bweek\s?(\d+)\b/i);
            if (weekMatch && weekMatch.index !== undefined && useSemesterStore.getState().weeks[parseInt(weekMatch[1]) - 1]) {
                const weekStart = offsetLine + weekMatch.index;
                ranges.push(
                    Decoration.mark({ class: "bg-amber-500/50 rounded-sm p-0.5" })
                        .range(weekStart, weekStart + weekMatch[0].length)
                );
            }


            if (line.trim() !== "") {
                // next line that isn't empty
                const nextLine = lines.slice(index + 1).find((l) => l.trim() !== "");
                // get the depth of the next line
                const nextDepth = nextLine?.match(/^\t*/)?.[0].length ?? 0;
                const hasChildren = nextLine !== undefined && nextDepth - depth == 1;

                // mark parent reduced opacity
                if (hasChildren) {
                    ranges.push(
                        Decoration.mark({ class: "opacity-50" })
                            .range(offsetLine + depth, offsetLine + line.length)
                    );
                }
                // mark underline for root tasks
                if (depth === 0) {
                    ranges.push(
                        Decoration.mark({ class: "underline" })
                            .range(offsetLine + depth, offsetLine + line.length)
                    );
                }

                // mark overdue tasks
                let isTaskOverdue = false;
                if (chrono.parse(line)[0]?.start.date()) {
                    isTaskOverdue = isDateOverdue(chrono.parse(line)[0]?.start.date())
                }
                const weekMatch = line.match(/\bweek\s?(\d+)\b/i);
                if (weekMatch && weekMatch.index !== undefined) {
                    const weekNumber = parseInt(weekMatch[1]);
                    const weekDate = useSemesterStore.getState().weeks[weekNumber - 1]?.endDate;
                    if (weekDate) {
                        isTaskOverdue = isDateOverdue(weekDate);
                    }
                }



                if (!isDone && isTaskOverdue) {
                    ranges.push(
                        Decoration.mark({ class: "bg-red-500/40 rounded-sm p-0.5" })
                            .range(offsetLine + depth, offsetLine + line.length)
                    );
                }
            }
            offsetLine += line.length + 1;
        });



        return Decoration.set(ranges, true);
    }

    const highlightExtension = ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = buildDecorations(view.state.doc.toString());
            }
            update(update: ViewUpdate) {
                if (update.docChanged) {
                    this.decorations = buildDecorations(update.state.doc.toString());
                }
            }
        },
        { decorations: (v) => v.decorations }
    );

    const textToTaskItem = (text: string, submit: boolean) => {
        const parsedLines = parseLines(text, useSemesterStore.getState().weeks);
        const items: TaskItem[] = [];

        const idByLine: (string | undefined)[] = [];

        parsedLines.forEach((parsedLine, lineIndex) => {
            if (parsedLine === undefined) return; // leere zeile

            const id = crypto.randomUUID();
            idByLine[lineIndex] = id;

            const item: TaskItem = ({
                id: id,
                title: parsedLine.title,
                date: parsedLine.date,
                duration: parsedLine.duration,
                status: parsedLine.status,
                noDay: parsedLine.noDay,
                dateInherited: parsedLine.dateInherited,
                parentId: parsedLine.parentIndex !== undefined ? idByLine[parsedLine.parentIndex] : undefined,
                depth: parsedLine.depth
            });

            items.push(item);
        });

        if (submit) {
            useTaskStore.getState().setTasks(items);
        }
    }

    // this function should always align with what textToTaskItem() does, but backwards!
    const taskItemsToText = () => {
        const tasks: TaskItem[] = useTaskStore.getState().tasks;
        const weeks = useSemesterStore.getState().weeks;
        let text: string = "";
        tasks.forEach((task) => {
            const parent = task.parentId !== undefined ? useTaskStore.getState().getTaskById(task.parentId) : undefined;
            const sameAsParent =
                parent?.date?.toDateString() === task.date?.toDateString() &&
                (parent?.noDay ?? false) === (task.noDay ?? false);

            // wenn date gleich wie parent || inherited, date entfernen, nicht anzeigen, sonst sieht man den decoration widget nicht
            const ownDate = task.dateInherited || sameAsParent ? undefined : task.date;

            const indent = "\t".repeat(task.depth ?? 0);
            const dateStr = ownDate ? " " + formatDateToken(ownDate, task.noDay ?? false, weeks) : "";
            const statusStr = task.status === "done" ? " :done:" : task.status === "inprogress" ? " :doing:" : "";
            const durationStr = task.duration ? " " + task.duration / 60 + "h" : "";

            text += indent + task.title + dateStr + statusStr + durationStr + "\n";
        });
        setTextAreaText(text);
        return text;
    }

    const updatePreview = (value: string) => {
        setTextAreaText(value);
        textToTaskItem(value, true);
    };

    const handleSubmit = () => {
        textToTaskItem(textAreaText, true);

        router.push("/plan");
    };

    return (
        <div className={`w-full ${className} min-h-96 lg:max-w-2/3`}>
            <CodeMirror
                placeholder="e.g. math homework due tomorrow at 18:00"
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                    highlightActiveLineGutter: false,
                    autocompletion: false,
                    bracketMatching: false,
                    closeBrackets: false,
                }}
                theme={editorTheme}
                extensions={[keymap.of([indentWithTab]), indentUnit.of("\t"), highlightExtension]}
                onChange={(value) => updatePreview(value)}
                value={textAreaText}
                minHeight="25rem"
            />
            <Button className="mt-4 gap-0.5" onClick={() => handleSubmit()}>
                Plan
                <ChevronRight></ChevronRight>
            </Button>
        </div>
    );
}
