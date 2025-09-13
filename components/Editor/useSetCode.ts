import { EditorView } from '@codemirror/view'
import { createEditorControlledValueWithSkip } from '../../hooks/controlledValue'
import { debounce } from '../../utils/general'
import { Accessor } from 'solid-js'

export const useSetCode = (
	code: Accessor<string>,
	set: (code: string) => void,
	editorView: Accessor<EditorView | undefined>
) => {
	/* should reduce the amount of times editor updates */
	const skipSync = createEditorControlledValueWithSkip(editorView, code)
	const debouncedSetCurrentFileContent = debounce((content: string) => {
		skipSync(true)
		set(content)
	}, 300)
	const setCode = (code: string): void => {
		if (code === undefined) return
		debouncedSetCurrentFileContent(code)
	}
	return { setCode, skipSync }
}
