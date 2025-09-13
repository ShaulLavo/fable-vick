import type ts from 'typescript'

// OPFS SyncAccessHandle types are available in workers
declare global {
	interface FileSystemFileHandle {
		createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>
	}
	interface FileSystemSyncAccessHandle {
		read(dataView: DataView, options?: { at?: number }): void
		write(data: BufferSource, options?: { at?: number }): void
		truncate(size: number): void
		flush(): void
		getSize(): number
		close(): void
	}
}

type DirNode = {
	dirs: Set<string>
	files: Set<string>
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function normPath(p: string): string {
	if (!p) return '/'
	// normalize separators and ensure absolute
	p = p.replace(/\\/g, '/').trim()
	const parts = p.split('/').filter(Boolean)
	const norm = '/' + parts.join('/')
	return norm === '' ? '/' : norm
}

function dirname(p: string): string {
	p = normPath(p)
	const i = p.lastIndexOf('/')
	return i <= 0 ? '/' : p.slice(0, i)
}

function basename(p: string): string {
	p = normPath(p)
	const i = p.lastIndexOf('/')
	return i === -1 ? p : p.slice(i + 1)
}

async function getRootDirHandle(): Promise<FileSystemDirectoryHandle> {
	return await navigator.storage.getDirectory()
}

async function* walk(
	dir: FileSystemDirectoryHandle,
	currentPath: string
): AsyncGenerator<{ path: string; handle: FileSystemHandle }, void, unknown> {
	for await (const entry of dir.values() as AsyncIterable<FileSystemHandle>) {
		const childPath =
			currentPath === '/' ? `/${entry.name}` : `${currentPath}/${entry.name}`
		if (entry.kind === 'directory') {
			yield { path: childPath, handle: entry }
			yield* walk(entry as FileSystemDirectoryHandle, childPath)
		} else {
			yield { path: childPath, handle: entry }
		}
	}
}

async function ensureDir(path: string): Promise<FileSystemDirectoryHandle> {
	const root = await getRootDirHandle()
	const parts = normPath(path).split('/').filter(Boolean)
	let dir = root
	for (const part of parts) {
		dir = await dir.getDirectoryHandle(part, { create: true })
	}
	return dir
}

async function getFileHandle(
	path: string,
	create = false
): Promise<FileSystemFileHandle> {
	const parent = dirname(path)
	const name = basename(path)
	const dir = create ? await ensureDir(parent) : await getDir(parent)
	return await dir.getFileHandle(name, { create })
}

async function getDir(path: string): Promise<FileSystemDirectoryHandle> {
	const root = await getRootDirHandle()
	const parts = normPath(path).split('/').filter(Boolean)
	let dir = root
	for (const part of parts) {
		dir = await dir.getDirectoryHandle(part, { create: false })
	}
	return dir
}

export async function createOPFSSystem(
	overlayFiles: Map<string, string>
): Promise<ts.System> {
	// Build index and open sync handles for all existing files
	const dirIndex = new Map<string, DirNode>()
	// In-memory content cache for synchronous reads without persistent handles
	const contentCache = new Map<string, string>()
	const existsFiles = new Set<string>()
	const memWrites = new Map<string, string>() // for new files until persisted

	function ensureDirIndex(dirPath: string) {
		dirPath = normPath(dirPath)
		if (!dirIndex.has(dirPath)) {
			dirIndex.set(dirPath, { dirs: new Set(), files: new Set() })
		}
	}

	function addFileToIndex(filePath: string) {
		filePath = normPath(filePath)
		existsFiles.add(filePath)
		const parent = dirname(filePath)
		ensureDirIndex(parent)
		dirIndex.get(parent)!.files.add(filePath)
	}

	function addDirToIndex(dirPath: string) {
		dirPath = normPath(dirPath)
		ensureDirIndex(dirPath)
		const parent = dirname(dirPath)
		if (parent !== dirPath) {
			ensureDirIndex(parent)
			dirIndex.get(parent)!.dirs.add(dirPath)
		}
	}

	async function buildIndex() {
		addDirToIndex('/')
		const root = await getRootDirHandle()
		for await (const { path, handle } of walk(root, '/')) {
			if (handle.kind === 'directory') {
				addDirToIndex(path)
			} else {
				addFileToIndex(path)
				try {
					const file = await (handle as FileSystemFileHandle).getFile()
					const text = await file.text()
					contentCache.set(path, text)
				} catch (e) {
					// If we cannot read now, file can be filled later from memWrites
				}
			}
		}
	}

	await buildIndex()

	function readFromCache(path: string): string | undefined {
		if (contentCache.has(path)) return contentCache.get(path)
		return memWrites.get(path)
	}

	// Resolve overlay (TS lib) files regardless of path variant
	function overlayGet(path: string): string | undefined {
		// direct hit
		if (overlayFiles.has(path)) return overlayFiles.get(path)
		// try without leading slash
		if (path.startsWith('/')) {
			const noSlash = path.slice(1)
			if (overlayFiles.has(noSlash)) return overlayFiles.get(noSlash)
		}
		// try mapping '/lib/lib.xxx.d.ts' -> '/lib.xxx.d.ts'
		if (path.startsWith('/lib/')) {
			const alt = '/' + basename(path)
			if (overlayFiles.has(alt)) return overlayFiles.get(alt)
			const noSlash = alt.slice(1)
			if (overlayFiles.has(noSlash)) return overlayFiles.get(noSlash)
		}
		// try mapping '/node_modules/typescript/lib/lib.xxx.d.ts' -> '/lib.xxx.d.ts'
		if (path.includes('/node_modules/typescript/lib/')) {
			const alt = '/' + basename(path)
			if (overlayFiles.has(alt)) return overlayFiles.get(alt)
			const noSlash = alt.slice(1)
			if (overlayFiles.has(noSlash)) return overlayFiles.get(noSlash)
		}
		return undefined
	}

	function writeToCacheAndPersist(path: string, data: string) {
		contentCache.set(path, data)
		memWrites.delete(path)
		;(async () => {
			try {
				const fh = await getFileHandle(path, true)
				const sync = await fh.createSyncAccessHandle()
				const bytes = encoder.encode(data)
				try {
					sync.truncate(0)
				} catch {}
				sync.write(bytes, { at: 0 })
				try {
					sync.flush()
				} catch {}
				try {
					sync.close()
				} catch {}
				addFileToIndex(path)
			} catch (e) {
				// keep in cache; attempt later if needed
				memWrites.set(path, data)
			}
		})()
	}

	function listFilesUnder(directory: string, recursive = true): string[] {
		directory = normPath(directory)
		const out: string[] = []
		for (const f of existsFiles) {
			if (f.startsWith(directory === '/' ? '/' : directory + '/')) {
				out.push(f)
			}
		}
		return out
	}

	const system: ts.System = {
		args: [],
		newLine: '\n',
		useCaseSensitiveFileNames: true,
		write: s => console.log(s),
		exit: () => {},
		getCurrentDirectory: () => '/',
		resolvePath: p => normPath(p),
		realpath: p => normPath(p),
		fileExists: p => {
			p = normPath(p)
			return (
				overlayFiles.has(p) ||
				!!overlayGet(p) ||
				existsFiles.has(p) ||
				memWrites.has(p)
			)
		},
		directoryExists: p => {
			p = normPath(p)
			return dirIndex.has(p)
		},
		createDirectory: p => {
			p = normPath(p)
			addDirToIndex(p)
			// async ensure in background
			;(async () => {
				try {
					await ensureDir(p)
				} catch {}
			})()
		},
		readFile: (p, _encoding) => {
			p = normPath(p)
			const ov = overlayGet(p)
			if (ov !== undefined) return ov
			return readFromCache(p)
		},
		getFileSize: p => {
			p = normPath(p)
			const ov = overlayGet(p)
			if (ov !== undefined) return ov.length
			const mem = memWrites.get(p)
			if (mem) return mem.length
			const cached = contentCache.get(p)
			return cached ? cached.length : 0
		},
		writeFile: (p, data, _bom) => {
			p = normPath(p)
			// do not persist TS lib overlay writes
			if (p.startsWith('/lib.') && overlayFiles.has(p)) {
				overlayFiles.set(p, data)
				return
			}
			writeToCacheAndPersist(p, data)
		},
		deleteFile: p => {
			p = normPath(p)
			overlayFiles.delete(p)
			memWrites.delete(p)
			existsFiles.delete(p)
			const parent = dirname(p)
			const d = dirIndex.get(parent)
			if (d) d.files.delete(p)
			contentCache.delete(p)
			;(async () => {
				try {
					const parentDir = await getDir(parent)
					await parentDir.removeEntry(basename(p))
				} catch {}
			})()
		},
		// Make TS default lib resolution land under '/lib'
		getExecutingFilePath: () => '/lib/tsserver.js',
		getDirectories: p => {
			p = normPath(p)
			const dn = dirIndex.get(p)
			if (!dn) return []
			return Array.from(dn.dirs).map(d => basename(d))
		},
		readDirectory: (directory, extensions, _exclude, _include, _depth) => {
			directory = normPath(directory)
			const all = new Set<string>()
			// overlay files first
			for (const k of overlayFiles.keys()) {
				// Direct prefix match
				if (k.startsWith(directory === '/' ? '/' : directory + '/')) all.add(k)
				// Special-case: expose '/lib.xxx.d.ts' under '/lib'
				if (
					directory === '/lib' &&
					(k.startsWith('/lib.') || k.includes('/node_modules/typescript/lib/'))
				) {
					all.add('/lib/' + basename(k))
				}
			}
			// opfs indexed files
			for (const f of listFilesUnder(directory)) all.add(f)
			let res = Array.from(all)
			if (extensions && extensions.length) {
				res = res.filter(p => extensions!.some(ext => p.endsWith(ext)))
			}
			return res
		}
	}

	// Clean up on unload
	self.addEventListener('unload', () => {})

	// Expose a small escape hatch so the main thread can request
	// that we release any SyncAccessHandles for a given path (file or dir)
	system.opfsRelease = (_p: string) => {}

	return system
}
