// Browser-friendly fs shim that proxies to our OPFS services (OPFS.service.ts)
// It provides a subset of Node's fs API plus `fs.promises`.

import {
	readText as opfsReadText,
	readBytes as opfsReadBytes,
	writeBytes as opfsWriteBytes,
	writeText as opfsWriteText,
	removePath as opfsRemovePath,
	movePath as opfsMovePath,
	list as opfsList,
	mkdirp as opfsMkdirp,
	statPath as opfsStatPath,
	fileStream as opfsFileStream
} from '../service/OPFS.service'

type Callback<T = any> = (err: Error | null, result?: T) => void

function toEncodingOption(options?: any): { encoding?: string } | undefined {
	if (typeof options === 'string') return { encoding: options }
	if (options && typeof options === 'object') return options
	return undefined
}

function nodeify<Args extends any[], R>(fn: (...args: Args) => Promise<R>) {
	return (...args: any[]) => {
		const cb: Callback<R> | undefined =
			typeof args[args.length - 1] === 'function' ? args.pop() : undefined
		const p = fn(...(args as Args))
		if (cb) {
			p.then(res => {
				if (cb)
					try {
						cb(null, res)
					} catch {}
			}).catch(err => {
				if (cb)
					try {
						cb(err ?? new Error('Unknown fs error'))
					} catch {}
			})
			return
		}
		return p as unknown as Promise<R>
	}
}

const readFile = nodeify(async (path: string, options?: any) => {
	const enc = toEncodingOption(options)?.encoding
	if (enc) return await opfsReadText(path)
	return await opfsReadBytes(path)
})

export const writeFile = nodeify(
	async (path: string, data: Uint8Array | string, options?: any) => {
		const enc = toEncodingOption(options)?.encoding
		if (typeof data === 'string' || enc)
			return await opfsWriteText(path, String(data))
		return await opfsWriteBytes(path, data as Uint8Array)
	}
)

class Stats {
	dev = 0
	ino = 0
	mode: number
	nlink = 1
	uid = 0
	gid = 0
	rdev = 0
	size: number
	blksize = 4096
	blocks: number
	atimeMs: number
	mtimeMs: number
	ctimeMs: number
	birthtimeMs: number
	atime: Date
	mtime: Date
	ctime: Date
	birthtime: Date
	constructor(isFile: boolean, size: number, timeMs: number) {
		this.mode = isFile ? 0o100000 : 0o40000
		this.size = size
		this.blocks = Math.ceil(size / 512)
		this.atimeMs = timeMs
		this.mtimeMs = timeMs
		this.ctimeMs = timeMs
		this.birthtimeMs = timeMs
		this.atime = new Date(timeMs)
		this.mtime = new Date(timeMs)
		this.ctime = new Date(timeMs)
		this.birthtime = new Date(timeMs)
	}
	isFile() {
		return (this.mode & 0o170000) === 0o100000
	}
	isDirectory() {
		return (this.mode & 0o170000) === 0o40000
	}
	isBlockDevice() {
		return false
	}
	isCharacterDevice() {
		return false
	}
	isSymbolicLink() {
		return false
	}
	isFIFO() {
		return false
	}
	isSocket() {
		return false
	}
}

const stat = nodeify(async (path: string, _options?: any) => {
	const s = await opfsStatPath(path)
	if (!s)
		throw Object.assign(
			new Error(`ENOENT: no such file or directory, stat '${path}'`),
			{ code: 'ENOENT' }
		)
	return new Stats(s.isFile, s.size, s.mtimeMs)
})

// No symlink support in OPFS; lstat behaves like stat
const lstat = nodeify(async (path: string, _options?: any) => {
	return await stat(path)
})

// Minimal realpath implementation (no symlinks in OPFS)
function normalizePath(p: string): string {
	if (!p) return '/'
	const isAbs = p.startsWith('/')
	const parts = p.replace(/\\/g, '/').split('/').filter(Boolean)
	const stack: string[] = []
	for (const part of parts) {
		if (part === '.' || part === '') continue
		if (part === '..') {
			if (stack.length) stack.pop()
			continue
		}
		stack.push(part)
	}
	const joined = '/' + stack.join('/')
	return isAbs ? joined : joined || '/'
}

const realpath = nodeify(async (path: string, _options?: any) =>
	normalizePath(path)
)
// @ts-expect-error
realpath.native = realpath

const mkdir = nodeify(async (path: string, _options?: any) => opfsMkdirp(path))
const readdir = nodeify(async (path: string, _options?: any) =>
	(await opfsList(path)).map(e => e.name)
)
const unlink = nodeify(async (path: string) => opfsRemovePath(path))
const rename = nodeify(async (oldPath: string, newPath: string) =>
	opfsMovePath(oldPath, newPath)
)

// readlink is unsupported; expose a function to satisfy feature detection
const readlink = nodeify(async (_path: string) => {
	throw Object.assign(
		new Error('ENOSYS: readlink not supported in OPFS shim'),
		{ code: 'ENOSYS' }
	)
})

class Dirent {
	name: string
	private _kind: 'file' | 'dir'
	constructor(name: string, kind: 'file' | 'dir') {
		this.name = name
		this._kind = kind
	}
	isFile() {
		return this._kind === 'file'
	}
	isDirectory() {
		return this._kind === 'dir'
	}
	isBlockDevice() {
		return false
	}
	isCharacterDevice() {
		return false
	}
	isSymbolicLink() {
		return false
	}
	isFIFO() {
		return false
	}
	isSocket() {
		return false
	}
}

class Dir {
	private list: { name: string; kind: 'file' | 'dir' }[]
	private idx = 0
	constructor(list: { name: string; kind: 'file' | 'dir' }[]) {
		this.list = list
	}
	async read(): Promise<Dirent | null> {
		if (this.idx >= this.list.length) return null
		const item = this.list[this.idx++]
		return new Dirent(item.name, item.kind)
	}
	async close(): Promise<void> {
		/* no-op */
	}
}

const opendir = nodeify(async (path: string) => new Dir(await opfsList(path)))

function createReadStream(path: string, options?: any) {
	// If start/end provided, slice from the underlying stream
	const { start = 0, end = Infinity } = options || {}
	const streamPromise = opfsFileStream(path)
	const out = new ReadableStream<Uint8Array>({
		async start(controller) {
			const src = await streamPromise
			const reader = src.getReader()
			let pos = 0
			try {
				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					if (!value) continue
					let chunk = value
					const nextPos = pos + chunk.byteLength
					// Skip before start
					if (nextPos <= start) {
						pos = nextPos
						continue
					}
					// Trim leading if needed
					if (pos < start) chunk = chunk.slice(start - pos)
					// Trim trailing if needed
					if (pos < end && nextPos > end + 1)
						chunk = chunk.slice(0, Math.max(0, end + 1 - pos))
					if (chunk.byteLength > 0) controller.enqueue(chunk)
					pos = nextPos
					if (pos > end) break
				}
			} finally {
				controller.close()
			}
		}
	})
	return out
}

function createWriteStream(path: string, _options?: any) {
	type Handler = (...args: any[]) => void
	const handlers: Record<string, Handler[]> = Object.create(null)
	const chunks: Uint8Array[] = []
	let closed = false
	function emit(evt: string, ...args: any[]) {
		;(handlers[evt] || []).forEach(h => {
			try {
				h(...args)
			} catch {}
		})
	}
	const api = {
		on(evt: string, h: Handler) {
			;(handlers[evt] ||= []).push(h)
			return api
		},
		once(evt: string, h: Handler) {
			const wrap: Handler = (...args) => {
				off()
				h(...args)
			}
			const off = () => {
				const arr = handlers[evt]
				if (!arr) return
				const i = arr.indexOf(wrap)
				if (i >= 0) arr.splice(i, 1)
			}
			;(handlers[evt] ||= []).push(wrap)
			return api
		},
		write(data: string | Uint8Array, cb?: (err?: Error | null) => void) {
			if (closed) {
				cb?.(new Error('write after end'))
				return false
			}
			try {
				if (typeof data === 'string') {
					chunks.push(new TextEncoder().encode(data))
				} else if (data) {
					chunks.push(data)
				}
				if (cb) cb(null)
				return true
			} catch (e: any) {
				if (cb) cb(e)
				emit('error', e)
				return false
			}
		},
		end(data?: string | Uint8Array, cb?: () => void) {
			if (typeof data !== 'undefined') api.write(data)
			closed = true
			const total = chunks.reduce((n, c) => n + c.byteLength, 0)
			const buf = new Uint8Array(total)
			let off = 0
			for (const c of chunks) {
				buf.set(c, off)
				off += c.byteLength
			}
			opfsWriteBytes(path, buf)
				.then(() => {
					emit('finish')
					emit('close')
					if (cb)
						try {
							cb()
						} catch {}
				})
				.catch(err => {
					emit('error', err)
					emit('close')
				})
		},
		close() {
			api.end()
		},
		destroy(err?: Error) {
			if (err) emit('error', err)
			emit('close')
		}
	}
	return api
}

// Minimal writev stub to satisfy consumers that probe for it.
// It does NOT write; it only reports bytes length and forwards buffers.
function writev(
	_fd: number,
	buffers: Array<Uint8Array>,
	_position: number | undefined,
	cb: (err: Error | null, bytes: number, bufs: Array<Uint8Array>) => void
) {
	try {
		let total = 0
		for (const b of buffers) total += b?.byteLength ?? 0
		cb && cb(null, total, buffers)
	} catch (e: any) {
		cb && cb(e, 0, buffers)
	}
}

// Synchronous APIs are not supported in the browser. Provide minimal stubs.
function notSupportedSync(name: string): any {
	return () => {
		throw new Error(
			`fs.${name}Sync is not supported in the browser environment`
		)
	}
}

const readFileSync = notSupportedSync('readFile')
const writeFileSync = notSupportedSync('writeFile')
const statSync = notSupportedSync('stat')
const lstatSync = notSupportedSync('lstat')
const mkdirSync = notSupportedSync('mkdir')
const readdirSync = notSupportedSync('readdir')
const unlinkSync = notSupportedSync('unlink')
const renameSync = notSupportedSync('rename')
const opendirSync = notSupportedSync('opendir')
const readlinkSync = notSupportedSync('readlink')

// Provide a minimal realpathSync that just normalizes
function realpathSyncImpl(p: string): string {
	return normalizePath(p)
}
realpathSyncImpl.native = realpathSyncImpl

function existsSync(_path: string): boolean {
	// No sync filesystem checks in browser; return false to be safe.
	return false
}

const fs = {
	// callback-style
	readFile,
	writeFile,
	stat,
	lstat,
	realpath,
	mkdir,
	readdir,
	unlink,
	rename,
	readlink,
	opendir,
	createReadStream,
	createWriteStream,
	writev,
	// minimal constants used by some libs
	constants: {
		F_OK: 0,
		R_OK: 4,
		W_OK: 2,
		X_OK: 1,
		COPYFILE_EXCL: 1,
		COPYFILE_FICLONE: 2,
		COPYFILE_FICLONE_FORCE: 4
	},
	// sync stubs
	readFileSync,
	writeFileSync,
	statSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	unlinkSync,
	renameSync,
	opendirSync,
	readlinkSync,
	existsSync,
	realpathSync: realpathSyncImpl,
	// promises API
	promises: {
		readFile: (path: string, options?: any) =>
			readFile(path, options) as unknown as Promise<any>,
		writeFile: (path: string, data: any, options?: any) =>
			writeFile(path, data, options) as unknown as Promise<void>,
		stat: (path: string, options?: any) =>
			stat(path, options) as unknown as Promise<any>,
		lstat: (path: string, options?: any) =>
			lstat(path, options) as unknown as Promise<any>,
		realpath: (path: string, options?: any) =>
			realpath(path, options) as unknown as Promise<string>,
		mkdir: (path: string, options?: any) =>
			mkdir(path, options) as unknown as Promise<void>,
		readdir: (path: string, options?: any) =>
			readdir(path, options) as unknown as Promise<string[]>,
		unlink: (path: string) => unlink(path) as unknown as Promise<void>,
		rename: (oldPath: string, newPath: string) =>
			rename(oldPath, newPath) as unknown as Promise<void>,
		readlink: (path: string) => readlink(path) as unknown as Promise<string>,
		opendir: (path: string) => opendir(path) as unknown as Promise<any>,
		createReadStream: (path: string, options?: any) =>
			Promise.resolve(createReadStream(path, options))
	}
}

export const promises = fs.promises
export default fs
