import type { MLCEngineInterface } from '@mlc-ai/web-llm'
import { createContext, useContext, type JSX, type Accessor } from 'solid-js'
import { createSignal, createMemo } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import { dualStorage } from '../utils/DualStorage'

const DEFAULT_LOCAL_MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC'
const DEFAULT_VERCEL_MODEL_ID = 'gpt-5'

export type LlmProvider = 'local' | 'vercel'

type LlmContextValue = {
  provider: Accessor<LlmProvider>
  setProvider: (p: LlmProvider | ((p: LlmProvider) => LlmProvider)) => void
  localModelId: Accessor<string>
  setLocalModelId: (id: string) => void
  vercelModelId: Accessor<string>
  setVercelModelId: (id: string) => void
  localModels: Accessor<{ id: string; name: string }[]>
  getEngine: () => Promise<MLCEngineInterface>
  llmSuggest: (prompt: string) => Promise<string>
  setActiveLocalModel: (id: string) => void
  setActiveVercelModel: (id: string) => void
  setActiveProvider: (p: LlmProvider) => void
}

const LlmContext = createContext<LlmContextValue>()

export function LlmProvider(props: { children: JSX.Element }) {
  let enginePromise: Promise<MLCEngineInterface> | null = null

  async function createEngine(): Promise<MLCEngineInterface> {
    const { MLCEngine, modelLibURLPrefix, modelVersion } = await import('@mlc-ai/web-llm')
    const appConfig = {
      model_list: [
        {
          model: 'https://huggingface.co/mlc-ai/Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
          model_id: DEFAULT_LOCAL_MODEL_ID,
          model_lib:
            modelLibURLPrefix + modelVersion + '/Qwen2-1.5B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm'
        }
      ]
    }
    return new MLCEngine({ appConfig })
  }

  const getEngine = () => {
    if (!enginePromise) enginePromise = createEngine()
    return enginePromise
  }

  const [provider, setProvider] = makePersisted(createSignal<LlmProvider>('local'), {
    name: 'llmProvider',
    storage: dualStorage
  })

  const [localModelId, setLocalModelId] = makePersisted(
    createSignal<string>(DEFAULT_LOCAL_MODEL_ID),
    { name: 'localModelId', storage: dualStorage }
  )

  const [vercelModelId, setVercelModelId] = makePersisted(
    createSignal<string>(DEFAULT_VERCEL_MODEL_ID),
    { name: 'vercelModelId', storage: dualStorage }
  )

  const localModels = createMemo(() => [{ id: DEFAULT_LOCAL_MODEL_ID, name: DEFAULT_LOCAL_MODEL_ID }])

  function setActiveLocalModel(id: string) {
    setLocalModelId(id)
  }
  function setActiveVercelModel(id: string) {
    setVercelModelId(id)
  }
  function setActiveProvider(p: LlmProvider) {
    setProvider(p)
  }

  async function llmSuggest(prompt: string): Promise<string> {
    const [{ default: ChatApi }] = await Promise.all([import('../components/Chat/ChatApi')])
    const engine = await getEngine()
    const api = new ChatApi(engine, provider() === 'vercel' ? vercelModelId() : localModelId(), provider())
    return api.suggest(prompt)
  }

  const value: LlmContextValue = {
    provider,
    setProvider,
    localModelId,
    setLocalModelId,
    vercelModelId,
    setVercelModelId,
    localModels,
    getEngine,
    llmSuggest,
    setActiveLocalModel,
    setActiveVercelModel,
    setActiveProvider
  }

  return <LlmContext.Provider value={value}>{props.children}</LlmContext.Provider>
}

export function useLlm() {
  const ctx = useContext(LlmContext)
  if (!ctx) throw new Error('useLlm must be used within a LlmProvider')
  return ctx
}

