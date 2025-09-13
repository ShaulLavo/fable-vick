import type { Accessor } from 'solid-js'
import { ANSI, fgFromHex } from './utils'
import { NodeRuntime } from './node/runtime'
import { runCommand } from './commands/cli'

type TermLike = {
	write: (s: string) => void
	writeln: (s: string) => void
	reset: () => void
}

export class TerminalController {
	private term: TermLike
	private cwd = '/home/web/app'
	private lineBuffer = ''
	private history: string[] = []
	private histIdx = -1
	private nodeMode = false
	private node: NodeRuntime
    private currentColor: Accessor<string>

	constructor(term: TermLike, currentColor: Accessor<string>) {
		this.term = term
		this.currentColor = currentColor
		this.node = new NodeRuntime({
			writeln: (s: string) => this.writeln(s),
			reset: () => this.term.reset()
		})
	}

	intro() {
		this.writeln('OPFS Terminal — type "help" to start')
		this.prompt()
	}

	private prompt() {
		const promptColor = fgFromHex(this.currentColor())
		const pfx = this.nodeMode ? 'node' : this.cwd
		this.term.write(
			`\r\n${promptColor}${pfx}${ANSI.reset} ${ANSI.dim}>${ANSI.reset} `
		)
	}

	private write(text: string) {
		this.term.write(text.replace(/\n/g, '\r\n'))
	}

	private writeln(text: string) {
		this.term.writeln(text ?? '')
	}

	private redrawInput() {
		const promptColor = fgFromHex(this.currentColor())
		const pfx = this.nodeMode ? 'node' : this.cwd
		this.term.write(
			`\x1b[2K\r${promptColor}${pfx}${ANSI.reset} ${ANSI.dim}>${ANSI.reset} ${this.lineBuffer}`
		)
	}

	private setCwd = (v: string) => {
		this.cwd = v
	}

	handleData = (data: string) => {
		// Enter
		if (data === '\r' || data === '\n') {
			const current = this.lineBuffer
			this.history.push(current)
			this.histIdx = -1
			this.lineBuffer = ''
			this.writeln('')
			if (this.nodeMode) {
				if (current.trim() === '.exit') {
					this.nodeMode = false
					this.node.resetRepl()
					this.writeln('Leaving Node REPL.')
					this.prompt()
				} else {
					if (this.node.handleReplSpecials(current)) {
						this.prompt()
					} else {
						this.node.runNodeEval(current, this.cwd)
						this.prompt()
					}
				}
			} else {
				runCommand(current, {
					cwd: this.cwd,
					setCwd: this.setCwd,
					io: {
						write: (s: string) => this.write(s),
						writeln: (s?: string) => this.writeln(s ?? ''),
						reset: () => this.term.reset()
					},
					node: this.node
				})
					.then(res => {
						if (res && res.enterNodeRepl) {
							this.nodeMode = true
						}
					})
					.finally(() => this.prompt())
			}
			return
		}
		// Backspace
		if (data === '\x7F') {
			if (this.lineBuffer.length > 0) {
				this.lineBuffer = this.lineBuffer.slice(0, -1)
				this.term.write('\b \b')
			}
			return
		}
		// Up arrow
		if (data === '\x1b[A') {
			if (!this.history.length) return
			if (this.histIdx < 0) this.histIdx = this.history.length - 1
			else this.histIdx = Math.max(0, this.histIdx - 1)
			this.lineBuffer = this.history[this.histIdx] ?? ''
			this.redrawInput()
			return
		}
		// Down arrow
		if (data === '\x1b[B') {
			if (!this.history.length) return
			if (this.histIdx < 0) return
			this.histIdx = Math.min(this.history.length - 1, this.histIdx + 1)
			this.lineBuffer = this.history[this.histIdx] ?? ''
			this.redrawInput()
			return
		}
		// Printable
		if (data >= ' ' && !data.startsWith('\x1b')) {
			this.lineBuffer += data
			this.write(data)
			return
		}
	}
}
