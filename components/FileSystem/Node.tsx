import { JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useFS } from '../../context/FsContext'
import { getNodeIcon } from '../../stores/icons'
import { FSNode } from '../../types/FS.types'
import { Span } from '../ui/Span'
import { Arrow } from './Arrow'

type OnClickEvent = JSX.EventHandlerUnion<
	HTMLSpanElement,
	MouseEvent,
	JSX.EventHandler<HTMLSpanElement, MouseEvent>
>

export const Node = (props: {
	node: FSNode
	onClick: OnClickEvent
	onDoubleClick?: OnClickEvent
	children: JSX.Element
	draggedNode: FSNode | null
	fontSize: number
}) => {
	const { currentNode } = useFS()

	const isCurrent = () => props.node.path === currentNode().path

	return (
		<div class="relative">
			<Arrow
				node={props.node}
				onClick={props.onClick}
				fontSize={props.fontSize}
			/>
			<Span
				fontSize={props.fontSize}
				selected={isCurrent()}
				enableHover={!props.draggedNode}
				onClick={props.onClick}
				onDblClick={props.onDoubleClick}
			>
				<span class="mr-2 pl-1">
					<Dynamic component={getNodeIcon(props.node)} size={props.fontSize} />
				</span>
				<span>{props.children}</span>
			</Span>
		</div>
	)
}
