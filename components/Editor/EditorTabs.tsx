import { Accessor, For, Show, batch, createEffect, createSignal, onMount, type Component } from "solid-js";

import { createEventListener } from "@solid-primitives/event-listener";
import { useFS } from "../../context/FsContext";
import { getNode } from "../../service/FS.service";
import { cn } from "../../utils/cn";
import { TabChip } from "../ui/TabChip";
import { ContextMenuItem, useContextMenu } from "../../context/ContextMenu";
import { useOPFS } from "../../hooks/useOPFS";
import { File, isFolder } from "../../types/FS.types";
import { isDirty, clearDirty, setBaseline } from "../../stores/dirtyStore";
import { openConfirm } from "../ui/ConfirmDialog";
import { useAppState } from "../../context/AppStateContext";

interface EditorTabsProps {
  index: number;
}

export const EditorTabs: Component<EditorTabsProps> = ({ index }) => {
  const { EDITOR_TAB_HEIGHT } = useAppState();
  const { tabs } = useFS();
  let tabContainer: HTMLDivElement = null!;
  onMount(() => {
    createEventListener(tabContainer, "wheel", (e: WheelEvent) => {
      const isTrackpad =
        Math.abs(e.deltaY) < 20 && (e.deltaX !== 0 || e.deltaY !== 0) && !e.deltaY.toString().includes("."); // Mouse wheels usually give integer values

      if (isTrackpad) {
        // Do nothing - let default trackpad scrolling work
        return;
      }

      // Handle mouse wheel scrolling
      e.preventDefault();
      const scrollSpeed = 2.5;
      tabContainer.scrollLeft += e.deltaY * scrollSpeed;
    });
  });

  return (
    <div
      ref={tabContainer}
      class="flex overflow-x-auto whitespace-nowrap z-50 relative no-scrollbar"
      style={{ height: EDITOR_TAB_HEIGHT + "px", "padding-top": "2px" }}
    >
      <For each={tabs()}>
        {(path, tabIndex) => (
          <Show when={path}>
            <Tab file={path} tabIndex={tabIndex} index={index} />
          </Show>
        )}
      </For>
    </div>
  );
};

const Tab = ({ file, index, tabIndex }: { file: string; tabIndex: Accessor<number>; index: number }) => {
  const { openFiles, fs, setCurrentNode, currentNode, tabs, closeTab } = useFS();
  const { showContextMenu } = useContextMenu();
  const OPFS = useOPFS();
  const isSelected = () => currentNode().path === file;

  let tabRef: HTMLDivElement = null!;

  createEffect(() => {
    if (isSelected()) {
      tabRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  });

  const onFileClose = async (e: Event) => {
    e.stopPropagation();
    // If the file has unsaved changes, ask user whether to save
    if (isDirty(file)) {
      const node = getNode(fs, file) as File | undefined;
      const choice = await openConfirm({
        title: "Unsaved changes",
        description: `Save changes to \u201C${node?.name ?? file}\u201D before closing?`,
        actions: [
          { label: "Save", value: "save", variant: "primary" },
          { label: "Don't Save", value: "discard" },
          { label: "Cancel", value: "cancel" },
        ],
      });

      if (choice === "cancel") return;
      if (choice === "save" && node) {
        try {
          const content = openFiles.get(file) ?? "";
          await OPFS.saveFile(node, content);
          clearDirty(file);
          setBaseline(file, content);
        } catch (err) {
          console.error("Failed to save before closing", err);
          return; // abort closing on error
        }
      }
    }

    // Delegate close/selection behavior to FS context helper
    closeTab(file);
  };

  const closeOthers = () => {
    const keep = file;
    const toDelete = tabs().filter((p) => p !== keep);
    batch(() => {
      for (const p of toDelete) openFiles.delete(p);
      // keep current selection on this tab
      const node = getNode(fs, keep) ?? fs;
      setCurrentNode(node);
    });
  };

  const closeToRight = () => {
    const i = tabIndex();
    const toDelete = tabs().filter((_, idx) => idx > i);
    batch(() => {
      for (const p of toDelete) openFiles.delete(p);
    });
  };

  const closeAll = () => {
    batch(() => {
      for (const p of tabs()) openFiles.delete(p);
      setCurrentNode(fs);
    });
  };

  const closeSaved = async () => {
    const allTabs = tabs();
    const savedSet = new Set<string>();
    for (const p of allTabs) {
      const node = getNode(fs, p);
      if (!node) continue;
      if (isFolder(node)) continue;
      const content = openFiles.get(p) ?? "";
      try {
        const saved = await OPFS.getFile(node as File);
        if ((saved ?? "") === content) savedSet.add(p);
      } catch {}
    }

    if (savedSet.size === 0) return;
    const currentIdx = tabIndex();
    const remaining = allTabs.filter((p) => !savedSet.has(p));
    const nextPath = remaining.length === 0 ? null : remaining[Math.min(currentIdx, remaining.length - 1)];
    batch(() => {
      for (const p of savedSet) openFiles.delete(p);
      if (nextPath) {
        const node = getNode(fs, nextPath) ?? fs;
        setCurrentNode(node);
      } else {
        setCurrentNode(fs);
      }
    });
  };

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(file);
    } catch (e) {
      console.error("Failed to copy path", e);
    }
  };

  const contextMenu: ContextMenuItem[] = [
    { label: "Close", action: () => onFileClose(new Event("close")) },
    { label: "Close Others", action: closeOthers },
    { label: "Close to the Right", action: closeToRight },
    { label: "Close Saved", action: closeSaved },
    { label: "Close All", action: closeAll },
    { label: "Copy Path", action: copyPath },
  ];

  //  EditorState.toJSON/fromJSON save with tab data

  return (
    <TabChip
      path={file}
      selected={isSelected()}
      ref={tabRef}
      width={160}
      onContextMenu={(e) => showContextMenu(e as unknown as MouseEvent, contextMenu)}
      onClick={() => {
        batch(() => {
          const node = getNode(fs, file) ?? fs;
          setCurrentNode(node);
        });
      }}
      onClose={onFileClose}
    />
  );
};
