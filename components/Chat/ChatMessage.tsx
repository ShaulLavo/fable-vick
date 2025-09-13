import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'
import { Message } from './Chat'

interface ChatMessageProps {
	message: Message
	formattedMessages: string[]
	index: number
}

export function ChatMessage(props: ChatMessageProps) {
	const { secondaryBackground, secondaryColor } = useTheme()
	const isUser = () => props.message.role === 'user'

	return (
		<div class={`flex ${isUser() ? 'justify-end' : 'justify-start'}`}>
			<div
				class={cn(`max-w-[90%] rounded-lg p-3`, {
					'max-w-[90%]': isUser()
				})}
				style={{
					// 'background-color': secondaryBackground(),
					color: secondaryColor()
				}}
				innerHTML={props.formattedMessages[props.index]}
			/>
		</div>
	)
}
