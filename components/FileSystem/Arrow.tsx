import { JSX } from 'solid-js'
import { FSNode, isFolder } from '../../types/FS.types'
import Icon from '../ui/Icon'
import { useTheme } from '../../context/ThemeContext'

export const Arrow = (props: {
	node: FSNode
	onClick: JSX.EventHandlerUnion<
		HTMLSpanElement,
		MouseEvent,
		JSX.EventHandler<HTMLSpanElement, MouseEvent>
	>
	fontSize: number
}) => {
    const { secondaryBackground } = useTheme()
	if (props.node.path === '/' || !isFolder(props.node)) return null
	return (
		<span
			class="absolute top-1 cursor-pointer select-none  min-w-4"
			onClick={props.onClick}
			style={{
				'background-color': secondaryBackground(),
				left: `-${props.fontSize + 4}px`
			}}
		>
			{props.node.isOpen ? (
				<Icon icon="chevronDown" size={props.fontSize} />
			) : (
				<Icon icon="chevronRight" size={props.fontSize} />
			)}
		</span>
	)
}
