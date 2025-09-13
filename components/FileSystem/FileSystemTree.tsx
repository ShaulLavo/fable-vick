import {
	batch,
	Component,
	createEffect,
	createSignal,
	For,
	on,
	Show
} from 'solid-js'

import { isDev } from 'solid-js/web'
import { EMPTY_NODE_NAME } from '../../consts/FS'
import { useFS } from '../../context/FsContext'
import { useFsDnd } from '../../hooks/useFsDnd'
import { Folder, FSNode, isFolder } from '../../types/FS.types'
import { cn } from '../../utils/cn'
import { NodeNameInput } from './NameInput'
import { Node } from './Node'
import { ThemeKey, useTheme } from '../../context/ThemeContext'
import { getLighterRgbColor } from '../../utils/color'
import { ContextMenuItem, useContextMenu } from '../../context/ContextMenu'
import { SYSTEM_PATHS } from '../../consts/app'
import { viewTransition } from '../../utils/viewTransition'
import { processPasaclCase } from '../../utils/text'

export interface FileSystemTreeProps {
	node: FSNode
	parent?: Folder
	fontSize: number
	isContainerHovered: boolean
}

export const FileSystemTree: Component<FileSystemTreeProps> = props => {
	if (!isDev && SYSTEM_PATHS.includes(props.node.path)) return null
	const { bracketColors, currentThemeName, isDark, setTheme, themeSettings } =
		useTheme()

	const {
		setCurrentFolder,
		setIsOpen,
		setCurrentNode,
		fs,
		updateNodeName,
		removeNode,
		beginRename,
		editingPath
	} = useFS()

	const {
		setDraggable,
		setDropzone,
		dropzone,
		isDraggedOver,
		isDragged,
		draggedNode
	} = useFsDnd(props.node)

	const { showContextMenu } = useContextMenu()

	const isTemp = () => props.node.name === EMPTY_NODE_NAME
	const [isEditing, setIsEditing] = createSignal(isTemp())
	// Enter edit mode if this node is globally marked for rename
	createEffect(
		on(editingPath, path => {
			setIsEditing(isTemp() || path === props.node.path)
		})
	)
	const [editingValue, setEditingValue] = createSignal('')
	// Populate input when entering edit mode
	createEffect(() => {
		if (isEditing()) {
			setEditingValue(isTemp() ? '' : props.node.name)
		}
	})

	const onClick = (e: MouseEvent) => {
		e.stopPropagation()
		const node = props.node
		batch(() => {
			if (isFolder(node)) {
				setIsOpen(node, !node.isOpen)
				setCurrentFolder(node)
			} else {
				if (props.parent) setCurrentFolder(props.parent)
			}
			setCurrentNode(node)
		})
	}
	const getLineColor = () => {
		const colorByDepth =
			Object.values(bracketColors())[
				(props.node.path.split('/').length - 1) % 7
			]
		const alpha = isDark() ? 0.25 : 0.5
		return getLighterRgbColor(colorByDepth, alpha)
	}

	const themes = Object.keys(themeSettings).map(theme => {
		return {
			label: processPasaclCase(theme),
			action: () => {
				setTheme(theme as ThemeKey)
			},
			onHover: () => {
				if (currentThemeName() === theme) return
				viewTransition(() => {
					setTheme(theme as ThemeKey)
				})
			}
		}
	})

	const contextMenu: ContextMenuItem[] = [
		{
			label: 'Rename...',
			action: () => {
				setIsEditing(true)
				setEditingValue(props.node.name)
				beginRename(props.node)
			}
		},
		{
			label: 'Delete',
			action: () => {
				removeNode(props.node)
			}
		},
		,
		{
			label: 'New File',
			action: () => {
				console.log('New File')
			}
		},
		{ label: 'themes', subMenuItems: themes }
	]
	const onDoubleClick = (e: MouseEvent) => {
		e.stopPropagation()
		setEditingValue(props.node.name)
		setIsEditing(true)
		beginRename(props.node)
	}

	return (
		<div
			ref={setDropzone}
			onContextMenu={e => {
				showContextMenu(e, contextMenu)
			}}
			class={cn(
				'relative px-1 rounded select-none box-content transition duration-200 ease-in-out',
				{
					'bg-blue-100/30': isDraggedOver(),
					'opacity-70': isDragged()
				}
			)}
		>
			<span ref={setDraggable}>
				<Node
					node={props.node}
					onClick={onClick}
					onDoubleClick={onDoubleClick}
					draggedNode={draggedNode()}
					fontSize={props.fontSize!}
				>
					{isEditing() ? (
						<NodeNameInput
							parentEl={dropzone()}
							editingValue={editingValue()}
							isEditing={isEditing()}
							isTemp={isTemp()}
							node={props.node}
							setEditingValue={setEditingValue}
							setIsEditing={setIsEditing}
						/>
					) : (
						props.node.name
					)}
				</Node>
			</span>

			<div
				class={cn(
					'border-l box-border transition duration-200 ease-in-out',
					'pl-1 ml-1',
					{}
				)}
				style={{
					'margin-left': `${props.fontSize / 2}px `,
					'padding-left': `${props.fontSize / 2}px `,
					'border-color': props.isContainerHovered
						? getLineColor()
						: 'transparent'
				}}
			>
				<Show when={isFolder(props.node) && props.node.isOpen}>
					<For each={isFolder(props.node) && props.node.children}>
						{child => (
							<FileSystemTree
								node={child}
								parent={props.node as Folder}
								fontSize={props.fontSize}
								isContainerHovered={props.isContainerHovered}
							/>
						)}
					</For>
				</Show>
			</div>
		</div>
	)
}
