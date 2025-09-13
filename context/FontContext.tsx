import { makePersisted } from '@solid-primitives/storage'
import {
	Accessor,
	JSX,
	Setter,
	createContext,
	createEffect,
	createSignal,
	useContext
} from 'solid-js'
import { setCSSVariable } from '../utils/dom'

export const LOGO_FONT_FAMILY = `'Stylish BC'`

type FontCtx = {
	fontFamily: Accessor<string>
	setFontFamily: Setter<string>
	fontFamilyWithFallback: () => string
	fontSelection: Accessor<Record<string, string>>
	setFontSelection: Setter<Record<string, string>>
	availableFonts: Accessor<Record<string, FontFace>>
	setAvailableFonts: Setter<Record<string, FontFace>>
	baseFontSize: Accessor<number>
	setBaseFontSize: Setter<number>
}

const FontContext = createContext<FontCtx>()

export function FontProvider(props: { children: JSX.Element }) {
	const [fontFamily, setFontFamily] = makePersisted(
		createSignal<string>('JetBrains Mono'),
		{
			name: 'fontFamily'
		}
	)

	const [fontSelection, setFontSelection] = createSignal<
		Record<string, string>
	>({})
	const [availableFonts, setAvailableFonts] = createSignal<
		Record<string, FontFace>
	>({})

	const [baseFontSize, setBaseFontSize] = makePersisted(createSignal(16), {
		name: 'baseFontSize'
	})
	createEffect(() => {
		setCSSVariable('--font-family', fontFamily())
	})
	createEffect(() => {
		const fontSize = `${baseFontSize()}px`
		document.documentElement.style.fontSize = fontSize
	})
	const value: FontCtx = {
		fontFamily,
		setFontFamily,
		fontFamilyWithFallback: () => fontFamily() + ', monospace',
		fontSelection,
		setFontSelection,
		availableFonts,
		setAvailableFonts,
		setBaseFontSize,
		baseFontSize
	}

	return (
		<FontContext.Provider value={value}>{props.children}</FontContext.Provider>
	)
}

export function useFont() {
	const ctx = useContext(FontContext)
	if (!ctx) throw new Error('useFont must be used within a FontProvider')
	return ctx
}
