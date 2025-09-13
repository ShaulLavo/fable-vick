import { Component, For, Setter, Show } from "solid-js";
import { useTheme } from "../context/ThemeContext";

import { Spinner, SpinnerType } from "solid-spinner";
import { HoverCard } from "../components/HoverCard";
import { useFileExtension } from "../hooks/useFileExtension";
import { currentColumn, currentLine, currentSelection, isGitLoading, isTsLoading } from "../stores/editorStore";
import { Git, TypeScript } from "../assets/customIcons";
import { useAppState } from "../context/AppStateContext";
import { NumberTicker } from "./ui/NumberTicker";
import { isModelLoading, modelLoadPercent, modelStatusText, lastModelId } from "../stores/modelStatusStore";
import { IconLogo } from "../assets/customIcons";
import { LOGO_FONT_FAMILY, useFont } from "../context/FontContext";

export const DefaultDescription = (props: { description: string }) => {
  return <div>{props.description}</div>;
};

interface Status {
  title: string | Component;
  description?: string;
  isLoading: boolean;
  loader?: Component;
}

interface StatusBarProps {}

export const StatusBar: Component<StatusBarProps> = ({}) => {
  const { STATUS_BAR_HEIGHT } = useAppState();
  const { currentBackground, currentColor, secondaryBackground } = useTheme();
  const { isTs } = useFileExtension();
  const selectionLength = () => currentSelection()[1] - currentSelection()[0];
  const selectionText = () => (selectionLength() > 0 ? `(${selectionLength()} selected)` : "");
  const { baseFontSize } = useFont();
  const { isStatusBar } = useAppState();
  const statuses = () =>
    [
      {
        title: () => <IconLogo color={currentColor()} height={baseFontSize() + 2} />,
        description: isModelLoading() ? `Loading ${lastModelId() || "model"}…` : modelStatusText() || "Model ready",
        isLoading: isModelLoading(),
        loader: () => (
          <span class="flex items-center gap-1">
            <NumberTicker value={modelLoadPercent()} startValue={0} decimalPlaces={0} />
            <span>%</span>
          </span>
        ),
      },
      {
        title: `Ln ${currentLine()},Col ${currentColumn()} ${selectionText()}`,
        description: "Go to Line/Column",
        isLoading: false,
      },
      {
        title: isTs() ? () => <TypeScript color={currentColor()} height={baseFontSize() + 2} /> : "",
        // description: 'Go to Line/Column',
        isLoading: isTs() && isTsLoading(),
      },
      {
        title: () => <Git color={currentColor()} height={baseFontSize() + 2} />,
        description: "File Encoding",
        isLoading: isGitLoading(),
      },
    ] satisfies Status[];

  return (
    <Show when={isStatusBar()}>
      <div
        class="fixed bottom-0 left-0 right-0 w-full z-[100] flex p-1 items-center"
        style={{
          "background-color": secondaryBackground(),
          "border-color": currentBackground(),

          height: STATUS_BAR_HEIGHT + "px",
        }}
      >
        <h1
          style={{
            "font-family": LOGO_FONT_FAMILY,
            "font-size": "18px",
            "padding-inline": "4px",
            color: currentColor(),
          }}
        >
          Fable
        </h1>
        <ul class="flex flex-1 justify-end" style={{ "font-size": baseFontSize() + "px" }}>
          <For each={statuses()}>
            {(status) => (
              <li class="pr-1 flex items-center justify-center text-xs" style={{ color: currentColor() }}>
                {status.isLoading ? (
                  status.loader ? (
                    <status.loader />
                  ) : (
                    <Spinner
                      type={SpinnerType.tailSpin}
                      width={baseFontSize()}
                      height={baseFontSize()}
                      color={currentColor()}
                    />
                  )
                ) : status.description ? (
                  <HoverCard
                    trigger={typeof status.title === "function" ? <status.title /> : <>{status.title}</>}
                    caredContent={status.description}
                    hasArrow
                    gap={4}
                    as={"span"}
                  />
                ) : typeof status.title === "function" ? (
                  <status.title />
                ) : (
                  <span>{status.title}</span>
                )}
              </li>
            )}
          </For>
        </ul>{" "}
      </div>
    </Show>
  );
};
