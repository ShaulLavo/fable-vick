import { For, Show, createSignal, onMount, createMemo } from "solid-js";
import { cn } from "../../utils/cn";
import { DEFAULT_MODEL, SUPPORTED_MODELS, getAvailableModels, isGatewayConfigured } from "./Gateway";
import { useLlm } from "../../context/LlmContext";
import { useTheme } from "../../context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/Dropdown";

export default function ChatModelDropdown() {
  const { currentBackground, secondaryBackground, secondaryColor } = useTheme();
  const {
    provider,
    localModelId,
    vercelModelId,
    localModels,
    setActiveLocalModel,
    setActiveProvider,
    setActiveVercelModel,
  } = useLlm();

  const [loading, setLoading] = createSignal(false);
  const [vercelModels, setVercelModels] = createSignal<{ id: string; name: string }[]>([]);
  const vercelReady = () => isGatewayConfigured();

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

  const triggerLabel = createMemo(
    () => `${provider()} · ${provider() === "local" ? localModelId() : vercelModelId() || DEFAULT_MODEL}`,
  );

  const currentValue = createMemo(() =>
    provider() === "local" ? `local:${localModelId()}` : `vercel:${vercelModelId() || DEFAULT_MODEL}`,
  );

  function handleChange(val: string) {
    const [prov, id] = val.split(":", 2) as ["local" | "vercel", string];
    if (prov === "local") {
      setActiveProvider("local");
      setActiveLocalModel(id);
    } else {
      setActiveProvider("vercel");
      setActiveVercelModel(id);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          class={cn("text-xs px-2 py-1 border rounded hover:opacity-100 opacity-80")}
          style={{ "border-color": currentBackground() }}
        >
          {triggerLabel()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="min-w-[320px] max-w-[520px]"
        style={{
          "background-color": secondaryBackground(),
          color: secondaryColor(),
          "border-color": currentBackground(),
        }}
      >
        <DropdownMenuLabel style={{ color: secondaryColor() }}>Select Model</DropdownMenuLabel>
        <DropdownMenuSeparator style={{ "background-color": currentBackground() }} />
        <div class="px-1 py-1">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <DropdownMenuGroup>
                <DropdownMenuGroupLabel class="opacity-80">Local</DropdownMenuGroupLabel>
                <div class="max-h-[50vh] overflow-y-auto pr-1">
                  <DropdownMenuRadioGroup value={currentValue()} onChange={handleChange}>
                    <For each={localModels()}>
                      {(m) => (
                        <DropdownMenuRadioItem value={`local:${m.id}`}>
                          <div class="truncate pr-2" title={m.name}>
                            {m.name}
                          </div>
                          <span class="opacity-70 ml-auto">Use</span>
                        </DropdownMenuRadioItem>
                      )}
                    </For>
                  </DropdownMenuRadioGroup>
                </div>
              </DropdownMenuGroup>
            </div>
            <div>
              <DropdownMenuGroup>
                <DropdownMenuGroupLabel class="opacity-80">Vercel</DropdownMenuGroupLabel>
                <div class="max-h-[50vh] overflow-y-auto pr-1">
                  <Show when={vercelReady()} fallback={<DropdownMenuItem>Not configured</DropdownMenuItem>}>
                    <Show when={!loading()} fallback={<DropdownMenuItem>Loading…</DropdownMenuItem>}>
                      <DropdownMenuRadioGroup value={currentValue()} onChange={handleChange}>
                        <For
                          each={
                            vercelModels().length ? vercelModels() : SUPPORTED_MODELS.map((id) => ({ id, name: id }))
                          }
                        >
                          {(m) => (
                            <DropdownMenuRadioItem value={`vercel:${m.id}`}>
                              <div class="truncate pr-2" title={m.name}>
                                {m.name}
                              </div>
                              <span class="opacity-70 ml-auto">Use</span>
                            </DropdownMenuRadioItem>
                          )}
                        </For>
                      </DropdownMenuRadioGroup>
                    </Show>
                  </Show>
                </div>
              </DropdownMenuGroup>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator style={{ "background-color": currentBackground() }} />
        <DropdownMenuItem class="opacity-70">
          Tip: set VERCEL_OIDC_TOKEN (or VITE_VERCEL_OIDC_TOKEN). You can also store it in localStorage/sessionStorage
          as VERCEL_OIDC_TOKEN for local dev.
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
