import { useTheme } from '../context/ThemeContext'
const clamp = (value: number, min: number, max: number): number =>
	Math.max(min, Math.min(value, max))

export function rgbToHex(r: number, g: number, b: number) {
	return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null
}

export const getLighterRgbColor = (
	hex: string,
	alpha: number,
	factor = 0.3
): string => {
	const rgb = hexToRgb(hex)
	if (!rgb) return ''
	const validAlpha = clamp(alpha, 0, 1)
	const lighten = (channel: number): number =>
		clamp(Math.floor(channel + (255 - channel) * factor), 0, 255)
	return `rgba(${lighten(rgb.r)}, ${lighten(rgb.g)}, ${lighten(rgb.b)}, ${validAlpha})`
}

export const getDarkerRgbColor = (
	hex: string,
	alpha: number,
	factor = 0.7
): string => {
	const rgb = hexToRgb(hex)
	if (!rgb) return ''
	const validAlpha = clamp(alpha, 0, 1)
	const darken = (channel: number): number =>
		clamp(Math.floor(channel * factor), 0, 255)
	return `rgba(${darken(rgb.r)}, ${darken(rgb.g)}, ${darken(rgb.b)}, ${validAlpha})`
}

export const createColorCycler = () => {
	const { bracketColors } = useTheme()
	const colors = Object.values(bracketColors())
	let index = 0

	return () => {
		const color = colors[index]
		index = (index + 1) % colors.length // Cycle back to the start when reaching the end
		return color
	}
}
export const getTransparentColor = (hex: string, alpha: number): string => {
	const rgb = hexToRgb(hex)
	if (!rgb) return ''

	const validAlpha = clamp(alpha, 0, 1)
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${validAlpha})`
}
