'use client'
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { Decoration, EditorView, MatchDecorator, ViewPlugin, keymap, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { type Range } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import * as chrono from "chrono-node";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { TaskItem, TaskStatus } from "@/interfaces/taskItem";
import { useTaskStore } from "@/store/taskStore";
import { ArrowRightToLine, ChevronRight } from "lucide-react"
import parse from 'parse-duration'

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

export default function TextareaPlanner({ className }: { className?: string }) {
    const [textAreaText, setTextAreaText] = useState<string>("");
    const router = useRouter();
    const DURATION_REGEX = /\b(\d+(?:\.\d+)?)\s?(hours?|hrs?|h)\b/i;

    useEffect(() => {
        taskItemsToText();
    }, []);


    // collect every markation to submit to DecorationSet all at once
    function buildDecorations(text: string): DecorationSet {
        const ranges: Range<Decoration>[] = [];

        // date spans over the whole doc (chrono gives absolute offsets)
        chrono.parse(text).forEach((result) => {
            ranges.push(
                Decoration.mark({ class: "bg-primary/30 dark:bg-primary/50 rounded-sm p-0.5" })
                    .range(result.index, result.index + result.text.length)
            );
        });

        // every line: colour the :done:/:doing: token, and strike through done lines
        let offset = 0;
        for (const line of text.split("\n")) {
            const statusMatch = line.match(/:(done|doing):/i);
            if (statusMatch && statusMatch.index !== undefined) {
                const isDone = statusMatch[1].toLowerCase() === "done";
                const tokenStart = offset + statusMatch.index;
                ranges.push(
                    Decoration.mark({ class: isDone ? "text-green-500 font-bold" : "text-amber-500 font-bold" })
                        .range(tokenStart, tokenStart + statusMatch[0].length)
                );
                if (isDone) {
                    const indent = line.match(/^\t*/)?.[0].length ?? 0;
                    if (indent < line.length) {
                        ranges.push(
                            Decoration.mark({ class: "line-through opacity-60" })
                                .range(offset + indent, offset + line.length)
                        );
                    }
                }
            }
            offset += line.length + 1; // + the newline, save the offset
        }

        // colour the durations
        let offsetDuration = 0;
        for (const line of text.split("\n")) {
            const durationMatch = line.match(DURATION_REGEX);
            if (durationMatch && durationMatch.index !== undefined) {
                const durationStart = offsetDuration + durationMatch.index;
                ranges.push(
                    Decoration.mark({ class: "bg-cyan-400/30 dark:bg-cyan-400/50 rounded-sm p-0.5" })
                        .range(durationStart, durationStart + durationMatch[0].length)
                );
            }
            offsetDuration += line.length + 1;
        }

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
        const lines = text.split("\n");
        const items: TaskItem[] = [];

        // string benutzen für die id
        const parentAtDepth: (string | undefined)[] = [];
        lines.forEach((line) => {
            if (line.trim() === "") return; // ignore empty lines

            const depth = line.match(/^\t*/)?.[0].length ?? 0;
            // remove :done:/:doing: from the text before saving
            let status: TaskStatus = "todo";
            let rest = line;
            const statusMatch = rest.match(/:(done|doing):/i);
            if (statusMatch && statusMatch.index !== undefined) {
                status = statusMatch[1].toLowerCase() === "done" ? "done" : "inprogress";
                const statusToken = rest.slice(statusMatch.index, statusMatch.index + statusMatch[0].length);
                rest = rest.replace(statusToken, "").trim();
            }

            // remove durations from the text before saving
            let duration = undefined;
            const durationMatch = rest.match(DURATION_REGEX);
            if (durationMatch && durationMatch.index !== undefined) {
                const durationToken = rest.slice(durationMatch.index, durationMatch.index + durationMatch[0].length);
                rest = rest.replace(durationToken, "").trim();
                const num = Number(durationMatch[0].match(/\d+(?:\.\d+)?/)?.[0]); // "1.5 hours" -> 1.5
                duration = num * 60;
            }

            const parsedDates = chrono.parse(rest);

            // only the first detected date becomes the task's date
            const date = parsedDates[0]?.start.date();

            // remove all dates from text
            let title = rest;
            for (let i = 0; i < parsedDates.length; i++) {
                const lineText = parsedDates[i];
                title = title.slice(0, lineText.index) + title.slice(lineText.index + lineText.text.length);
            }
            title = title.replace(/\s+/g, " ").trim();

            if (title.trim() === "") return; // ignore empty lines, that have dates


            const item: TaskItem = ({
                id: crypto.randomUUID(),
                title: title,
                date: date,
                duration: duration,
                status: status,
                parentId: parentAtDepth[depth - 1],
                depth: depth
            });

            items.push(item);
            // aktuellen Parent zwischenspeichern, sodass man die ParentId für das nächste Item setzen kann
            parentAtDepth[depth] = item.id;
            // hinzufügen / löschen von plätzen im Array, sodass die Länge des Arrays immer der Tiefe entspricht + 1, sodass man immer den Parent des nächsten setzen kann
            parentAtDepth.length = depth + 1;
        });

        if (submit) {
            useTaskStore.getState().setTasks(items);
        }
    }

    // this function should always align with what textToTaskItem() does, but backwards
    const taskItemsToText = () => {
        const tasks: TaskItem[] = useTaskStore.getState().tasks;
        let text: string = "";
        tasks.forEach((task, index) => {
            // render date
            const dateStr = task.date
                ? " " + task.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "";
            // render status
            const statusStr = task.status === "done" ? " :done:" : task.status === "inprogress" ? " :doing:" : "";
            text += "\t".repeat(task.depth ?? 0) + task.title + dateStr + statusStr;
            // render duration
            if (task.duration) {
                const hours = task.duration / 60;
                text += " " + hours + "h";
            }
            text += "\n"

        });
        setTextAreaText(text);
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
        <div className={`w-full ${className} min-h-96`}>
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
