import { toast } from 'solid-sonner'
import {
	currentColor,
	dragHandleColor,
	secondaryBackground
} from '../context/ThemeContext'

type ToastType = 'default' | 'info' | 'success' | 'warning' | 'error'

type ToastOpts = {
	duration?: number
	description?: string
	type?: ToastType
}

// Map toast type to a CSS variable that ThemeProvider keeps in sync with the current theme.
// These map to the theme's xTerm/rainbow bracket palette.
const typeToColorVar = (type: ToastType): string => {
	switch (type) {
		case 'info':
			return 'var(--rainbow-bracket-blue)'
		case 'success':
			return 'var(--rainbow-bracket-green)'
		case 'warning':
			return 'var(--rainbow-bracket-orange)'
		case 'error':
			return 'var(--rainbow-bracket-red)'
		case 'default':
		default:
			return 'var(--current-color)'
	}
}

const themedStyle = (type: ToastType = 'default') =>
	({
		'background-color': secondaryBackground(),
		color: currentColor(),
		border: `1px solid ${dragHandleColor()}`,
		// Top accent bar indicating the toast type
		'border-top': `4px solid ${typeToColorVar(type)}`,
		'box-shadow': `0 2px 8px rgba(0,0,0,0.15)`
	}) as const

export function themedToast(message: string, opts?: ToastOpts) {
	const type: ToastType = opts?.type ?? 'default'
	return toast(message, {
		duration: opts?.duration ?? 1500,
		description: opts?.description,
		style: themedStyle(type)
	})
}

// Convenience helpers for common types
export const toastInfo = (message: string, opts?: Omit<ToastOpts, 'type'>) =>
	themedToast(message, { ...opts, type: 'info' })

export const toastSuccess = (message: string, opts?: Omit<ToastOpts, 'type'>) =>
	themedToast(message, { ...opts, type: 'success' })

export const toastWarning = (message: string, opts?: Omit<ToastOpts, 'type'>) =>
	themedToast(message, { ...opts, type: 'warning' })

export const toastError = (message: string, opts?: Omit<ToastOpts, 'type'>) =>
	themedToast(message, { ...opts, type: 'error' })
