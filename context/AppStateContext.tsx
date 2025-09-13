import { makePersisted } from "@solid-primitives/storage";
import {
  batch,
  createContext,
  createEffect,
  createSignal,
  on,
  type JSX,
  useContext,
  Accessor,
  Setter,
  onMount,
} from "solid-js";
import { dualStorage } from "../utils/DualStorage";
import { runOncePerTick } from "../utils/utils";
import { setShowFoldGutter, setShowLineNumber } from "../stores/editorStore";
import { useLoading } from "../hooks/useLoading";

// Constants
export const STATUS_BAR_HEIGHT = 28;
export const EDITOR_TAB_HEIGHT = 30.5;
export const CURRENT_PATH_BAR_HEIGHT = 16;

import { createEventBus, EventBus } from "@solid-primitives/event-bus";
import { observeFirstContentfulPaint } from "../stores/measureStore";
import { registerGlobalHotkeys } from "../utils/keymap";

// Context shape
type AppStateContextValue = {
  panelGap: Accessor<number>;
  rootName: Accessor<string>;
  STATUS_BAR_HEIGHT: number;
  EDITOR_TAB_HEIGHT: number;
  CURRENT_PATH_BAR_HEIGHT: number;
  isGlobalLoading: Accessor<boolean>;
  setIsGlobalLoading: (loading: boolean) => void;
  isFsLoading: Accessor<boolean>;
  setIsFsLoading: (loading: boolean) => void;
  mainSideBarPosition: Accessor<"left" | "right">;
  setMainSideBarPosition: Setter<"left" | "right">;
  horizontalPanelSize: Accessor<number[]>;
  setHorizontalPanelSize: Setter<number[]>;
  verticalPanelSize: Accessor<number[]>;
  setVerticalPanelSize: Setter<number[]>;
  editorPanelSizes: Accessor<number[][]>;
  setEditorPanelSizes: Setter<number[][]>;
  ChatPanelSize: Accessor<number[]>;
  setChatPanelSize: Setter<number[]>;
  updateEditorPanelSize: (index: number, newSize: number[]) => void;
  lastKnownLeftSideBarSize: Accessor<[number, number]>;
  setLastKnownLeftSideBarSize: Setter<[number, number]>;
  lastKnownRightSideBarSize: Accessor<[number, number]>;
  setLastKnownRightSideBarSize: Setter<[number, number]>;
  toggleSideBar: () => boolean;
  setIsSideBar: (b: boolean) => boolean;
  isSideBar: () => boolean;
  isStatusBar: Accessor<boolean>;
  setIsStatusBar: Setter<boolean>;
  isSearchBar: Accessor<boolean>;
  setIsSearchBar: Setter<boolean>;
  isZenMode: Accessor<boolean>;
  setIsZenMode: Setter<boolean>;
  isTerminal: Accessor<boolean>;
  setIsTerminal: Setter<boolean>;
  toggleTerminal: () => boolean;
  hasPaintedBus: EventBus<boolean>;
};

const AppStateContext = createContext<AppStateContextValue>();

export function AppStateProvider(props: { children: JSX.Element }) {
  const hasPaintedBus = createEventBus<boolean>();
  onMount(async () => {
    await observeFirstContentfulPaint();
    hasPaintedBus.emit(true);
  });
  const { isLoading: isGlobalLoading, setIsLoading: setIsGlobalLoading } = useLoading();

  const { isLoading: isFsLoading, setIsLoading: setIsFsLoading } = useLoading();
  const [panelGap] = createSignal(6);

  const [rootName] = createSignal("root");

  const [mainSideBarPosition, setMainSideBarPosition] = makePersisted(createSignal<"left" | "right">("left"), {
    name: "mainSideBarPosition",
    storage: dualStorage,
  });
  if (mainSideBarPosition() !== "left" && mainSideBarPosition() !== "right") {
    setMainSideBarPosition("left");
  }

  const [horizontalPanelSize, setHorizontalPanelSize] = makePersisted(createSignal<number[]>([0.25, 0.75]), {
    name: "horizontalPanelSize",
    storage: dualStorage,
  });

  const [verticalPanelSize, setVerticalPanelSize] = makePersisted(createSignal<number[]>([0.7, 0.3]), {
    name: "verticalPanelSize",
    storage: dualStorage,
  });

  const [editorPanelSizes, setEditorPanelSizes] = makePersisted(createSignal<number[][]>([]), {
    name: "editorPanelSizes",
    storage: dualStorage,
  });

  const [ChatPanelSize, setChatPanelSize] = makePersisted(createSignal<number[]>([0.3, 0.7]), {
    name: "ChatPanelSize",
    storage: dualStorage,
  });

  const updateEditorPanelSize = (index: number, newSize: number[]) => {
    setEditorPanelSizes((sizes) => {
      const updatedSizes = [...sizes];
      updatedSizes[index] = newSize;
      return updatedSizes;
    });
  };

  const [lastKnownLeftSideBarSize, setLastKnownLeftSideBarSize] = makePersisted(
    createSignal<[number, number]>([0.3, 0.7]),
    {
      name: "lastKnownLeftSideBarSize",
      storage: dualStorage,
    },
  );

  const [lastKnownRightSideBarSize, setLastKnownRightSideBarSize] = makePersisted(
    createSignal<[number, number]>([0.7, 0.3]),
    {
      name: "lastKnownRightSideBarSize",
      storage: dualStorage,
    },
  );

  const toggleSideBar = runOncePerTick(() => {
    const position = mainSideBarPosition();
    const currentSize = horizontalPanelSize();
    const isLeft = position === "left";

    batch(() => {
      if (currentSize[isLeft ? 0 : 1] === 0) {
        const restoredSize = isLeft ? lastKnownLeftSideBarSize() : lastKnownRightSideBarSize();

        if (restoredSize[isLeft ? 0 : 1] !== 0) {
          setHorizontalPanelSize(restoredSize);
        } else {
          setHorizontalPanelSize(isLeft ? [0.3, 0.7] : [0.7, 0.3]);
        }
      } else {
        if (isLeft) {
          setLastKnownLeftSideBarSize(currentSize as [number, number]);
        } else {
          setLastKnownRightSideBarSize(currentSize as [number, number]);
        }

        setHorizontalPanelSize(isLeft ? [0, 1] : [1, 0]);
      }
    });

    return true;
  });

  const setIsSideBar = (b: boolean) => {
    const position = mainSideBarPosition();
    const isLeft = position === "left";
    const currentSize = horizontalPanelSize();

    batch(() => {
      if (b) {
        const restoredSize = isLeft ? lastKnownLeftSideBarSize() : lastKnownRightSideBarSize();
        if (restoredSize[isLeft ? 0 : 1] !== 0) {
          setHorizontalPanelSize(restoredSize);
        } else {
          setHorizontalPanelSize(isLeft ? [0.3, 0.7] : [0.7, 0.3]);
        }
      } else {
        if (currentSize[isLeft ? 0 : 1] !== 0) {
          if (isLeft) {
            setLastKnownLeftSideBarSize(currentSize as [number, number]);
          } else {
            setLastKnownRightSideBarSize(currentSize as [number, number]);
          }
        }
        setHorizontalPanelSize(isLeft ? [0, 1] : [1, 0]);
      }
    });

    return true;
  };

  const isSideBar = () => {
    const position = mainSideBarPosition();
    const isLeft = position === "left";
    const currentSize = horizontalPanelSize();
    return currentSize[isLeft ? 0 : 1] !== 0;
  };

  const [isStatusBar, setIsStatusBar] = makePersisted(createSignal(true), {
    name: "isStatusBar",
    storage: dualStorage,
  });

  const [isSearchBar, setIsSearchBar] = createSignal(false);

  const [isZenMode, setIsZenMode] = makePersisted(createSignal(false), {
    name: "isZenMode",
    storage: dualStorage,
  });

  // Terminal visibility toggle (persisted)

  const [isTerminal, setIsTerminal] = makePersisted(createSignal(true), {
    name: "isTerminal",
    storage: dualStorage,
  });

  const toggleTerminal = runOncePerTick(() => {
    setIsTerminal((v) => !v);
    return true;
  });

  const value: AppStateContextValue = {
    panelGap,
    rootName,
    STATUS_BAR_HEIGHT,
    EDITOR_TAB_HEIGHT,
    CURRENT_PATH_BAR_HEIGHT,
    isGlobalLoading,
    setIsGlobalLoading,
    isFsLoading,
    setIsFsLoading,
    mainSideBarPosition,
    setMainSideBarPosition,
    horizontalPanelSize,
    setHorizontalPanelSize,
    verticalPanelSize,
    setVerticalPanelSize,
    editorPanelSizes,
    setEditorPanelSizes,
    ChatPanelSize,
    setChatPanelSize,
    updateEditorPanelSize,
    lastKnownLeftSideBarSize,
    setLastKnownLeftSideBarSize,
    lastKnownRightSideBarSize,
    setLastKnownRightSideBarSize,
    toggleSideBar,
    setIsSideBar,
    isSideBar,
    isStatusBar,
    setIsStatusBar,
    isSearchBar,
    setIsSearchBar,
    isZenMode,
    setIsZenMode,
    isTerminal,
    setIsTerminal,
    toggleTerminal,
    hasPaintedBus,
  };

  onMount(() => {
    registerGlobalHotkeys({ toggleSideBar, setIsSearchBar, toggleTerminal });
  });

  createEffect(
    on(
      isZenMode,
      (zen) => {
        batch(() => {
          setShowLineNumber(!zen);
          setShowFoldGutter(!zen);
          setIsSideBar(!zen);
          setIsStatusBar(!zen);
          setIsTerminal(!zen);
        });
      },
      { defer: true },
    ),
  );

  return <AppStateContext.Provider value={value}>{props.children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within an AppStateProvider");
  return ctx;
}
