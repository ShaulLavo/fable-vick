import vm from 'vm'
import fs from '../../../node/FS'
import path from 'path'
import os from 'os'
import util from 'util'
import url from 'url'
import assert from 'assert'
import buffer from 'buffer'
import stream from 'stream'
import tty from 'tty'
import zlib from 'zlib'
import crypto from 'crypto'
import events from 'events'
import timers from 'timers'
import timersPromises from 'timers/promises'
import {
	list as opfsList,
	statPath as opfsStatPath,
	readText as opfsReadText
} from '../../../service/OPFS.service'
import { normalizePath } from '../utils'

export type NodeIO = {
	writeln: (s: string) => void
	reset: () => void
}

type ModuleCacheEntry = {
	code?: string
	exports?: any
	evaluated?: boolean
	type: 'js' | 'json'
}

export class NodeRuntime {
	private nodeCtx: any = null
	private moduleCache: Record<string, ModuleCacheEntry> = {}
	private io: NodeIO

	constructor(io: NodeIO) {
		this.io = io
	}

	resetRepl() {
		this.nodeCtx = null
	}

	private getModuleMap() {
		return {
			fs,
			path,
			os,
			util,
			url,
			assert,
			buffer,
			stream,
			tty,
			zlib,
			crypto,
			events,
			timers,
			'timers/promises': timersPromises
		} as Record<string, any>
	}

	private makeConsole() {
		const writeLn = (prefix: string, args: any[]) => {
			try {
				const text = args
					.map(a =>
						typeof a === 'string'
							? a
							: util
								? util.inspect(a, { colors: false })
								: String(a)
					)
					.join(' ')
				this.io.writeln(`${prefix}${text}`)
			} catch (e) {
				this.io.writeln(prefix + String(e))
			}
		}
		return {
			log: (...args: any[]) => writeLn('', args),
			info: (...args: any[]) => writeLn('', args),
			warn: (...args: any[]) => writeLn('', args),
			error: (...args: any[]) => writeLn('', args),
			dir: (...args: any[]) => writeLn('', args)
		}
	}

	private makeRequire(baseDir: string) {
		return (spec: string) => {
			const clean = spec.replace(/^node:/, '')
			const map = this.getModuleMap()
			if (map[clean]) return map[clean]
			// During direct eval, we don't support loading OPFS modules synchronously.
			if (spec.startsWith('.') || spec.startsWith('/')) {
				throw new Error(
					`Synchronous require not available in REPL. Use 'node <file>' to run modules.`
				)
			}
			throw new Error(
				`Cannot require '${spec}' (only core modules supported here)`
			)
		}
	}

	private createNodeContext(baseDir: string, filename = '<repl>') {
		const sandbox: Record<string, any> = Object.create(null)
		const req = this.makeRequire(baseDir)
		const mod = { exports: {} }
		Object.assign(sandbox, {
			global: undefined,
			GLOBAL: undefined,
			root: undefined,
			console: this.makeConsole(),
			require: req,
			module: mod,
			exports: mod.exports,
			__dirname: baseDir,
			__filename: filename,
			process: { ...globalThis.process, cwd: () => baseDir },
			Buffer: globalThis.Buffer,
			setTimeout,
			clearTimeout,
			setInterval,
			clearInterval
		})
		sandbox.global = sandbox
		sandbox.GLOBAL = sandbox
		sandbox.root = sandbox
		return vm.createContext(sandbox)
	}

	runNodeScript(code: string, filename: string, baseDir: string) {
		try {
			const c = this.createNodeContext(baseDir, filename)
			try {
				// @ts-ignore
				delete c.Infinity
				// @ts-ignore
				delete c.NaN
				// @ts-ignore
				delete c.undefined
			} catch {}
			const wrapper = `((exports, require, module, __filename, __dirname) => {\n${code}\n})`
			const fn = vm.runInContext(wrapper, c, { filename }) as unknown as (
				e: any,
				r: any,
				m: any,
				f: string,
				d: string
			) => void
			const req = c.require ?? this.makeRequire(baseDir)
			const mod = c.module ?? { exports: {} }
			fn(mod.exports, req, mod, filename, baseDir)
		} catch (e: any) {
			this.io.writeln(String(e?.message || e))
		}
	}

	private transformReplInput(src: string): string {
		const s = src.trim()
		const fn = s.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(\)/)
		if (fn)
			return s.replace(
				/^function\s+([A-Za-z_$][\w$]*)\s*\(/,
				`globalThis.${fn[1]} = function ${fn[1]}(`
			)
		const cls = s.match(/^class\s+([A-Za-z_$][\w$]*)\b/)
		if (cls)
			return s.replace(
				/^class\s+([A-Za-z_$][\w$]*)\b/,
				`globalThis.${cls[1]} = class ${cls[1]}`
			)
		if (/^(const|let|var)\s+/.test(s)) {
			const rest = s.replace(/^(const|let|var)\s+/, '')
			if (/[\[{]/.test(rest)) return s
			const parts = rest.split(',')
			const assigns = parts
				.map(p => {
					const m = p.trim().match(/^([A-Za-z_$][\w$]*)\s*(?:=\s*(.+))?$/)
					if (!m) return null
					const name = m[1]
					const rhs = m[2] ?? 'undefined'
					return `globalThis.${name} = ${rhs}`
				})
				.filter(Boolean) as string[]
			if (assigns.length) return assigns.join('; ')
			return s
		}
		return s
	}

	runNodeEval(line: string, baseDir: string) {
		if (!line.trim()) return
		try {
			if (!this.nodeCtx)
				this.nodeCtx = this.createNodeContext(baseDir, '<repl>')
			try {
				// @ts-ignore
				delete this.nodeCtx.Infinity
				// @ts-ignore
				delete this.nodeCtx.NaN
				// @ts-ignore
				delete this.nodeCtx.undefined
			} catch {}
			const code = this.transformReplInput(line)
			const result = vm.runInContext(code, this.nodeCtx, { filename: '<repl>' })
			if (typeof result !== 'undefined') {
				try {
					this.io.writeln(util.inspect(result, { colors: false }))
				} catch {
					this.io.writeln(String(result))
				}
			}
		} catch (e: any) {
			this.io.writeln(String(e?.message || e))
		}
	}

	// ---- Minimal module runner for 'node <file>' ----

	private async resolveEntryFromDir(dir: string): Promise<string | null> {
		try {
			const pkgPath = dir.replace(/\/$/, '') + '/package.json'
			const s = await opfsStatPath(pkgPath)
			if (s && s.isFile) {
				const txt = await opfsReadText(pkgPath)
				const pkg = JSON.parse(txt)
				const cand = pkg.module || pkg.main
				if (typeof cand === 'string') {
					const p = normalizePath(path.join(dir, cand))
					const r = await this.resolveAsFileOrDir(p)
					if (r) return r
				}
			}
		} catch {}
		return (await this.resolveAsFileOrDir(path.join(dir, 'index'))) || null
	}

	private async resolveAsFileOrDir(p: string): Promise<string | undefined> {
		const s1 = await opfsStatPath(p)
		if (s1?.isFile) return p
		if (s1 && !s1.isFile)
			return (await this.resolveEntryFromDir(p)) ?? undefined
		for (const ext of ['.ts', '.js', '.json']) {
			const s = await opfsStatPath(p + ext)
			if (s?.isFile) return p + ext
		}
		return undefined
	}

	private isRelative(spec: string) {
		return (
			spec.startsWith('./') || spec.startsWith('../') || spec.startsWith('/')
		)
	}

	private async getTS() {
		// @ts-ignore dynamic import
		const ts = await import('typescript')
		return ts
	}

	private async buildGraph(entry: string) {
		const visited = new Set<string>()
		const pending: string[] = [entry]
		while (pending.length) {
			const file = pending.pop()!
			if (visited.has(file)) continue
			visited.add(file)
			const st = await opfsStatPath(file)
			if (!st || !st.isFile) continue
			if (file.endsWith('.json')) {
				const txt = await opfsReadText(file)
				this.moduleCache[file] = {
					type: 'json',
					exports: JSON.parse(txt),
					evaluated: true
				}
				continue
			}
			const src = await opfsReadText(file)
			const ts = await this.getTS()
			const out = ts.transpileModule(src, {
				compilerOptions: {
					target: ts.ScriptTarget.ES2020,
					module: ts.ModuleKind.CommonJS,
					esModuleInterop: true,
					allowJs: true
				},
				fileName: file
			})
			this.moduleCache[file] = {
				type: 'js',
				code: out.outputText,
				evaluated: false
			}
			const deps = new Set<string>()
			const reqRe = /require\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/g
			const impRe = /import\s+(?:[^'\"]+from\s+)?['\"]([^'\"]+)['\"]/g
			let m: RegExpExecArray | null
			while ((m = reqRe.exec(src))) deps.add(m[1])
			while ((m = impRe.exec(src))) deps.add(m[1])
			const base = path.dirname(file)
			for (const d of deps) {
				if (!this.isRelative(d)) continue
				const abs = await this.resolveAsFileOrDir(
					normalizePath(path.join(base, d))
				)
				if (abs) pending.push(abs)
			}
		}
	}

	private resolveInGraph(p: string): string | null {
		if (this.moduleCache[p]) return p
		for (const ext of ['.ts', '.js', '.json']) {
			if (this.moduleCache[p + ext]) return p + ext
		}
		for (const idx of ['/index.ts', '/index.js', '/index.json']) {
			if (this.moduleCache[p + idx]) return p + idx
		}
		return null
	}

	private createGraphRequire(forFile: string) {
		return (spec: string) => {
			const clean = spec.replace(/^node:/, '')
			const map = this.getModuleMap()
			if (map[clean]) return map[clean]
			if (!this.isRelative(spec)) {
				throw new Error(
					`Cannot require '${spec}' (only core modules and relative files are supported)`
				)
			}
			const base = path.dirname(forFile)
			const resolved = this.resolveInGraph(normalizePath(path.join(base, spec)))
			if (!resolved) throw new Error(`Module not found: ${spec}`)
			return this.executeModule(resolved)
		}
	}

	private executeModule(file: string) {
		const entry = this.moduleCache[file]
		if (!entry) throw new Error(`Module not preloaded: ${file}`)
		if (entry.evaluated) return entry.exports
		if (entry.type === 'json') {
			entry.evaluated = true
			return entry.exports
		}
		const code = entry.code || ''
		const fn = new Function(
			'exports',
			'require',
			'module',
			'__filename',
			'__dirname',
			code
		)
		const mod = { exports: {} }
		const req = this.createGraphRequire(file)
		fn(mod.exports, req, mod, file, path.dirname(file))
		entry.exports = mod.exports
		entry.evaluated = true
		return entry.exports
	}

	async runNodeProgram(entryPath: string) {
		for (const k of Object.keys(this.moduleCache)) delete this.moduleCache[k]
		const resolved = await this.resolveAsFileOrDir(entryPath)
		if (!resolved) throw new Error(`Entry not found: ${entryPath}`)
		await this.buildGraph(resolved)
		try {
			this.executeModule(resolved)
		} catch (e: any) {
			this.io.writeln(String(e?.message || e))
		}
	}

	// Specials inside Node REPL
	handleReplSpecials(s: string): boolean {
		if (/^clear\s*(\(\s*\))?\s*$/i.test(s) || /^\.clear\s*$/.test(s)) {
			this.io.reset()
			return true
		}
		return false
	}
}
