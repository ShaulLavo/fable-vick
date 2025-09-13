import { createEffect, createSignal, on } from 'solid-js'
import { makeEventListenerStack } from '@solid-primitives/event-listener'

interface UseDnDProps {
	onDragStart?: (event: DragEvent) => void
	onDrop?: (event: DragEvent) => void
	onDragOver?: (event: DragEvent) => void
	onDragEnter?: (event: DragEvent) => void
	onDragLeave?: (event: DragEvent) => void
	onDragEnd?: (event: DragEvent) => void
}

export function useDnD(props: UseDnDProps) {
	const [draggable, setDraggable] = createSignal<HTMLElement>(null!)
	const [dropzone, setDropzone] = createSignal<HTMLElement>(null!)

	const handleDragStart = (event: DragEvent) => {
		props.onDragStart?.(event)
	}

	const handleDragEnd = (event: DragEvent) => {
		props.onDragEnd?.(event)
	}
	const handleDrop = (event: DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		props.onDrop?.(event)
	}

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault()
		props.onDragOver?.(event)
	}

	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault()
		props.onDragEnter?.(event)
	}

	const handleDragLeave = (event: DragEvent) => {
		props.onDragLeave?.(event)
	}

	createEffect(
		on(dropzone, zone => {
			if (!zone) return
			const [listenDropzone] = makeEventListenerStack(zone, {})
			listenDropzone('drop', handleDrop)
			listenDropzone('dragover', handleDragOver)
			listenDropzone('dragenter', handleDragEnter)
			listenDropzone('dragleave', handleDragLeave)
		})
	)

	createEffect(
		on(draggable, el => {
			if (!el) return
			el.setAttribute('draggable', 'true')
			const [listenDraggable] = makeEventListenerStack(el, {})
			listenDraggable('dragstart', handleDragStart)
			listenDraggable('dragend', handleDragEnd)
		})
	)

	return { setDraggable, setDropzone, dropzone, draggable }
}
