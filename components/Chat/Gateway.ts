import type { GatewayModelId } from "@ai-sdk/gateway";

export const DEFAULT_MODEL = "gpt-5";

export const SUPPORTED_MODELS: GatewayModelId[] = [
  "amazon/nova-pro",
  "anthropic/claude-4-sonnet",
  "google/gemini-2.5-flash",
  "moonshotai/kimi-k2",
  "gpt-5",
  "xai/grok-3-fast",
];

export function isGatewayConfigured(): boolean {
  return true;
}

export async function getAvailableModels() {
  try {
    const res = await fetch("/api/ai/models");
    console.log("fetched models", res);
    if (!res.ok) throw new Error("Failed to fetch models");
    const data = (await res.json()) as { models: { id: string; name: string }[] };
    if (Array.isArray(data.models) && data.models.length > 0) return data.models;
  } catch (err) {
    console.warn("Model discovery failed; falling back to static list.", err);
  }
  return SUPPORTED_MODELS.map((id) => ({ id, name: id }));
}
