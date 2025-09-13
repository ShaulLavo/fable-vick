import { For, Show, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { DEFAULT_MODEL, SUPPORTED_MODELS, getAvailableModels, isGatewayConfigured } from "./Gateway";
import { useLlm, type LlmProvider } from "../../context/LlmContext";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

export type ModelItem = { id: string; name: string };

export default function ChatModelSelector(props: { open: boolean; onClose: () => void }) {
  const { provider, setProvider, localModels, localModelId, vercelModelId, setActiveLocalModel, setVercelModelId } =
    useLlm();
  const [activeTab, setActiveTab] = createSignal<LlmProvider>(provider());
  const [vercelModels, setVercelModels] = createSignal<ModelItem[]>([]);
  const [loading, setLoading] = createSignal(false);
  const vercelReady = createMemo(() => isGatewayConfigured());

  onMount(async () => {
    if (vercelReady()) {
      setLoading(true);
      try {
        const models = await getAvailableModels();
        setVercelModels(models);
      } finally {
        setLoading(false);
      }
    }
  });

  const applySelection = (id: string) => {
    const tab = activeTab();
    if (tab === "local") {
      setProvider("local");
      setActiveLocalModel(id);
    } else {
      setProvider("vercel");
      setVercelModelId(id);
    }
    props.onClose();
  };

  if (!props.open) return null;

  const { currentBackground, secondaryBackground } = useTheme();
  return (
    <div class="absolute inset-0 z-40">
      <div class="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} onClick={props.onClose} />
      <div
        class={cn("absolute left-1/2 top-20 -translate-x-1/2 w-[560px] shadow-lg rounded-md overflow-hidden")}
        style={{
          "background-color": currentBackground(),
          border: `1px solid ${currentBackground()}`,
        }}
      >
        <div
          class="flex items-center justify-between px-4 py-2 border-b"
          style={{ "border-color": currentBackground() }}
        >
          <div class="font-semibold">Select Model</div>
          <button class="text-sm opacity-70 hover:opacity-100" onClick={props.onClose}>
            Close
          </button>
        </div>
        <div class="flex">
          <button
            class={cn("px-4 py-2 text-sm border-r", activeTab() === "local" ? "font-semibold" : "opacity-70")}
            style={{ "border-color": currentBackground() }}
            onClick={() => setActiveTab("local")}
          >
            Local
          </button>
          <button
            class={cn("px-4 py-2 text-sm", activeTab() === "vercel" ? "font-semibold" : "opacity-70")}
            onClick={() => setActiveTab("vercel")}
            disabled={!vercelReady()}
            title={vercelReady() ? "" : "Vercel gateway not configured"}
          >
            Vercel
          </button>
        </div>
        <div class="p-3 max-h-[420px] overflow-auto" style={{ "background-color": secondaryBackground() }}>
          <Show when={activeTab() === "local"}>
            <div class="space-y-2">
              <For each={localModels()}>
                {(m) => (
                  <div
                    class={cn(
                      "flex items-center justify-between px-3 py-2 rounded cursor-pointer border",
                      m.id === localModelId() ? "border-blue-500" : "border-transparent hover:border-blue-300",
                    )}
                    onClick={() => applySelection(m.id)}
                  >
                    <div class="truncate pr-3" title={m.name}>
                      {m.name}
                    </div>
                    <button class="text-sm px-2 py-1 border rounded" style={{ "border-color": currentBackground() }}>
                      Use
                    </button>
                  </div>
                )}
              </For>
            </div>
          </Show>
          <Show when={activeTab() === "vercel"}>
            <Show
              when={vercelReady()}
              fallback={
                <div class="text-sm opacity-80">Vercel gateway not configured. Set VERCEL_OIDC_TOKEN in env.</div>
              }
            >
              <Show when={!loading()} fallback={<div class="text-sm opacity-80">Loading models…</div>}>
                <div class="space-y-2">
                  <For each={vercelModels().length ? vercelModels() : SUPPORTED_MODELS.map((id) => ({ id, name: id }))}>
                    {(m) => (
                      <div
                        class={cn(
                          "flex items-center justify-between px-3 py-2 rounded cursor-pointer border",
                          m.id === vercelModelId() ? "border-blue-500" : "border-transparent hover:border-blue-300",
                        )}
                        onClick={() => applySelection(m.id)}
                      >
                        <div class="truncate pr-3" title={m.name}>
                          {m.name}
                        </div>
                        <button
                          class="text-sm px-2 py-1 border rounded"
                          style={{ "border-color": currentBackground() }}
                        >
                          Use
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </Show>
        </div>
        <div class="px-4 py-2 text-xs opacity-80 border-t" style={{ "border-color": currentBackground() }}>
          Current: {provider()} · Local: {localModelId()} · Vercel: {vercelModelId() || DEFAULT_MODEL}
        </div>
      </div>
    </div>
  );
}
