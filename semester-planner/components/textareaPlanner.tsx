'use client'
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { Decoration, EditorView, ViewPlugin, keymap, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import * as chrono from "chrono-node";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { TaskItem } from "@/interfaces/taskItem";

// text editor styles
const editorTheme = EditorView.theme({
    "&": {
        backgroundColor: "transparent",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
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


// RangeSetBuilder [14, 20], [21, 34] indexe vom ganzen text des editors, um die dekorationen für diese von bis strings zu geben
function buildDecorations(text: string): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    chrono.parse(text).forEach((result) => {
        builder.add(
            result.index,
            result.index + result.text.length,
            Decoration.mark({ class: "bg-primary/30 dark:bg-primary/50 rounded-sm" })
        );
        console.log(result.text, result.start.date(), result.end?.date());
    });
    return builder.finish();
}

// zum genauer verstehen
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

const linesToTaskItem = (text: string): TaskItem[] => {
    const lines = text.split("\n");
    const items: TaskItem[] = [];
    // string benutzen für die id
    const parentAtDepth: (string | undefined)[] = [];
    lines.forEach((line) => {
        const depth = line.match(/^\t*/)?.[0].length ?? 0;
        const parsedDate = chrono.parse(line)[0];
        const item: TaskItem = ({
            id: crypto.randomUUID(),
            title: line,
            date: parsedDate?.start.date(),
            parentId: parentAtDepth[depth - 1],
        });
        console.log(parentAtDepth);

        items.push(item);
        // aktuellen Parent zwischenspeichern, sodass man die ParentId für das nächste Item setzen kann
        parentAtDepth[depth] = item.id;
        // hinzufügen / löschen von plätzen im Array, sodass die Länge des Arrays immer der Tiefe entspricht + 1, sodass man immer den Parent des nächsten setzen kann
        parentAtDepth.length = depth + 1;
    });
    console.log(items);
    return items;
}

export default function textareaPlanner({ className }: { className?: string }) {
    const [textAreaText, setTextAreaText] = useState<string>("");

    return (
        <div>
            <CodeMirror
                className={`${className}`}
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
                onChange={(value) => setTextAreaText(value)}
            />
            <Button className="mt-4" onClick={() => linesToTaskItem(textAreaText)}>
                Submit
            </Button>
        </div>
    );
}
