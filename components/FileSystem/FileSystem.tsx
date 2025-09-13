import { createPointerListeners } from '@solid-primitives/pointer'
import { createSignal, For } from 'solid-js'
import { EMPTY_NODE_NAME } from '../../consts/FS'
import { useFS } from '../../context/FsContext'
import { createInnerZoom } from '../../hooks/createInnerZoom'
import { useOPFS } from '../../hooks/useOPFS'
import Icon from '../ui/Icon'
import { useTheme } from '../../context/ThemeContext'
import { Span } from '../ui/Span'
import { FileSystemTree } from './FileSystemTree'
import { GlobalLoader, Loader } from '../GlobalLoader'
import { useAppState } from '../../context/AppStateContext'

interface FileSystemProps {}

export function FileSystem(props: FileSystemProps) {
	const { fs, addNode, removeNode, currentNode, beginRename } = useFS()
	const [editorContainer, setEditorContainer] = createSignal<HTMLDivElement>(
		null!
	)

	const [isHovered, setIsHovered] = createSignal(false)
	createPointerListeners({
		target: editorContainer,
		pointerTypes: ['touch', 'mouse'],
		onEnter: () => setIsHovered(true),
		onLeave: () => setIsHovered(false)
	})

	const { fontSize } = createInnerZoom({
		ref: editorContainer,
		key: 'explorer'
	})

	const { isFsLoading } = useAppState()
    const { secondaryColor, secondaryBackground } = useTheme()

	return (
		<div
			class="flex flex-col min-w-28 relative z-80 h-full min-h-0"
			ref={setEditorContainer}
			style={{
				'background-color': secondaryBackground(),
				color: secondaryColor()
				// 'z-index': 80,
				// position: 'relative'
			}}
		>
			<Loader
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				show={isFsLoading()}
			/>
			<div class="flex justify-between items-center px-2 shrink-0">
				{fs.name.toUpperCase()}
				<div class="flex items-center">
					<Span
						enableHover
						class="p-1"
						onClick={() => addNode({ name: EMPTY_NODE_NAME })}
						title="Add File"
					>
						<Icon icon="addFile" />
					</Span>
					<Span
						enableHover
						class="p-1"
						onClick={() => addNode({ name: EMPTY_NODE_NAME, children: [] })}
						title="Add Folder"
					>
						<Icon icon="addFolder" />
					</Span>
					<Span
						enableHover
						class="p-1"
						onClick={() => removeNode(currentNode())}
						title="Delete"
					>
						<Icon icon="trash" />
					</Span>
					<Span
						enableHover
						class="p-1"
						onClick={() => beginRename(currentNode())}
						title="Rename"
					>
						<Icon icon="rename" />
					</Span>
				</div>
			</div>
			<div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar">
				<For each={fs.children}>
					{node => (
						<FileSystemTree
							node={node}
							fontSize={fontSize()}
							isContainerHovered={isHovered()}
						/>
					)}
				</For>
			</div>
		</div>
	)
}
{
}
