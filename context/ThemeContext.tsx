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
import { themeSettings } from '../consts/themeSettings'
import { getLighterRgbColor, getTransparentColor } from '../utils/color'
import { setCSSVariable } from '../utils/dom'
import type { Extension } from '@codemirror/state'
import { useFont } from './FontContext'

type ThemeKey = keyof typeof themeSettings
type ThemeSetting = (typeof themeSettings)[ThemeKey]

type ThemeCtx = {
	currentThemeName: Accessor<ThemeKey>
	setTheme: Setter<ThemeKey>
	currentTheme: Accessor<Extension[] | Extension>
	isDark: Accessor<boolean>
	currentColor: Accessor<string>
	currentBackground: Accessor<string>
	secondaryBackground: Accessor<string>
	secondaryColor: Accessor<string>
	bracketColors: Accessor<Record<string, string>>
	xTermTheme: Accessor<{
		background: string
		foreground: string
		cursor: string
	}>
	termColors: Accessor<{ color1: string; color2: string }>
	dragHandleColor: Accessor<string>
	themeSettings: typeof themeSettings
}

const ThemeContext = createContext<ThemeCtx>()

const [currentThemeName, setTheme] = makePersisted(
	createSignal<ThemeKey>('mojo'),
	{
		name: 'theme'
	}
)

const currentThemeSettings = () =>
	themeSettings[currentThemeName() ?? 'mojo'] ?? themeSettings.poimandres
const currentTheme = () => currentThemeSettings().theme
const isDark = () => currentThemeSettings().mode === 'dark'
export const currentColor = () => currentThemeSettings().color
export const currentBackground = () => currentThemeSettings().background
export const dragHandleColor = () => getLighterRgbColor(currentBackground(), 1)
export const secondaryColor = () => currentThemeSettings().secondaryColor
export const secondaryBackground = () => currentThemeSettings().secondaryBackground

export function ThemeProvider(props: { children: JSX.Element }) {
	const bracketColors = () => currentThemeSettings().rainbowBracket
	const xTermTheme = () =>
		currentThemeSettings().xTermTheme ?? {
			background: currentBackground(),
			foreground: currentColor(),
			cursor: currentColor()
		}
	const termColors = () => ({
		color1: currentThemeSettings().color1,
		color2: currentThemeSettings().color2
	})

	// Inject highlight.js CSS for the theme
	const style = document.createElement('style')
	document.head.appendChild(style)
	createEffect(async () => {
		const module = currentThemeSettings().hljsCss
		const { default: css } = await module()
		if (css) style.innerHTML = css
	})

	// Sync colorScheme on <html>
	createEffect(() => {
		document.documentElement.style.colorScheme = isDark() ? 'dark' : 'light'
		document.body.style.background = isDark() ? 'black' : 'white'
	})

	// Sync CSS vars dependent on theme and font
	const { fontFamilyWithFallback } = useFont()
	createEffect(() => {
		setCSSVariable('--font-family', fontFamilyWithFallback())
		setCSSVariable('--current-color', currentColor())
		setCSSVariable('--current-background', currentBackground())
		const bc = bracketColors()
		if (bc) {
			for (const [key, color] of Object.entries(bc)) {
				setCSSVariable('--rainbow-bracket-' + key, color as string)
			}
		}
	})

	const value: ThemeCtx = {
		currentThemeName,
		setTheme,
		currentTheme,
		isDark,
		currentColor,
		currentBackground,
		secondaryBackground,
		secondaryColor,
		bracketColors,
		xTermTheme,
		termColors,
		dragHandleColor,
		themeSettings
	}

	return (
		<ThemeContext.Provider value={value}>
			{props.children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
	return ctx
}

export type { ThemeKey, ThemeSetting }
