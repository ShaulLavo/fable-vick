import { JSX, ParentComponent } from 'solid-js'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/Resizable'
import { useAppState } from '../../context/AppStateContext'
import { useTheme } from '../../context/ThemeContext'

export const ChatLayout: ParentComponent<{
	chat: JSX.Element
	side?: 'left' | 'right'
}> = props => {
	const { ChatPanelSize, setChatPanelSize } = useAppState()
	const side = () => props.side ?? 'right'
    const { secondaryBackground, secondaryColor } = useTheme()
	return (
		<div
			class="w-full h-full flex flex-1"
			style={{ background: secondaryBackground(), color: secondaryColor() }}
		>
			<Resizable
				sizes={ChatPanelSize()}
				onSizesChange={size => {
					if (size.length !== 2) return
					if (size[0] === 50) return
					setChatPanelSize(size)
				}}
				class="w-full h-full flex"
				orientation="horizontal"
			>
				{side() === 'left' ? (
					<>
						<ResizablePanel
							class="overflow-hidden border-none h-full"
							initialSize={ChatPanelSize()[1]}
							id="chat-area"
						>
							<div class="flex flex-col h-full min-h-0">{props.chat}</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel
							class="overflow-hidden h-full"
							initialSize={ChatPanelSize()[0]}
							id="content-area"
						>
							{props.children}
						</ResizablePanel>
					</>
				) : (
					<>
						<ResizablePanel
							class="overflow-hidden border-none h-full"
							initialSize={ChatPanelSize()[0]}
							id="content-area"
						>
							{props.children}
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel
							class="overflow-hidden h-full"
							initialSize={ChatPanelSize()[1]}
							id="chat-area"
						>
							<div class="flex flex-col h-full min-h-0">{props.chat}</div>
						</ResizablePanel>
					</>
				)}
			</Resizable>
		</div>
	)
}
