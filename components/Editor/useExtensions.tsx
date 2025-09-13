import { closeBrackets } from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import {
  EditorView,
  KeyBinding,
  ViewUpdate,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { showMinimap } from "@replit/codemirror-minimap";
import { tsFacetWorker, tsHoverWorker, tsLinterWorker, tsSyncWorker } from "@valtown/codemirror-ts";
import { Accessor, createEffect, on } from "solid-js";
import { useFS } from "../../context/FsContext";
import { createCompartmentExtension } from "../../hooks/createCompartmentExtension";
import { useFileExtension } from "../../hooks/useFileExtension";
import {
  editorRefs,
  isMiniMap,
  isWorkerReady,
  setEditorHight,
  setIsTsLoading,
  showFoldGutter,
  showLineNumber,
  worker,
} from "../../stores/editorStore";
import { useTheme } from "../../context/ThemeContext";
import { extensionMap } from "../../utils/format";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { go as goLang } from "@codemirror/lang-go";

//@ts-ignore no types :(
import rainbowBrackets from "rainbowbrackets";
import { render } from "solid-js/web";
import { createInnerZoom } from "../../hooks/createInnerZoom";
import { useCurrentFile } from "../../hooks/useCurrentFile";
import { useOPFS } from "../../hooks/useOPFS";
import Icon from "../ui/Icon";
import { createColorCycler, getTransparentColor } from "../../utils/color";
import { autoHide } from "../../utils/dom";
import { createKeymap } from "../../utils/keymap";
import { useAppState } from "../../context/AppStateContext";
import { updateDirtyForPath } from "../../stores/dirtyStore";
import { ProgrammaticChange } from "../../hooks/controlledValue";
import { viewTransition } from "../../utils/viewTransition";
import { useSetCode } from "./useSetCode";
import { WorkerShape } from "@valtown/codemirror-ts/worker";

export const useExtensions = (index: number, editorView: Accessor<EditorView>) => {
  const { openFiles, currentFile, fs } = useFS();
  const { currentFileContent: code, setCurrentFileContent } = useCurrentFile(currentFile, openFiles);
  const currentFilePath = () => currentFile()?.path ?? "";

  const OPFS = useOPFS();
  const { isTs, isJs, isPython, isGo, isJSON, isHtml, isSystemPath, isCSS, currentExtension } = useFileExtension();
  const { fontSize } = createInnerZoom({
    ref: () => editorRefs[index],
    key: "editor",
  });
  const { setCode, skipSync } = useSetCode(code, setCurrentFileContent, editorView);
  const { toggleTerminal, toggleSideBar, setIsSearchBar } = useAppState();
  const KeyBindings: KeyBinding[] = [];
  const defaultKeymap = createKeymap(
    openFiles,
    currentFilePath,
    currentExtension,
    code,
    setCode,
    OPFS.saveFile,
    fs,
    KeyBindings,
    editorView,
    skipSync,
    { toggleTerminal, toggleSideBar, setIsSearchBar },
  );
  const getBracketColor = createColorCycler();

  const focusExtension = EditorView.focusChangeEffect.of((state, focus) => {
    if (focus) {
    }
    return null;
  });

  const baseExtensions = [
    EditorView.updateListener.of((update: ViewUpdate) => {
      if (update.docChanged) {
        const { doc } = update.state;
        setEditorHight(Math.max(doc.lines * 13, 13));
        const newText = doc.toString();
        setCode(newText);
        // Skip programmatic updates we annotate via ProgrammaticChange
        const isProgrammatic = update.transactions.some((tr) => tr.annotation(ProgrammaticChange) === true);
        if (!isProgrammatic) {
          updateDirtyForPath(currentFilePath(), newText);
        }
      }
    }),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of(defaultKeymap),
    highlightActiveLineGutter(),
    indentationMarkers({
      hideFirstIndent: true,
      markerType: "codeOnly",
      colors: {
        light: getBracketColor(),
        dark: getBracketColor(),
        activeLight: getBracketColor(),
        activeDark: getBracketColor(),
      },
    }),
    focusExtension,
  ] as Extension[];

  const createExtension = (extension: Accessor<Extension>) => createCompartmentExtension(extension, editorView);

  createExtension(() => (isTs() ? javascript({ jsx: true, typescript: true }) : []));
  createExtension(() => (isCSS() ? css() : []));
  createExtension(() => (isPython() ? python() : []));
  createExtension(() => (isGo() ? goLang() : []));
  createExtension(() => (isJSON() && !isSystemPath() ? json() : []));
  createExtension(() =>
    isHtml()
      ? html({
          autoCloseTags: true,
          matchClosingTags: true,
          selfClosingTags: true,
        })
      : [],
  );
  createExtension(() => (showLineNumber?.() ? lineNumbers() : []));
  createExtension(() => (isSystemPath() ? [] : rainbowBrackets()));
  const { currentBackground, currentColor, currentTheme, isDark } = useTheme();
  createExtension(currentTheme);
  createExtension(() =>
    showFoldGutter()
      ? foldGutter({
          markerDOM: (isOpen) => {
            const fold = document.createElement("span");
            // const color = isDark()
            // 	? getDarkerRgbColor(getBracketColor(), 1, 0.5)
            // 	: getLighterRgbColor(getBracketColor(), 1, 0.3)
            render(
              () => (
                <>
                  {isOpen ? (
                    <Icon icon="chevronDown" color={currentColor()} />
                  ) : (
                    <Icon icon="chevronRight" color={currentColor()} />
                  )}
                </>
              ),
              fold,
            );
            return fold;
          },
        })
      : [],
  );
  createExtension(() =>
    showMinimap.compute([], () => {
      return isMiniMap()
        ? {
            create: () => {
              const minimap = document.createElement("div");
              autoHide(minimap);
              return { dom: minimap };
            },
            showOverlay: "mouse-over",
            displayText: "blocks",
          }
        : null;
    }),
  );
  createExtension(() => {
    if (!isTs() || !isWorkerReady() || !worker || !currentFilePath()) return [];

    const base = [
      tsFacetWorker.of({
        worker: worker as unknown as WorkerShape,
        path: currentFilePath()!,
      }),
      tsSyncWorker(),
      tsHoverWorker(),
    ];
    // Minimal help for JS: hover + completion but no TS lints
    return isJs() ? base : [...base, tsLinterWorker()];
  });
  const scrollBarOpacity = 0.1;
  createExtension(() =>
    EditorView.theme({
      ".cm-content": {
        fontSize: fontSize() + "px",
      },
      ".cm-gutters": {
        backgroundColor: currentBackground(),
        userSelect: "none",
        fontSize: fontSize() + "px",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        color: getTransparentColor(currentColor(), 0.4),
      },
      ".cm-activeLineGutter": {},
      ".cm-gutterElement": {
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
      },
      ".cm-foldGutter": {},

      // Match horizontal scrollbar styling to vertical
      ".cm-scroller::-webkit-scrollbar": {
        width: "1rem", // vertical thickness
        height: "1rem", // horizontal thickness (was too large)
      },
      ".cm-scroller::-webkit-scrollbar:vertical": {
        width: "1rem",
      },
      ".cm-scroller::-webkit-scrollbar:horizontal": {
        height: "1rem",
      },
      ".cm-scroller::-webkit-scrollbar-thumb": {
        background: getTransparentColor(currentColor(), scrollBarOpacity),
      },
      ".cm-scroller::-webkit-scrollbar-thumb:hover": {
        background: getTransparentColor(currentColor(), scrollBarOpacity * 2),
      },
      ".cm-scroller::-webkit-scrollbar-track": {
        background: "transparent",
      },
      // Make the corner where scrollbars meet transparent
      ".cm-scroller::-webkit-scrollbar-corner": {
        background: "transparent",
      },
    }),
  );
  createEffect(
    on(showFoldGutter, () => {
      setTimeout(() => {
        const foldGutterRef = document.querySelector(".cm-foldGutter");
        if (!foldGutterRef) return;
        autoHide(foldGutterRef as HTMLElement);
      }, 0);
    }),
  );
  createEffect(() => {
    //@ts-ignore
    if (extensionMap[currentExtension()] === "typescript") {
      setIsTsLoading(true);
    }
  });
  return baseExtensions;
};
