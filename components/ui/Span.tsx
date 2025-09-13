import { createEffect, JSX, splitProps } from 'solid-js'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'
import { useFS } from '../../context/FsContext'
import { FSNode } from '../../types/FS.types'
import { useFont } from '../../context/FontContext'

type SpanProps = JSX.IntrinsicElements['span'] & {
	selected?: boolean
	enableHover?: unknown
	fontSize?: number
}

export const Span = (props: SpanProps) => {
    const { fontFamilyWithFallback } = useFont()
    const { isDark } = useTheme()
    const [local, others] = splitProps(props, [
		'selected',
		'enableHover',
		'fontSize',
		'class',
		'style',
		'children'
	])

	return (
		<span
			class={cn(
				'cursor-pointer flex items-center rounded',
				{
					'bg-gray-700/5': local.selected,
					'bg-gray-100/5': isDark() && local.selected,
					'hover:bg-gray-900/5': local.enableHover,
					'hover:bg-gray-200/5': isDark() && local.enableHover
				},
				local.class
			)}
			style={{
				'font-size': local.fontSize ? `${local.fontSize}px` : undefined,
				'font-family': fontFamilyWithFallback(),
				'view-transition-name': 'none',
				...(typeof local.style === 'object' && local.style !== null
					? local.style
					: {})
			}}
			{...others}
		>
			{local.children}
		</span>
	)
}
