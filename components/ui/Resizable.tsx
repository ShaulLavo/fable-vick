import type { ValidComponent } from 'solid-js'
import {
	createEffect,
	createSignal,
	onCleanup,
	Show,
	splitProps
} from 'solid-js'

import type { DynamicProps, HandleProps, RootProps } from '@corvu/resizable'
import ResizablePrimitive, { usePanelContext } from '@corvu/resizable'

import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'
import { useAppState } from '../../context/AppStateContext'
import { style } from 'solid-js/web'
import { getTransparentColor } from '../../utils/color'

type ResizableProps<T extends ValidComponent = 'div'> = RootProps<T> & {
	class?: string
}

const Resizable = <T extends ValidComponent = 'div'>(
	props: DynamicProps<T, ResizableProps<T>>
) => {
	const [, rest] = splitProps(props as ResizableProps, ['class'])

	return (
		<ResizablePrimitive
			class={cn(
				'flex size-full data-[orientation=vertical]:flex-col',
				props.class
			)}
			{...rest}
		/>
	)
}

const ResizablePanel = ResizablePrimitive.Panel

type ResizableHandleProps<T extends ValidComponent = 'button'> =
	HandleProps<T> & {
		class?: string
		withHandle?: boolean
	}
type Orientation = 'horizontal' | 'vertical'

function createOrientationRef(set: (o: Orientation) => void) {
	let el: HTMLElement | null = null
	let mo: MutationObserver | null = null

	const read = () => {
		if (!el) return
		const v = el.dataset.orientation as Orientation | undefined
		set(v === 'vertical' ? 'vertical' : 'horizontal')
	}

	onCleanup(() => {
		if (mo) mo.disconnect()
		mo = null
		el = null
	})

	return (node: HTMLElement | null) => {
		// cleanup old observer if ref changes
		if (mo) {
			mo.disconnect()
			mo = null
		}
		el = node
		if (!el) return

		read()
		queueMicrotask(read)

		mo = new MutationObserver(muts => {
			for (const m of muts) {
				if (m.type === 'attributes' && m.attributeName === 'data-orientation') {
					read()
				}
			}
		})
		mo.observe(el, { attributes: true, attributeFilter: ['data-orientation'] })
	}
}
const ResizableHandle = <T extends ValidComponent = 'button'>(
	props: DynamicProps<T, ResizableHandleProps<T>>
) => {
	const { panelGap } = useAppState()
	const [, rest] = splitProps(props as ResizableHandleProps, [
		'class',
		'withHandle',
		'style'
	])
	const { currentColor } = useTheme()
	const [orientation, setOrientation] = createSignal<Orientation>('horizontal')
	const orientationRef = createOrientationRef(setOrientation)

	const isVertical = () => orientation() === 'vertical'

	return (
		<ResizablePrimitive.Handle
			class={cn(
				'z-50 relative flex w-px shrink-0 items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0 [&[data-orientation=vertical]>div]:rotate-90',
				props.class
			)}
			style={{
				'background-color': getTransparentColor(currentColor(), 0),
				...(!isVertical() && { width: panelGap() + 'px' }),
				...(isVertical() && { height: panelGap() + 'px' })
				// 'border-radius': -panelGap() + 'px'
			}}
			ref={orientationRef}
			{...rest}
		>
			<Show when={props.withHandle}>
				<div class="z-50 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-2.5"
					>
						<path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
						<path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
						<path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
						<path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
						<path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
						<path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
					</svg>
				</div>
			</Show>
		</ResizablePrimitive.Handle>
	)
}

export { Resizable, ResizablePanel, ResizableHandle }
