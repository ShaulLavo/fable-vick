import type { MLCEngineInterface } from '@mlc-ai/web-llm'
import { createSignal, createMemo } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import { dualStorage } from '../utils/DualStorage'

// Centralized LLM config and singletons (lazy)
const DEFAULT_LOCAL_MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC'
const DEFAULT_VERCEL_MODEL_ID = 'gpt-5'

let enginePromise: Promise<MLCEngineInterface> | null = null

async function createEngine(): Promise<MLCEngineInterface> {
  const { MLCEngine, modelLibURLPrefix, modelVersion } = await import('@mlc-ai/web-llm')
  const appConfig = {
    model_list: [
      {
        model: 'https://huggingface.co/mlc-ai/Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
        model_id: DEFAULT_LOCAL_MODEL_ID,
        model_lib: modelLibURLPrefix + modelVersion + '/Qwen2-1.5B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm'
      }
    ]
  }
  return new MLCEngine({ appConfig })
}

export function getEngine(): Promise<MLCEngineInterface> {
  if (!enginePromise) {
    enginePromise = createEngine()
  }
  return enginePromise
}

// Provider selection: 'local' (MLC) or 'vercel' (AI SDK Gateway)
export type LlmProvider = 'local' | 'vercel'

export const [provider, setProvider] = makePersisted(
	createSignal<LlmProvider>('local'),
	{ name: 'llmProvider', storage: dualStorage }
)

// Selected model ids for each provider
export const [localModelId, setLocalModelId] = makePersisted(
	createSignal<string>(DEFAULT_LOCAL_MODEL_ID),
	{ name: 'localModelId', storage: dualStorage }
)

export const [vercelModelId, setVercelModelId] = makePersisted(
	createSignal<string>(DEFAULT_VERCEL_MODEL_ID),
	{ name: 'vercelModelId', storage: dualStorage }
)

export const localModels = createMemo(() =>
	[{ id: DEFAULT_LOCAL_MODEL_ID, name: DEFAULT_LOCAL_MODEL_ID }]
)

// Update the active local model in the running engine-backed API
export function setActiveLocalModel(id: string) {
	setLocalModelId(id)
}

export function setActiveVercelModel(id: string) {
	setVercelModelId(id)
}

export function setActiveProvider(next: LlmProvider) {
	setProvider(next)
}

// Helper to get a simple suggestion from the global LLM
export async function llmSuggest(prompt: string): Promise<string> {
  const [{ default: ChatApi }] = await Promise.all([
    import('../components/Chat/ChatApi')
  ])
  const engine = await getEngine()
  const api = new ChatApi(engine, provider() === 'vercel' ? vercelModelId() : localModelId(), provider())
  return api.suggest(prompt)
}
