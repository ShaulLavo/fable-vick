import type { Context } from "hono";
import { createGatewayProvider, type GatewayModelId } from "@ai-sdk/gateway";
import { generateText, streamText } from "ai";
import { env } from "../env";

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | { [key: string]: JSONValue } | JSONValue[];

// Keep model IDs in sync with client enum
const Models = {
  AmazonNovaPro: "amazon/nova-pro",
  AnthropicClaude4Sonnet: "anthropic/claude-4-sonnet",
  GoogleGeminiFlash: "google/gemini-2.5-flash",
  MoonshotKimiK2: "moonshotai/kimi-k2",
  OpenAIGPT5: "gpt-5",
  XaiGrok3Fast: "xai/grok-3-fast",
} as const;

type ModelOptions = {
  model: string;
  providerOptions?: Record<string, Record<string, JSONValue>>;
  headers?: Record<string, string>;
};

function getModelOptions(modelId: string, options?: { reasoningEffort?: "low" | "medium" }): ModelOptions {
  if (modelId === Models.OpenAIGPT5) {
    return {
      model: modelId,
      providerOptions: {
        openai: {
          include: ["reasoning.encrypted_content"],
          reasoningEffort: options?.reasoningEffort ?? "low",
          reasoningSummary: "auto",
          serviceTier: "priority",
        },
      },
    };
  }

  if (modelId === Models.AnthropicClaude4Sonnet) {
    return {
      model: modelId,
      headers: { "anthropic-beta": "fine-grained-tool-streaming-2025-05-14" },
      providerOptions: {
        anthropic: {
          cacheControl: { type: "ephemeral" },
        },
      },
    };
  }

  return { model: modelId };
}

// GET /api/ai/models -> list available models from gateway
export const aiModelsHandler = async (_c: Context) => {
  const { VERCEL_OIDC_TOKEN } = env;
  if (!VERCEL_OIDC_TOKEN) {
    return new Response(JSON.stringify({ models: [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  const gateway = createGatewayProvider({ apiKey: VERCEL_OIDC_TOKEN });
  try {
    const response = await gateway.getAvailableModels();
    return new Response(JSON.stringify({ models: response.models.map((m) => ({ id: m.id, name: m.name })) }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    // Return empty so client can fallback
    return new Response(JSON.stringify({ models: [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
};

// POST /api/ai/generate -> one-off text generation (no streaming)
export const aiGenerateHandler = async (c: Context) => {
  try {
    const { VERCEL_OIDC_TOKEN } = env;
    if (!VERCEL_OIDC_TOKEN) {
      return new Response(JSON.stringify({ error: "Gateway not configured" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const { prompt, modelId, system }: { prompt: string; modelId: GatewayModelId; system?: string } = await c.req.json();
    if (!prompt || !modelId) {
      return new Response(JSON.stringify({ error: "Missing prompt or modelId" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const gateway = createGatewayProvider({ apiKey: VERCEL_OIDC_TOKEN });
    const extra = getModelOptions(modelId);
    const { text } = await generateText({
      model: gateway(modelId),
      prompt: system ? `${system}\n\n${prompt}` : prompt,
      ...(extra.providerOptions ? { providerOptions: extra.providerOptions } : {}),
      ...(extra.headers ? { headers: extra.headers } : {}),
    });
    return new Response(JSON.stringify({ text: text ?? "" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Generate failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

// POST /api/ai/stream -> streaming chat completion
export const aiStreamHandler = async (c: Context) => {
  try {
    const { VERCEL_OIDC_TOKEN } = env;
    if (!VERCEL_OIDC_TOKEN) {
      return new Response("Gateway not configured", { status: 400 });
    }
    const body = await c.req.json();
    const { messages, modelId, system } = body as {
      messages: Array<{ role: string; content: string }>;
      modelId: GatewayModelId;
      system?: string;
    };
    if (!Array.isArray(messages) || !modelId) {
      return new Response("Missing messages or modelId", { status: 400 });
    }
    const allMessages = (
      system
        ? ([{ role: "system", content: system }] as { role: string; content: string }[])
        : ([] as { role: string; content: string }[])
    ).concat(messages);

    const gateway = createGatewayProvider({ apiKey: VERCEL_OIDC_TOKEN });
    const extra = getModelOptions(modelId);
    const { textStream } = streamText({
      model: gateway(modelId),
      messages: allMessages as any,
      ...(extra.providerOptions ? { providerOptions: extra.providerOptions } : {}),
      ...(extra.headers ? { headers: extra.headers } : {}),
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const delta of textStream) {
            if (typeof delta === "string" && delta.length > 0) {
              controller.enqueue(encoder.encode(delta));
            }
          }
        } catch (e) {
          // Best-effort error emission
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-cache",
        connection: "keep-alive",
        // Transfer-encoding is set automatically by the platform
      },
    });
  } catch (err) {
    return new Response("Stream failed", { status: 500 });
  }
};
