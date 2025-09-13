import Resizable from "@corvu/resizable";
import { createEffect, createSignal, Show } from "solid-js";
import { FileSystem } from "./FileSystem/FileSystem";
import { useAppState } from "../context/AppStateContext";
import { currentColor, secondaryBackground, useTheme } from "../context/ThemeContext";

//
import { lazy } from "solid-js";
import EditorArea from "./Editor/EditorArea";
import { Terminal } from "./Terminal/Terminal";
import { Tabs } from "./ui/AlwaysRenderTabs";
import Icon from "./ui/Icon";
import { ResizableHandle, ResizablePanel } from "./ui/Resizable";
import { useFont } from "../context/FontContext";
const Chat = lazy(() => import("./Chat/Chat").then((m) => ({ default: m.Chat })));
export interface MainViewProps {
  sidebarSide?: "left" | "right";
}

export function MainView(props: MainViewProps) {
  const { fontFamilyWithFallback } = useFont();
  const { currentBackground, secondaryColor } = useTheme();
  const { horizontalPanelSize, isStatusBar, setHorizontalPanelSize } = useAppState();
  const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(null!);
  const tabs = [
    {
      id: "1",
      icon: <Icon icon="file" />,
      label: "EXPLORER",
      content: <FileSystem />,
    },
    {
      id: "2",
      icon: <Icon class="h-full" icon="chat" />,
      label: "CHAT",
      content: <Chat />,
    },
  ];
  return (
    <div style={{ "font-family": fontFamilyWithFallback() }}>
      {/* Left/Right: sidebar vs workbench; terminal sits only under workbench */}
      <Resizable
        sizes={horizontalPanelSize()}
        onSizesChange={(size) => {
          if (size.length !== 2) return;
          setHorizontalPanelSize(size);
        }}
        class="w-full flex min-h-0"
        style={{
          "background-color": secondaryBackground(),
          color: currentColor(),
          height: isStatusBar() ? 'calc(100vh - 28px)' : '100vh',
          overflow: 'hidden',
        }}
        orientation="horizontal"
        accessKey="horizontal"
      >
        {/* Left panel */}
        <ResizablePanel
          class="overflow-x-hidden border-none h-full"
          initialSize={horizontalPanelSize()?.[0]}
          id="left-panel"
        >
          {props.sidebarSide === "left" ? <Tabs tabs={tabs} /> : <RightWorkbench />}
        </ResizablePanel>

        <ResizableHandle />

        {/* Right panel */}
        <ResizablePanel class="overflow-hidden min-h-0" initialSize={horizontalPanelSize()?.[1]} id="right-panel">
          {props.sidebarSide === "left" ? <RightWorkbench /> : <Tabs tabs={tabs} />}
        </ResizablePanel>
      </Resizable>
    </div>
  );
}
// Editor layout moved to components/Editor/EditorArea for code-splitting

const Workbench = () => {
  const [mountEditor, setMountEditor] = createSignal(false);
  (() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => setMountEditor(true));
    } else {
      setTimeout(() => setMountEditor(true), 0);
    }
  })();
  return (
    <Show when={mountEditor()} fallback={<div class="p-2 text-sm opacity-80">Loading editor…</div>}>
      <EditorArea />
    </Show>
  );
};

const RightWorkbench = () => {
  const { currentBackground, secondaryColor } = useTheme();
  const { isTerminal, verticalPanelSize, setVerticalPanelSize, panelGap } = useAppState();
  const [lastTermSplit, setLastTermSplit] = createSignal<[number, number] | null>(null);

  createEffect(() => {
    const show = isTerminal();
    const sizes = verticalPanelSize();
    if (!show) {
      if (sizes[1] !== 0) setLastTermSplit(sizes as [number, number]);
      if (sizes[1] !== 0) setVerticalPanelSize([1, 0]);
    } else {
      if (sizes[1] === 0) setVerticalPanelSize(lastTermSplit() ?? [0.7, 0.3]);
    }
  });

  const handleStyle = () => ({
    "background-color": currentBackground(),
    width: panelGap() + "px",
    // display: isTerminal() ? '' : 'none'
  });

  const bottomPanelStyle = () => ({
    display: isTerminal() ? "" : "none",
  });

  return (
    <Resizable
      sizes={verticalPanelSize()}
      onSizesChange={(size) => {
        if (size.length !== 2) return;
        setVerticalPanelSize(size);
      }}
      class="w-full flex"
      style={{
        "background-color": currentBackground(),
        color: secondaryColor(),
        height: "100%",
        overflow: "hidden",
      }}
      orientation="vertical"
      accessKey="vertical"
    >
      <ResizablePanel class="min-h-0">
        <Workbench />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel class="min-h-[140px]" style={bottomPanelStyle()}>
        <Show when={isTerminal()}>
          <Terminal class="h-full" />
        </Show>
      </ResizablePanel>
    </Resizable>
  );
};
