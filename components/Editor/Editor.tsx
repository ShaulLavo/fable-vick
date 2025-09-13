import { EditorSelection, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Accessor, batch, createEffect, createSignal, on, onMount } from "solid-js";
import { currentBackground, ThemeKey, useTheme } from "../../context/ThemeContext";
import {
  editorRefs,
  editorScrollPositions,
  editorSelections,
  setCurrentColumn,
  setCurrentLine,
  setCurrentSelection,
  setEditorMounted,
  setStart,
  start,
} from "../../stores/editorStore";
import { setFormatter } from "../../utils/format";

import { inlineSuggestion } from "codemirror-extension-inline-suggestion";
import { useAppState } from "../../context/AppStateContext";
import { useFS } from "../../context/FsContext";
import { useLlm } from "../../context/LlmContext";
import { useTerminal } from "../../context/TerminalContext";
import { useCurrentFile } from "../../hooks/useCurrentFile";
import { useFileExtension } from "../../hooks/useFileExtension";
import { useExtensions } from "./useExtensions";

export interface EditorProps {
  defaultTheme?: ThemeKey;
  formatOnMount?: Accessor<boolean>;
  index: number;
}

export const Editor = ({
  defaultTheme,
  index,
  // size
}: EditorProps) => {
  const { openFiles, currentFile } = useFS();
  const { currentFileContent: code } = useCurrentFile(currentFile, openFiles);

  const { terminalBounds } = useTerminal();

  const { CURRENT_PATH_BAR_HEIGHT, EDITOR_TAB_HEIGHT, isStatusBar, STATUS_BAR_HEIGHT } = useAppState();

  const { isTs, isPython } = useFileExtension();

  const [editorView, setView] = createSignal<EditorView>(null!);

  // Track per-file scroll positions
  let prevPath = "";
  const currentPath = () => currentFile()?.path ?? "";

  const baseExtensions = useExtensions(index, editorView);
  const { setTheme } = useTheme();

  // Inline suggestion fetcher using the global LLM
  const { llmSuggest } = useLlm();
  const fetchSuggestion = async (state: EditorState) => {
    try {
      const pos = state.selection.main.head;
      const before = state.sliceDoc(Math.max(0, pos - 2000), pos);
      const after = state.sliceDoc(pos, Math.min(state.doc.length, pos + 400));
      const prompt =
        "You are a code completion engine. Suggest the next short insertion to help complete the code at the cursor. Respond with only the suggested text, no explanations." +
        "\n<before>\n" +
        before +
        "\n</before>\n<after>\n" +
        after +
        "\n</after>\nSuggestion:";
      const suggestion = await llmSuggest(prompt);
      return (suggestion || "").trim();
    } catch (e) {
      console.error("inline suggestion error", e);
      return "";
    }
  };

  const setupEditor = () => {
    const view = new EditorView({
      parent: editorRefs[index],
      dispatch: (transaction, view) => {
        view.update([transaction]);
        batch(() => {
          const { state } = view;
          const { selection, doc } = state;
          const { main } = selection;

          const line = doc.lineAt(main.head);
          setCurrentSelection([main.from, main.to]);
          setCurrentLine(line.number);
          setCurrentColumn(main.head - line.from);
        });
        // Persist selections for current file
        try {
          const path = currentPath();
          if (path) {
            const ranges = view.state.selection.ranges.map((r) => ({
              anchor: r.anchor,
              head: r.head,
            }));
            editorSelections.set(path, ranges);
          }
        } catch {}
      },
    });
    const editorState = EditorState.create({
      doc: code(),
      extensions: [...baseExtensions, inlineSuggestion({ fetchFn: fetchSuggestion, delay: 1000 })],
    });

    view.setState(editorState);
    batch(() => {
      setView(view);
      defaultTheme && setTheme(defaultTheme);
    });

    requestAnimationFrame(() => {
      setEditorMounted(true);
    });
    console.info(`first paint took ${(performance.now() - start()).toFixed(2)} ms`);
    setStart(performance.now());
    return view;
  };
  onMount(() => {
    const view = setupEditor();
    // Try to restore selection and scroll for initial file
    const path = currentPath();
    const len = view.state.doc.length;
    const savedSel = editorSelections.get(path);
    if (savedSel && savedSel.length) {
      try {
        const ranges = savedSel.map((r) => EditorSelection.range(Math.min(r.anchor, len), Math.min(r.head, len)));
        view.dispatch({ selection: EditorSelection.create(ranges) });
      } catch {}
    }
    const saved = editorScrollPositions.get(path) ?? 0;
    requestAnimationFrame(() => view.scrollDOM.scrollTo({ top: saved }));
  });

  // Save/restore scroll when switching files (tabs)
  createEffect(
    on(currentPath, (path) => {
      const view = editorView();
      if (!view) return;
      // Save previous file scroll top + selection
      if (prevPath) {
        try {
          editorScrollPositions.set(prevPath, view.scrollDOM.scrollTop);
          const ranges = view.state.selection.ranges.map((r) => ({
            anchor: r.anchor,
            head: r.head,
          }));
          editorSelections.set(prevPath, ranges);
        } catch {}
      }
      prevPath = path;
      // Restore new file scroll top after doc update completes
      queueMicrotask(() => {
        try {
          const len = view.state.doc.length;
          const sel = editorSelections.get(path);
          if (sel && sel.length) {
            const ranges = sel.map((r) => EditorSelection.range(Math.min(r.anchor, len), Math.min(r.head, len)));
            view.dispatch({ selection: EditorSelection.create(ranges) });
          }
          const saved = editorScrollPositions.get(path) ?? 0;
          requestAnimationFrame(() => view.scrollDOM.scrollTo({ top: saved }));
        } catch {}
      });
    }),
  );

  createEffect(() => {
    // TODO infer this
    if (isTs()) setFormatter("prettier");
    if (isPython()) setFormatter("python");
  });

  // createEffect(
  // 	on(
  // 		currentFilePath,
  // 		currentFilePath => {
  // 			const state = editorStates[currentFilePath] ?? baseState()
  // 			if (editorStates[currentFilePath]) {
  // 				editorStates[currentFilePath] = state
  // 			}
  // 			if (!state) return
  // 			editorView()?.setState(state)
  // 		},
  // 		{ defer: true }
  // 	)
  // )

  return (
    <>
      <div
        id="editor"
        style={{
          height:
            window.innerHeight -
            (isStatusBar() ? STATUS_BAR_HEIGHT : 0) -
            EDITOR_TAB_HEIGHT -
            CURRENT_PATH_BAR_HEIGHT -
            (terminalBounds?.height ?? 0) +
            "px",
        }}
        ref={(ref) => editorRefs.push(ref)}
      />
    </>
  );
};
