import { FitAddon } from '@xterm/addon-fit'
import { Terminal as XTerm } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { createEffect, onCleanup, onMount } from 'solid-js'
import { useFont } from '../../context/FontContext'
import { useTerminal } from '../../context/TerminalContext'
import { useTheme } from '../../context/ThemeContext'
import { TerminalController } from './controller'

type Props = { class?: string }

export function Terminal(props: Props) {
	const { fontFamilyWithFallback } = useFont()
	const { xTermTheme, currentColor } = useTheme()
	const {
		setFitAddon,
		setTerminal,
		setTerminalContainer,
		setTerminalController,
		terminal,
		terminalContainer
	} = useTerminal()
	onMount(async () => {
		const term = new XTerm({
			fontFamily: fontFamilyWithFallback(),
			cursorBlink: true,
			allowProposedApi: true,
			scrollback: 5000,
			theme: xTermTheme()
		})
		setTerminal(term)
		const fit = new FitAddon()
		setFitAddon(fit)
		term.loadAddon(fit)
		term.open(terminalContainer()!)
		queueMicrotask(() => fit.fit())
		const ro = new ResizeObserver(() => fit.fit())
		ro.observe(terminalContainer()!)

		const controller = new TerminalController(term, currentColor)
		setTerminalController(controller)
		const disp = term.onData(d => controller!.handleData(d))
		controller.intro()

		onCleanup(() => {
			disp.dispose()
			ro.disconnect()
			term.dispose()
			setTerminalController(null)
		})
	})

	createEffect(() => {
		terminal() && (terminal()!.options.theme = xTermTheme())
	})
	createEffect(() => {
		terminal() && (terminal()!.options.fontFamily = fontFamilyWithFallback())
	})

	return (
		<div
			ref={setTerminalContainer}
			class={`w-full h-full min-h-[120px] rounded-md  overflow-hidden ${
				props.class ?? ''
			}`}
		/>
	)
}
