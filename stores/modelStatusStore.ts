import { createSignal } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'

// Transient status for model initialization/loading
// Not persisted by default except for last loaded model id for tooltip context.

export const [isModelLoading, setIsModelLoading] = createSignal(false)
export const [modelLoadPercent, setModelLoadPercent] = createSignal<number>(0)
export const [modelStatusText, setModelStatusText] = createSignal<string>('')

// For tooltip/UI context
export const [lastModelId, setLastModelId] = makePersisted(createSignal<string>(''), {
  name: 'lastModelId'
})

export function resetModelStatus() {
  setIsModelLoading(false)
  setModelLoadPercent(0)
  setModelStatusText('')
}

