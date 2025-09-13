import { createEffect, createSignal, onCleanup, Setter } from 'solid-js'
import { useFS } from '../../context/FsContext'
import { FSNode } from '../../types/FS.types'
import { Input } from '../ui/Input'
import { folderHas, getParent } from '../../service/FS.service'

export const NodeNameInput = (props: {
	node: FSNode
	parentEl?: HTMLElement
	editingValue: string
	isTemp: boolean
	isEditing: boolean
	setEditingValue: Setter<string>
	setIsEditing: Setter<boolean>
}) => {
	const { removeNode, updateNodeName, fs, cancelRename } = useFS()
	const [invalid, setInvalid] = createSignal(false)
	let inputRef: HTMLInputElement | undefined

	const finishEditing = () => {
		const trimmedName = props.editingValue.trim()
		if (!trimmedName) {
			if (props.isTemp) removeNode(props.node)
			props.setEditingValue('')
			props.setIsEditing(false)
			cancelRename()
		} else {
			// Prevent duplicate names in the same folder
			const parent = getParent(props.node, fs) ?? fs
			const exists = parent.children?.some(
				c => c.name === trimmedName && c.path !== props.node.path
			)
			if (exists) {
				setInvalid(true)
				// keep editing; do not close
				return
			}
			if (trimmedName !== props.node.name) {
				updateNodeName(props.node, trimmedName)
			}
			props.setEditingValue('')
			props.setIsEditing(false)
			cancelRename()
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') finishEditing()
		else if (e.key === 'Escape') {
			if (props.isTemp) removeNode(props.node)
			props.setEditingValue('')
			props.setIsEditing(false)
			cancelRename()
		}
	}
	createEffect(() => {
		if (props.isEditing) {
			const handler = (e: MouseEvent) => {
				if (props.parentEl && !props.parentEl.contains(e.target as Node)) {
					finishEditing()
				}
			}
			document.addEventListener('click', handler)
			onCleanup(() => document.removeEventListener('click', handler))
		}
	})

	// Auto-focus when entering edit mode (dynamic inputs may ignore autofocus)
	createEffect(() => {
		if (props.isEditing && inputRef) {
			queueMicrotask(() => {
				try {
					inputRef!.focus()
					inputRef!.select()
				} catch {}
			})
		}
	})

	// Clear validation state when value changes
	createEffect(() => {
		if (!props.isEditing) return
		const trimmed = props.editingValue.trim()
		const parent = getParent(props.node, fs) ?? fs
		const exists = parent.children?.some(
			c => c.name === trimmed && c.path !== props.node.path
		)
		setInvalid(Boolean(trimmed) && Boolean(exists))
	})

	return (
		<Input
			value={props.editingValue}
			onInput={e => props.setEditingValue(e.currentTarget.value)}
			onBlur={finishEditing}
			onKeyDown={handleKeyDown}
			onClick={e => e.stopPropagation()}
			ref={el => (inputRef = el)}
			autofocus
			aria-invalid={invalid() ? 'true' : undefined}
			variant="inline"
			style={{ width: 'fit-content' }}
		/>
	)
}
