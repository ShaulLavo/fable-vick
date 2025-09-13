import Resizable from '@corvu/resizable'
import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { ResizableHandle, ResizablePanel } from '../ui/Resizable'
import { Editor } from './Editor'
import { EditorNav } from './EditorNav'
import { EditorTabs } from './EditorTabs'
import BinaryFileViewer from '../BinaryFileViewer'
import ImageViewer from '../ImageViewer'
import { useFS } from '../../context/FsContext'
import { useFileExtension } from '../../hooks/useFileExtension'
import { file } from 'opfs-tools'
import { useTheme } from '../../context/ThemeContext'
import { useAppState } from '../../context/AppStateContext'
import Icon from '../ui/Icon'
import { cn } from '../../utils/cn'
import { useCurrentFile } from '../../hooks/useCurrentFile'

export default function EditorArea() {
	return (
		<Resizable orientation="horizontal" class="w-full h-full min-h-0">
			<EditorLayout />
		</Resizable>
	)
}

interface EditorLayoutProps {
	extraKeyBindings?: Record<string, () => boolean>
}

function EditorLayout(_props: EditorLayoutProps) {
    const { isZenMode, setIsZenMode, updateEditorPanelSize } = useAppState()
    const { currentBackground, dragHandleColor, secondaryColor } = useTheme()
	const { isBinary, isImage } = useFileExtension()
	const { currentFile } = useFS()
	const [fileBuffer, setFileBuffer] = createSignal<Uint8Array>()
	createEffect(async () => {
		if (isBinary() || isImage()) {
			setFileBuffer(
				new Uint8Array(await file(currentFile()?.path!).arrayBuffer())
			)
		}
	})
	const [editorPanels, setEditorPanels] = createSignal([
		{ id: 1, content: 'Editor 1' }
	])
	const [editorSizes, setEditorSizes] = createSignal([1, 1])

	const addEditorPanel = () => {
		const newPanelId = editorPanels().length + 1
		setEditorPanels([
			...editorPanels(),
			{ id: newPanelId, content: `Editor ${newPanelId}` }
		])
		const newSize = 1 / (editorPanels().length + 1)
		setEditorSizes([...Array(editorPanels().length + 1).fill(newSize)])
	}

	return (
		<Resizable
			class="w-full"
			onSizesChange={newSizes => {
				if (newSizes.length === editorPanels().length) {
					setEditorSizes(newSizes)
					updateEditorPanelSize(0, newSizes)
				}
			}}
			style={{
				'background-color': currentBackground(),
				color: secondaryColor()
			}}
			orientation="horizontal"
			accessKey="horizontal"
		>
			<For each={editorPanels()}>
				{(panel, index) => (
					<>
						<ResizablePanel
							class="overflow-hidden"
							initialSize={editorSizes()[index()]}
						>
							<div class="flex flex-1 justify-between">
								<EditorTabs index={index()} />
								<div
									class="flex items-center px-1"
									style={{ background: currentBackground() }}
								>
									<button onClick={() => setIsZenMode(!isZenMode())}>
										<Icon icon="zen" />
									</button>
								</div>
							</div>

							<EditorNav index={index()} />

							<Show when={isBinary()}>
								<BinaryFileViewer fileData={fileBuffer()} />
							</Show>
							<Show when={isImage()}>
								<ImageViewer fileData={fileBuffer()} />
							</Show>

							<div class={cn({ hidden: isBinary() })}>
								<Editor index={index()} />
							</div>
						</ResizablePanel>
						{index() < editorPanels().length - 1 && <ResizableHandle />}
					</>
				)}
			</For>
		</Resizable>
	)
}
