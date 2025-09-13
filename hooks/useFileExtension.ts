import { SYSTEM_PATHS } from '../consts/app'
import { useFS } from '../context/FsContext'
import { extensionMap, getConfigFromExt } from '../utils/format'

export const useFileExtension = () => {
	const { currentFile } = useFS()
	const filePath = () => currentFile()?.path ?? ''
	const currentExtension = () => filePath().split('.').pop()

	const isSystemPath = () => SYSTEM_PATHS.includes(filePath())


    // TS or JS family, for enabling language features & worker sync
	const isTs = () =>
		['typescript', 'javascript'].includes(
			extensionMap[currentExtension() as keyof typeof extensionMap]
		)

	// Specifically JavaScript variants, useful to relax linting
	const isJs = () => ['js', 'jsx', 'mjs', 'cjs'].includes(currentExtension()!)

	// Specifically TypeScript variants
	const isTypeScriptOnly = () =>
		['ts', 'tsx', 'dts'].includes(currentExtension()!)

    const isPython = () =>
        extensionMap[currentExtension() as keyof typeof extensionMap] === 'python'
    const isGo = () => currentExtension() === 'go'
	const isCSS = () => ['css', 'scss', 'sass'].includes(currentExtension()!)
	const isJSON = () =>
		extensionMap[currentExtension() as keyof typeof extensionMap] === 'json'
	const isHtml = () =>
		['html', 'htm', 'svg', 'xml'].includes(currentExtension()!)
	const isBinary = () =>
		['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'tiff', 'tif'].includes(
			currentExtension()!
		)
	const isImage = () =>
		['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'tiff', 'tif'].includes(
			currentExtension()!
		)
	const prettierConfig = () => getConfigFromExt(currentExtension())

    return {
        isTs,
        isJs,
        isTypeScriptOnly,
        isPython,
        isGo,
        isJSON,
        isHtml,
        currentExtension,
        prettierConfig,
        isSystemPath,
		isBinary,
		isImage,
		isCSS
	}
}
