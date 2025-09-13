import fs from '../../../node/FS'

export type NpmIO = {
	write: (s: string) => void
	writeln: (s?: string) => void
}

export async function runNpmBrowser(args: string[], cwd: string, io: NpmIO) {
	try {
		const proc: any = globalThis.process || {}
		if (!proc.binding) {
			proc.binding = (name: string) => {
				if (name === 'buffer') return { kStringMaxLength: 0x3fffffff }
				if (name === 'fs') return {}
				return {}
			}
			globalThis.process = proc
		}
		const patchCtor = (CtorName: 'Error' | 'TypeError') => {
			const Orig = globalThis[CtorName]
			if (!Orig || Orig.__patched_for_npm__) return
			const Patched: any = function (this: any, ...a: any[]) {
				// @ts-ignore
				const err = new Orig(...a)
				try {
					const d = Object.getOwnPropertyDescriptor(err, 'message')
					if (!d || d.get || d.set || d.writable === false) {
						Object.defineProperty(err, 'message', {
							value: String(err.message ?? ''),
							writable: true,
							configurable: true
						})
					}
				} catch {}
				return err
			}
			Patched.prototype = Orig.prototype
			Object.setPrototypeOf(Patched, Orig)
			Patched.__patched_for_npm__ = true
			globalThis[CtorName] = Patched
		}
		patchCtor('Error')
		patchCtor('TypeError')

		const ensureWritableMessage = () => {
			try {
				const pd = Object.getOwnPropertyDescriptor(Error.prototype, 'message')
				if (!pd || pd.set) return
				Object.defineProperty(Error.prototype, 'message', {
					configurable: true,
					enumerable: pd.enumerable ?? false,
					get:
						pd.get ||
						function (this: any) {
							return this._message ?? ''
						},
					set: function (this: any, v: any) {
						try {
							Object.defineProperty(this, 'message', {
								value: String(v),
								writable: true,
								configurable: true
							})
						} catch {}
					}
				})
			} catch {}
		}
		ensureWritableMessage()

		const origFetch = globalThis.fetch?.bind(globalThis)
		if (origFetch && !origFetch.__wrapped_for_npm__) {
			const wrapped = (...a: any[]) =>
				origFetch(...a).catch((err: any) =>
					Promise.reject(new Error(String(err?.message ?? err)))
				)
			wrapped.__wrapped_for_npm__ = true
			globalThis.fetch = wrapped
		}

		try {
			// @ts-ignore fs shim
			await fs.promises.mkdir('/home/web/.npm/_logs', { recursive: true })
			// @ts-ignore fs shim
			await fs.promises.mkdir('/home/web/.npm/_cacache', { recursive: true })
			// @ts-ignore fs shim
			await fs.promises.mkdir(cwd, { recursive: true })
		} catch {}

		const { runNpmCli } = await import('npm-in-browser')
		const cliArgs = (() => {
			const base = args.length ? [...args] : []
			const has = (f: string) =>
				base.some(a => a === f || a.startsWith(f + '='))
			if (!has('--audit') && !has('--no-audit')) base.push('--no-audit')
			if (!has('--fund') && !has('--no-fund')) base.push('--no-fund')
			if (!has('--loglevel')) base.push('--loglevel=error')
			return base
		})()

		await runNpmCli(cliArgs, {
			// @ts-ignore fs shim type
			fs,
			cwd,
			stdout: chunk => {
				io.write(String(chunk).replace(/\n/g, '\r\n'))
			},
			stderr: chunk => {
				io.write(String(chunk).replace(/\n/g, '\r\n'))
			}
		})
	} catch (e: any) {
		io.writeln(`[npm] error: ${e?.message ?? String(e)}`)
	}
}
