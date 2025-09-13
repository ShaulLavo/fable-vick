import { IconProps } from 'solid-icons'
import { Show } from 'solid-js'
import { cn } from '../utils/cn'

export const Asci = (props: IconProps) => {
	return (
		<>
			<Show when={props.title}>{props.title}</Show>
			<span
				class={cn(`text-${props.size}xl`)}
				style={{ color: props.color, ...props.style }}
			>
				{props.children}
			</span>
		</>
	)
}
