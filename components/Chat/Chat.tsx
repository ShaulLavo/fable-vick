import {
	children,
	For,
	ParentComponent,
	Show,
	createEffect,
	createSignal,
	onMount
} from 'solid-js'
import ChatInner from './ChatInner'
import { useTheme } from '../../context/ThemeContext'
import { useAppState } from '../../context/AppStateContext'
import { cn } from '../../utils/cn'
import { useLlm } from '../../context/LlmContext'
import { TabChip } from '../ui/TabChip'
import { useFS } from '../../context/FsContext'
import { getNode } from '../../service/FS.service'
import ChatModelDropdown from './ChatModelDropdown'
import { StickToBottom } from '../StickToBottom'

export type Message = {
	id: number
	content: string
	role: 'user' | 'assistant'
}
export const Chat = () => {
    const { isStatusBar } = useAppState()
    const { currentBackground } = useTheme()
	const [api, setApi] = createSignal<any>(null)

	const { getEngine, provider, localModelId, vercelModelId } = useLlm()

	const loadApi = async () => {
		const [{ default: ChatApi }] = await Promise.all([import('./ChatApi')])
		const eng = await getEngine()
		const prov = provider()
		const model = prov === 'vercel' ? vercelModelId() : localModelId()
		setApi(new ChatApi(eng, model, prov))
	}

	// Load once on mount (deferred to idle), and refresh if provider/model changes
	onMount(() => {
		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(() => void loadApi())
		} else {
			setTimeout(() => void loadApi(), 0)
		}
	})
	createEffect(() => {
		// react to provider/model changes
		void provider()
		void localModelId()
		void vercelModelId()
		void loadApi()
	})
	const { fs, setCurrentNode } = useFS()
	return (
		<div
			class={cn('flex flex-col h-full min-h-0 relative flex-1', {})}
			style={{ 'background-color': currentBackground() }}
		>
			<Show
				when={api()}
				fallback={<div class="p-3 opacity-80 text-sm">Loading chat…</div>}
			>
				<ChatInner api={api()!} />
			</Show>
		</div>
	)
}
