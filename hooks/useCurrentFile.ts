import { Accessor, createMemo } from 'solid-js'
import { File } from '../types/FS.types'
import { useFileExtension } from './useFileExtension'
import { formatter, getConfigFromExt } from '../utils/format'

export const useCurrentFile = (
	currentFile: Accessor<File | null>,
	openFiles: Map<string, string>
) => {
	const currentExtension = () => currentFile()?.path.split('.').pop()
	const currentFileContent = createMemo(() => {
		const file = currentFile()
		if (!file) return ''
		return openFiles.get(file.path) ?? ''
	})

	const setCurrentFileContent = async (content: string, format = false) => {
		const file = currentFile()
		if (!file) return
		let code = content
		if (format && currentExtension()) {
			const c = await formatter()(content, getConfigFromExt(currentExtension()))
			code = c.formatted
		}
		openFiles.set(file.path, code)
	}

	return { currentFileContent, setCurrentFileContent }
}
