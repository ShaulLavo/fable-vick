import { EditorView } from '@codemirror/view'
import { Annotation } from '@codemirror/state'
import {
	Accessor,
	Resource,
	Setter,
	createEffect,
	createMemo,
	createSignal,
	on
} from 'solid-js'

export function createEditorControlledValue(
	view: Accessor<EditorView | undefined>,
	code:
		| Accessor<string>
		| Resource<string | undefined>
		| (() => string | undefined)
): void {
	const memoizedCode = createMemo(code)

	createEffect(
		on(view, view => {
			if (!view) return
			createEffect(
				on(memoizedCode, code => {
					const localValue = view?.state.doc.toString()
					if (code === localValue) return
					// string cmpare unnotticeable up to 1k rows
					// need to implement a better way to compare large strings

					view.dispatch({
						changes: {
							from: 0,
							to: localValue?.length,
							insert: code ?? ''
						},
						annotations: [ProgrammaticChange.of(true)]
					})
				})
			)
		})
	)
}

export function createEditorControlledValueWithSkip(
	view: Accessor<EditorView | undefined>,
	code:
		| Accessor<string>
		| Resource<string | undefined>
		| (() => string | undefined)
): Setter<boolean> {
	const memoizedCode = createMemo(code)
	const [skip, setSkip] = createSignal(true)
	createEffect(
		on(view, view => {
			if (!view) return
			createEffect(
				on(memoizedCode, code => {
					if (!skip()) {
						setSkip(true)
						return
					}
					const localValue = view?.state.doc.toString()
					if (code === localValue) return
					// string cmpare unnotticeable up to 1k rows
					//TODO check with diffrenth lenghts
					//TODO implement a better way to compare large strings

					view.dispatch({
						changes: {
							from: 0,
							to: localValue?.length,
							insert: code ?? ''
						},
						annotations: [ProgrammaticChange.of(true)]
					})
				})
			)
		})
	)
	return setSkip
}

// Annotation to flag programmatic document changes that should not mark files dirty
export const ProgrammaticChange = Annotation.define<boolean>()
