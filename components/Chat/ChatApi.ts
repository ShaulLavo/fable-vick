import { MLCEngine, MLCEngineInterface, ChatCompletionMessageParam, CompletionUsage } from "@mlc-ai/web-llm";
import type { GatewayModelId } from "@ai-sdk/gateway";

// Local JSONValue type to avoid depending on the 'ai' package for types only.
// If you add the 'ai' package, you can switch to: `import type { JSONValue } from 'ai'`.
type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | { [key: string]: JSONValue } | JSONValue[];

// -------- Backend AI integration (via Hono routes) --------

export enum Models {
  AmazonNovaPro = "amazon/nova-pro",
  AnthropicClaude4Sonnet = "anthropic/claude-4-sonnet",
  GoogleGeminiFlash = "google/gemini-2.5-flash",
  MoonshotKimiK2 = "moonshotai/kimi-k2",
  OpenAIGPT5 = "gpt-5",
  XaiGrok3Fast = "xai/grok-3-fast",
}

export const DEFAULT_MODEL = Models.OpenAIGPT5;

export const SUPPORTED_MODELS: GatewayModelId[] = [
  Models.AmazonNovaPro,
  Models.AnthropicClaude4Sonnet,
  Models.GoogleGeminiFlash,
  Models.MoonshotKimiK2,
  Models.OpenAIGPT5,
  Models.XaiGrok3Fast,
];

export const TEST_PROMPTS = [
  "Generate a Next.js app that allows to list and search Pokemons",
  'Create a `golang` server that responds with "Hello World" to any request',
];

export type ChatProvider = "local" | "vercel";

export default class ChatApi {
  private engine: MLCEngineInterface;
  private modelId: string;
  private provider: ChatProvider;
  private chatLoaded = false;
  private requestInProgress = false;
  private chatRequestChain: Promise<void> = Promise.resolve();
  private chatHistory: ChatCompletionMessageParam[] = [];

  constructor(engine: MLCEngineInterface, modelId: string, provider: ChatProvider = "local") {
    this.engine = engine;
    this.modelId = modelId;
    this.provider = provider;
  }

  async onGenerate(
    prompt: string,
    messageUpdate: (kind: string, text: string, append: boolean) => void,
    setRuntimeStats: (runtimeStats: string) => void,
    options?: { system?: string },
  ) {
    if (this.requestInProgress) {
      return;
    }
    this.pushTask(async () => {
      await this.asyncGenerate(prompt, messageUpdate, setRuntimeStats, options);
    });
    return this.chatRequestChain;
  }

  async onReset(clearMessages: () => void) {
    if (this.requestInProgress) {
      this.engine.interruptGenerate();
    }
    this.chatHistory = [];
    this.pushTask(async () => {
      await this.engine.resetChat();
      clearMessages();
    });
    return this.chatRequestChain;
  }

  async asyncInitChat(messageUpdate: (kind: string, text: string, append: boolean) => void) {
    if (this.chatLoaded) return;
    this.requestInProgress = true;
    messageUpdate("init", "", true);

    if (this.provider === "local") {
      const initProgressCallback = (report: { text: string }) => {
        messageUpdate("init", report.text, false);
      };
      this.engine.setInitProgressCallback(initProgressCallback);
      try {
        await this.engine.reload(this.modelId);
      } catch (err: unknown) {
        messageUpdate("error", "Init error, " + (err?.toString() ?? ""), true);
        console.log(err);
        await this.unloadChat();
        this.requestInProgress = false;
        return;
      }
    } else {
      // Vercel gateway requires no heavy local initialization.
      messageUpdate("init", "Using Vercel AI Gateway…", false);
    }

    this.requestInProgress = false;
    this.chatLoaded = true;
  }

  private async unloadChat() {
    if (this.provider === "local") {
      await this.engine.unload();
    }
    this.chatLoaded = false;
  }

  private pushTask(task: () => Promise<void>) {
    const lastEvent = this.chatRequestChain;
    this.chatRequestChain = lastEvent.then(task);
  }

  private async asyncGenerate(
    prompt: string,
    messageUpdate: (kind: string, text: string, append: boolean) => void,
    setRuntimeStats: (runtimeStats: string) => void,
    options?: { system?: string },
  ) {
    await this.asyncInitChat(messageUpdate);
    this.requestInProgress = true;

    if (prompt === "") {
      this.requestInProgress = false;
      return;
    }

    messageUpdate("right", prompt, true);
    messageUpdate("left", "", true);

    try {
      this.chatHistory.push({ role: "user", content: prompt });
      let curMessage = "";
      let usage: CompletionUsage | undefined = undefined;
      const messages = (
        options?.system
          ? [
              {
                role: "system",
                content: options.system,
              } as ChatCompletionMessageParam,
            ]
          : []
      ).concat(this.chatHistory);

      if (this.provider === "local") {
        const completion = await this.engine.chat.completions.create({
          stream: true,
          messages,
          stream_options: { include_usage: true },
        });
        for await (const chunk of completion) {
          const curDelta = chunk.choices[0]?.delta.content;
          if (curDelta) {
            curMessage += curDelta;
          }
          messageUpdate("left", curMessage, false);
          if (chunk.usage) {
            usage = chunk.usage;
          }
        }
        const output = await this.engine.getMessage();
        this.chatHistory.push({ role: "assistant", content: output });
        messageUpdate("left", output, false);
        if (usage) {
          const runtimeStats =
            `prompt_tokens: ${usage.prompt_tokens}, ` +
            `completion_tokens: ${usage.completion_tokens}, ` +
            `prefill: ${usage.extra.prefill_tokens_per_s.toFixed(4)} tokens/sec, ` +
            `decoding: ${usage.extra.decode_tokens_per_s.toFixed(4)} tokens/sec`;
          setRuntimeStats(runtimeStats);
        }
      } else {
        // Vercel Gateway path via our backend Hono route
        const res = await fetch("/api/ai/stream", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages, modelId: this.modelId, system: options?.system }),
        });
        console.log("AI stream response", res);
        if (!res.ok || !res.body) throw new Error("AI stream request failed");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;
          const chunk = decoder.decode(value);
          if (chunk) {
            curMessage += chunk;
            messageUpdate("left", curMessage, false);
          }
        }
        this.chatHistory.push({ role: "assistant", content: curMessage });
      }
    } catch (err: unknown) {
      messageUpdate("error", "Generate error, " + (err?.toString() ?? ""), true);
      console.log(err);
      await this.unloadChat();
    }
    this.requestInProgress = false;
  }

  /**
   * Get a one-off suggestion without affecting chat history.
   * Useful for editor inline completions.
   */
  async suggest(prompt: string): Promise<string> {
    await this.asyncInitChat(() => {});
    try {
      if (this.provider === "local") {
        const completion = await this.engine.chat.completions.create({
          stream: false,
          messages: [{ role: "user", content: prompt }],
        });
        const choice: any = completion.choices?.[0];
        // Web-LLM returns message.content for non-streaming responses
        const content = choice?.message?.content ?? "";
        return typeof content === "string" ? content : "";
      } else {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt, modelId: this.modelId }),
        });
        if (!res.ok) return "";
        const data = (await res.json()) as { text?: string };
        return data.text ?? "";
      }
    } catch (err) {
      console.error("LLM suggest error:", err);
      return "";
    }
  }
}
