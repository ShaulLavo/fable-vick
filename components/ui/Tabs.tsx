import { createSignal, For, JSX, Show } from 'solid-js'
import { useTheme } from '../../context/ThemeContext'

type Tab = {
	id: string
	icon: JSX.Element
	label: string
	content: () => JSX.Element
}

type TabsProps = {
	tabs: Tab[]
	defaultTabId?: string
	className?: string
}

export function Tabs(props: TabsProps) {
	const {
		currentBackground,
		currentColor,
		secondaryBackground,
		secondaryColor
	} = useTheme()
	const [activeTabId, setActiveTabId] = createSignal(
		props.defaultTabId || props.tabs[0]?.id
	)
	const currentTab = () => props.tabs.find(tab => tab.id === activeTabId())

	return (
		<div class={`w-full h-full flex flex-col min-h-0 ${props.className || ''}`}>
			<div
				class="flex flex-col shrink-0 "
				style={{ 'background-color': secondaryBackground() }}
			>
				<div class="flex space-x-2 pb-1">
					<For each={props.tabs}>
						{tab => (
							<button
								class={`flex flex-col items-center px-3 py-2 rounded-t-lg transition-colors duration-200`}
								style={{
									'background-color':
										activeTabId() === tab.id
											? currentBackground()
											: secondaryBackground(),
									'border-bottom':
										activeTabId() === tab.id
											? `2px solid ${currentColor()}`
											: '2px solid transparent'
								}}
								onClick={() => setActiveTabId(tab.id)}
								aria-selected={activeTabId() === tab.id}
								role="tab"
							>
								<div
									class={`text-xl mb-1`}
									style={{
										color:
											activeTabId() === tab.id
												? currentColor()
												: secondaryColor()
									}}
								>
									{tab.icon}
								</div>
							</button>
						)}
					</For>
				</div>
				<div class="text-xs font-medium">{currentTab()?.label}</div>
			</div>

			<div class="flex-1 min-h-0 overflow-hidden">
				<For each={props.tabs}>
					{tab => (
						<div
							role="tabpanel"
							aria-hidden={activeTabId() !== tab.id}
							class={`${activeTabId() === tab.id ? 'block h-full' : 'hidden'}`}
							style={{ height: '100%' }}
						>
							<div class="h-full flex flex-col min-h-0">
								<Show when={activeTabId() === tab.id}>{tab.content()}</Show>
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	)
}
