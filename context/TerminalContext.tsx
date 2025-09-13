import { createSignal, createContext, useContext, type JSX } from 'solid-js'
import type { Terminal as XTerm } from '@xterm/xterm'
import type { FitAddon } from '@xterm/addon-fit'
import { createElementBounds } from '@solid-primitives/bounds'
import type { TerminalController } from '../components/Terminal/controller'

type TerminalContextValue = {
	terminalContainer: () => HTMLDivElement | undefined
	setTerminalContainer: (el: HTMLDivElement) => void

	terminal: () => XTerm | undefined
	setTerminal: (t: XTerm) => void

	fitAddon: () => FitAddon | undefined
	setFitAddon: (f: FitAddon) => void

	terminalController: () => TerminalController | null
	setTerminalController: (c: TerminalController | null) => void

	terminalBounds: ReturnType<typeof createElementBounds>
}

const TerminalContext = createContext<TerminalContextValue>()

export function TerminalProvider(props: { children: JSX.Element }) {
	const [terminalContainer, setTerminalContainer] =
		createSignal<HTMLDivElement>()
	const [terminal, setTerminal] = createSignal<XTerm>()
	const [fitAddon, setFitAddon] = createSignal<FitAddon>()
	const [terminalController, setTerminalController] =
		createSignal<TerminalController | null>(null)

	const terminalBounds = createElementBounds(() => terminalContainer()!)

	const value: TerminalContextValue = {
		terminalContainer,
		setTerminalContainer,
		terminal,
		setTerminal,
		fitAddon,
		setFitAddon,
		terminalController,
		setTerminalController,
		terminalBounds
	}

	return (
		<TerminalContext.Provider value={value}>
			{props.children}
		</TerminalContext.Provider>
	)
}

export function useTerminal() {
	const ctx = useContext(TerminalContext)
	if (!ctx)
		throw new Error('useTerminal must be used within a TerminalProvider')
	return ctx
}
