import { Component, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useFS } from '../../context/FsContext'
import { getNodeIcon } from '../../stores/icons'
import { useTheme } from '../../context/ThemeContext'
import { getNode } from '../../service/FS.service'
import { dirNameIconMap, fileExtIconMap } from '../../consts/icons'

interface EditorNavProps {
	index: number
}
export const EditorNav: Component<EditorNavProps> = ({ index }) => {
    const { currentColor, secondaryColor } = useTheme()
	const { currentFile, fs } = useFS()
	const buttons = () => currentFile()?.path?.split('/').filter(Boolean)

	const getIcon = (index: number) => {
		const parts = buttons()
		if (!parts || index < 0 || index >= parts.length) {
			return dirNameIconMap['base']
		}
		const reconstructedPath = parts.slice(0, index + 1).join('/')
		const n = getNode(fs, reconstructedPath)
		if (!n) return dirNameIconMap['base']
		return getNodeIcon(n)
	}

	return (
		<div class="flex px-1 gap-1 text-xs overflow-x-auto whitespace-nowrap">
			<For each={buttons()}>
				{(part, index) => (
					<span class="flex items-center">
						<div class="pr-1">
							<Dynamic component={getIcon(index())} />
						</div>
						<button
							class="text-xs"
							style={{
								color:
									index() === buttons?.()!.length - 1
										? secondaryColor()
										: currentColor()
							}}
							onClick={() => {
								/* noop */
							}}
						>
							{part + (index() === buttons?.()!.length - 1 ? '' : ' >')}
						</button>{' '}
					</span>
				)}
			</For>
		</div>
	)
}
