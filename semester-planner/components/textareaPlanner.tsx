'use client'
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "@codemirror/commands";
import { Decoration, EditorView, MatchDecorator, ViewPlugin, keymap, type DecorationSet, type ViewUpdate } from "@codemirror/view";
import * as chrono from "chrono-node";

const highlightWords = ["tomorrow", "today"];


const wordMatcher = new MatchDecorator({
  regexp: new RegExp(`\\b(${highlightWords.join("|")})\\b`, "gi"),
  decoration: () => Decoration.mark({ class: "bg-primary/30 dark:bg-primary/50 rounded-sm" }),
});

// zum verstehen
const highlightExtension = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = wordMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.decorations = wordMatcher.updateDeco(update, this.decorations);
    }
  },
);

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

export default function textareaPlanner({ className }: { className?: string }) {
  return (
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
      extensions={[keymap.of([indentWithTab]), highlightExtension]}
    />
  );
}
