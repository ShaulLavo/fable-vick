import { insertTab } from "@codemirror/commands";
import { Command, EditorView, KeyBinding } from "@codemirror/view";
import { vscodeKeymap } from "@replit/codemirror-vscode-keymap";
import { formatCode, getConfigFromExt } from "./format";
// import { code, setCode } from '~/stores/editorStore'
import { File, Folder } from "../types/FS.types";
import { getNode } from "../service/FS.service";
import hotkeys from "hotkeys-js";
import { Accessor } from "solid-js";
import { themedToast, toastError } from "./notify";
import { formatOnSave } from "../stores/editorStore";
import { isDirty, clearDirty, setBaseline } from "../stores/dirtyStore";

export function registerGlobalHotkeys(actions: {
  toggleSideBar: () => boolean;
  setIsSearchBar: (fn: (p: boolean) => boolean) => void;
  toggleTerminal: () => boolean;
}) {
  hotkeys("ctrl+b,command+b", actions.toggleSideBar);
  hotkeys("ctrl+p,command+p", (e) => {
    e.preventDefault();
    actions.setIsSearchBar((p) => !p);
  });
  hotkeys("ctrl+j,command+j", (e) => {
    e.preventDefault();
    actions.toggleTerminal();
  });
}
// Editor-scoped Mod-J is added in createKeymap below
// hotkeys('ctrl+p', toggleSideBar)

const overrideMap = {
  Tab: { key: "Tab", run: insertTab, preventDefault: true },
  "Mod-f": {
    key: "Mod-f",
    run: ((_) => console.info("search")) as Command,
    preventDefault: true,
  },
} as Record<string, KeyBinding>;

export function createKeymap(
  fileMap: Map<string, string>,
  filePath: () => string,
  currentExtension: () => string | undefined,
  code: () => string | undefined,
  setCode: (code: string) => void,
  saveFile: (file: File, content: string) => Promise<void>,
  fs: Folder,
  extraKeymap: KeyBinding[] = [],
  view: Accessor<EditorView>,
  skipSync: (b: boolean) => void,
  actions: {
    setIsSearchBar: (fn: (p: boolean) => boolean) => void;
    toggleSideBar: () => boolean;
    toggleTerminal: () => boolean;
  },
) {
  const additionalKeymap = [
    {
      key: "Mod-j",
      run: () => {
        actions.toggleTerminal();
        return true;
      },
      preventDefault: true,
      stopPropagation: false,
      scope: "editor",
    },
    {
      key: "Shift-Alt-f",
      run: () => {
        formatCode({
          code,
          setCode: (newCode) => {
            skipSync(true);
            view().dispatch({
              changes: {
                from: 0,
                to: code()?.length,
                insert: newCode ?? "",
              },
            });
          },
          config: getConfigFromExt(currentExtension()),
          cursorOffset: view().state.selection.main.head,
          setCursor: (offset) => {
            view().dispatch({ selection: { anchor: offset, head: offset } });
          },
        });

        return true;
      },
      preventDefault: true,
      scope: "editor",
    },
    {
      key: "Mod-s",
      run: () => {
        if (!fileMap.has(filePath()!)) {
          console.error("no file");
          return false;
        }
        const current = code();
        if (current == undefined) {
          console.error("no code");
          return false;
        }
        const node = getNode(fs, filePath()!);
        if (!node) {
          console.error("no node");
          return false;
        }
        const path = filePath()!;
        const doSave = async () => {
          let content = current;
          if (formatOnSave()) {
            const cfg = getConfigFromExt(currentExtension());
            if (cfg) {
              content = await formatCode({
                code,
                setCode: (newCode) => {
                  skipSync(true);
                  view().dispatch({
                    changes: {
                      from: 0,
                      to: code()?.length,
                      insert: newCode ?? "",
                    },
                  });
                },
                config: cfg,
                cursorOffset: view().state.selection.main.head,
                setCursor: (offset) => {
                  view().dispatch({ selection: { anchor: offset, head: offset } });
                },
              });
            } else {
              toastError("Format on save not supported for this file type");
            }
          }
          const hadChanges = isDirty(path);
          await saveFile(node as File, content);
          if (hadChanges) {
            themedToast(`Saved ${node.name}`);
            clearDirty(path);
          }
          setBaseline(path, content);
        };
        void doSave();
        return true;
      },
      preventDefault: true,
      scope: "editor",
    },
    {
      key: "Mod-b",
      run: () => {
        actions.toggleSideBar();
        return true;
      },
      preventDefault: true,
      stopPropagation: false,
      scope: "editor",
    },
    {
      key: "Mod-p",
      run: () => {
        actions.setIsSearchBar((p) => !p);
        return true;
      },
      preventDefault: true,
      stopPropagation: false,
      scope: "editor",
    },
    ...extraKeymap,
  ] as KeyBinding[];

  return vscodeKeymap
    .map((binding) => {
      if (binding.key && overrideMap[binding.key]) return overrideMap[binding.key];
      return binding;
    })
    .concat(additionalKeymap);
}
