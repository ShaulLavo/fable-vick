import { createSignal, onMount } from 'solid-js'
import Icon from '../ui/Icon'
import { Button } from '../ui/Button'
import { useTheme } from '../../context/ThemeContext'

interface ChatInputProps {
	value: string
	onInput: (
		e: InputEvent & {
			currentTarget: HTMLTextAreaElement
			target: HTMLTextAreaElement
		}
	) => void
	onSend: () => void
}

export function ChatInput(props: ChatInputProps) {
	const [isFocused, setIsFocused] = createSignal(false)
	const { currentBackground, currentColor, secondaryColor } = useTheme()
	let inputRef: HTMLTextAreaElement = null!

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			props.onSend()
		}
	}

	onMount(() => {
		if (inputRef) {
			inputRef.focus()
		}
	})

	return (
		<div
			class="border-t p-3 shrink-0"
			style={{
				'border-color': currentBackground()
			}}
		>
			<div
				class={`flex items-center rounded-lg border`}
				style={{
					'border-color': isFocused() ? currentColor() : currentBackground()
				}}
			>
				<textarea
					ref={inputRef}
					value={props.value}
					onInput={props.onInput}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="Type a message..."
					class="flex-1 p-2 bg-transparent outline-none resize-none min-h-[40px]"
					rows="1"
				/>
				<Button
					onClick={props.onSend}
					disabled={!props.value.trim()}
					class={`p-2 rounded-r-lg ${
						props.value.trim() ? '' : ' cursor-not-allowed'
					}`}
					style={{
						color: props.value.trim() ? currentColor() : secondaryColor()
					}}
				>
					<Icon icon="send" />
				</Button>
			</div>
		</div>
	)
}
