import { EditorState } from "@codemirror/state";
import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { initTsWorker, TypeScriptWorker } from "../utils/worker";

export const [start, setStart] = createSignal(0);

export function getPaintTimes(): {
  firstPaint?: number;
  firstContentfulPaint?: number;
} {
  const entries = performance.getEntriesByType("paint");
  const firstPaint = entries.find((entry: PerformanceEntry) => entry.name === "first-paint")?.startTime;
  const firstContentfulPaint = entries.find(
    (entry: PerformanceEntry) => entry.name === "first-contentful-paint",
  )?.startTime;
  return { firstPaint, firstContentfulPaint };
}

export const editorRefs: HTMLDivElement[] = [];
export const removeEditorRef = (ref: HTMLDivElement) => {
  const index = editorRefs.indexOf(ref);
  if (index > -1) {
    editorRefs.splice(index, 1);
  }
};

export const editorStates: Record<string, EditorState> = {};
// Remember vertical scrollTop per file path
export const editorScrollPositions: Map<string, number> = new Map();
// Remember selection ranges per file path (anchor/head)
export type SelectionRange = { anchor: number; head: number };
export const editorSelections: Map<string, SelectionRange[]> = new Map();

export const [editorMounted, setEditorMounted] = createSignal(false);

export const [showLineNumber, setShowLineNumber] = makePersisted(createSignal(true), {
  name: "showLineNumber",
});
export const [showFoldGutter, setShowFoldGutter] = makePersisted(createSignal(true), {
  name: "showFoldGutter",
});

export const [currentLine, setCurrentLine] = createSignal(0);
export const [currentColumn, setCurrentColumn] = createSignal(0);
export const [currentSelection, setCurrentSelection] = createSignal([0, 0]);
// Avoid referencing `window` at module evaluation time (SSR-safe)
const initialEditorHeight = typeof window !== "undefined" ? window.innerHeight : 0;
export const [editorHight, setEditorHight] = createSignal(initialEditorHeight);
export const [isTsLoading, setIsTsLoading] = createSignal(false);
export const [isGitLoading, setIsGitLoading] = createSignal(false);
export const [isMiniMap, setIsMiniMap] = createSignal(true);

// Global editor behavior flags
export const [formatOnSave, setFormatOnSave] = createSignal(true);

export let worker: TypeScriptWorker = null!;
export const isWorkerReady = () => workerState();

const [workerState, setWorkerState] = createSignal(false);
initTsWorker(async (tsWorker) => {
  worker = tsWorker;
  setWorkerState(true);
}, setIsTsLoading);
