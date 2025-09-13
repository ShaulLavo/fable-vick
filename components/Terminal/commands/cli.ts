import { NodeRuntime } from '../node/runtime'
import { cmdLs, cmdCd } from './fs'
import { resolvePath } from '../utils'

export type TerminalIO = {
	write: (s: string) => void
	writeln: (s?: string) => void
	reset: () => void
}

export type ShellContext = {
	cwd: string
	setCwd: (v: string) => void
	io: TerminalIO
	node: NodeRuntime
}

export type RunResult = { enterNodeRepl?: boolean }

export async function runCommand(
	input: string,
	ctx: ShellContext
): Promise<RunResult | void> {
	const trimmed = input.trim()
	if (!trimmed) return
	const [cmd, ...args] = trimmed.split(/\s+/)
	switch (cmd) {
		case 'npm': {
			const { runNpmBrowser } = await import('../npm/runNpm')
			await runNpmBrowser(args, ctx.cwd, ctx.io)
			break
		}
		case 'ls':
			await cmdLs(args, ctx.cwd, ctx.io)
			break
		case 'cd': {
			const next = await cmdCd(args, ctx.cwd, ctx.io)
			ctx.setCwd(next)
			break
		}
		case 'pwd':
			ctx.io.writeln(ctx.cwd)
			break
		case 'node': {
			if (args[0] === '-e') {
				const code = args.slice(1).join(' ')
				const unquoted = code.replace(/^['\"]|['\"]$/g, '')
				ctx.node.runNodeScript(unquoted, '<eval>', ctx.cwd)
			} else if (args[0]) {
				const scriptPath = resolvePath(ctx.cwd, args[0])
				const { statPath } = await import('../../../service/OPFS.service')
				const st = await statPath(scriptPath)
				if (!st) {
					ctx.io.writeln(`node: cannot open file ${args[0]}: No such file`)
					break
				}
				if (st.isFile) {
					await ctx.node.runNodeProgram(scriptPath)
				} else {
					// Directory: resolve entry
					await ctx.node.runNodeProgram(scriptPath)
				}
			} else {
				ctx.io.writeln('Entering Node REPL. Type .exit to leave.')
				return { enterNodeRepl: true }
			}
			break
		}
		case 'help':
			ctx.io.writeln('Supported: ls, cd, pwd, help, clear, node, npm')
			break
		case 'clear':
			ctx.io.reset()
			break
		default:
			ctx.io.writeln(`${cmd}: command not found`)
	}
}
