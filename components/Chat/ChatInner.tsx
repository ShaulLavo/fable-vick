import { For, Show } from 'solid-js'
import { useChat } from './useChat'
import type ChatApi from './ChatApi'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { Loader } from '../GlobalLoader'
import { useFS } from '../../context/FsContext'
import { getNode } from '../../service/FS.service'
import { TabChip } from '../ui/TabChip'
import ChatModelDropdown from './ChatModelDropdown'
import { StickToBottom } from '../StickToBottom'
import { useTheme } from '../../context/ThemeContext'
import { useAppState } from '../../context/AppStateContext'

export default function ChatInner(props: { api: ChatApi }) {
	const { panelGap } = useAppState()
	const { fs, setCurrentNode } = useFS()
    const { currentBackground } = useTheme()

	const {
		messages,
		inputValue,
		setInputValue,
		sendMessage,
		isLoading,
		formattedMessages,
		includeTabContext,
		setIncludeTabContext,
		currentTabLabel
	} = useChat(props.api)

	return (
		<>
			<Loader
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				show={isLoading()}
			/>
			<div
				class="p-3 flex justify-between items-center border-b shrink-0"
				style={{
					'border-color': currentBackground(),
					'border-width': panelGap() + 'px'
				}}
			>
				<ChatModelDropdown />
			</div>
			<StickToBottom class="flex-1 min-h-0" initial="instant">
				{ctx => (
					<StickToBottom.Content class="p-1 space-y-4">
						<For each={messages}>
							{(message, i) => (
								<div>
									<ChatMessage
										message={message}
										formattedMessages={formattedMessages}
										index={i()}
									/>
								</div>
							)}
						</For>
					</StickToBottom.Content>
				)}
			</StickToBottom>
			<Show when={includeTabContext() && currentTabLabel()}>
				<div class="px-3 pb-1 flex items-center gap-2 text-xs opacity-90">
					<TabChip
						path={currentTabLabel()!}
						selected={false}
						onClose={() => setIncludeTabContext(false)}
						onClick={() => {
							const node = getNode(fs, currentTabLabel()!) ?? fs
							setCurrentNode(node)
						}}
					/>
				</div>
			</Show>
			<ChatInput
				value={inputValue()}
				onInput={e => setInputValue(e.target.value)}
				onSend={() => sendMessage(inputValue())}
			/>
		</>
	)
}
