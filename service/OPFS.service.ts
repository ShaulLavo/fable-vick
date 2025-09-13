import { dir as opfsDir, file as opfsFile } from 'opfs-tools'
import { unwrap } from 'solid-js/store'
import { File, Folder, FSNode, isFolder } from '../types/FS.types'

type OpfsResource = {
	exists(): Promise<boolean>
	remove(): Promise<void>
	moveTo(target: OpfsResource): Promise<void>
}
export async function* readFileChunks(
	file: ReturnType<typeof opfsFile>,
	chunkSize: number = 1024
): AsyncGenerator<string, void, unknown> {
	const stream = await file.stream()
	const reader = stream.getReader()
	const decoder = new TextDecoder()
	let buffer = new Uint8Array(0)
	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) {
				if (buffer.length) yield decoder.decode(buffer, { stream: false })
				break
			}
			buffer = concat(buffer, value) as Uint8Array<ArrayBuffer>
			while (buffer.length >= chunkSize) {
				yield decoder.decode(buffer.slice(0, chunkSize), { stream: true })
				buffer = buffer.slice(chunkSize)
			}
		}
	} finally {
		try {
			await reader.cancel()
		} catch {}
		try {
			reader.releaseLock()
		} catch {}
	}
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
	const c = new Uint8Array(a.length + b.length)
	c.set(a, 0)
	c.set(b, a.length)
	return c
}

const saveFile = async (file: File, content: string) => {
	const writer = await opfsFile(file.path).createWriter()
	await writer.truncate(0)
	await writer.write(content)
	await writer.close()
}

const getFileInChunks = async (
	file: File | ReturnType<typeof opfsFile>,
	size?: number
) => {
	const f = opfsFile(file.path)
	const chunks = readFileChunks(f, size)
	return chunks
}
const getFile = async (file: File, as?: 'text' | 'buffer') => {
	try {
		const f = opfsFile(file.path)
		return await f.text()
	} catch (e) {
		console.error('failed to get file content!' + JSON.stringify(file), e)
		// throw e
	}
}

const move = async (node: FSNode, oldPath: string) => {
	const moveResource = async (resource: OpfsResource, target: OpfsResource) => {
		const exists = await resource.exists()
		if (!exists) return
		await resource.moveTo(target)
	}

	if (isFolder(node)) {
		const folder = opfsDir(oldPath)
		const targetFolder = opfsDir(node.path)
		await moveResource(folder, targetFolder)
		return
	}
	const file = opfsFile(oldPath)
	const targetFile = opfsFile(node.path)
	await moveResource(file, targetFile)
}

async function removeEntryAtPath(path: string) {
	// Normalize and split
	const parts = path.replace(/^\/+/, '').split('/').filter(Boolean)
	const root = await navigator.storage.getDirectory()
	if (parts.length === 0) return
	const name = parts.pop()!
	let dir = root
	for (const p of parts) {
		dir = await dir.getDirectoryHandle(p, { create: false })
	}
	// Use recursive: true to handle non-empty directories
	await dir.removeEntry(name, { recursive: true })
}

const remove = async (node: FSNode) => {
	try {
		await removeEntryAtPath(node.path)
	} catch (e: any) {
		// Swallow NotFoundError (already removed / race), rethrow others
		const name = (e && (e.name || e.codeName)) as string | undefined
		if (name === 'NotFoundError') return
		console.error('Failed to remove path from OPFS:', node.path, e)
		throw e
	}
}

const tree = async (n: Folder): Promise<Folder> => {
	const node = unwrap(n)
	if (node.path === 'root/') node.path = '/'
	const dir = opfsDir(node.path || '/')
	const childrenResources = await dir.children()
	const newChildren: FSNode[] = await Promise.all(
		childrenResources.map(async child => {
			if (child.kind === 'dir') {
				const oldChild = node.children
					.filter(isFolder)
					.find(c => c.path === child.path)
				const newChild: Folder = {
					name: child.name,
					path: child.path,
					children: oldChild
						? oldChild.children.toSorted((a, b) => a.name.localeCompare(b.name))
						: [],
					isOpen: oldChild ? oldChild.isOpen : false
				}

				return tree(newChild)
			}
			return { name: child.name, path: child.path }
		})
	)

	return {
		name: node.name,
		children: newChildren,
		isOpen: node.isOpen,
		path: node.path
	}
}

function isBinaryPath(path: string): boolean {
	const lower = path.toLowerCase()
	return (
		lower.endsWith('.ttf') ||
		lower.endsWith('.otf') ||
		lower.endsWith('.woff') ||
		lower.endsWith('.woff2') ||
		lower.endsWith('.png') ||
		lower.endsWith('.jpg') ||
		lower.endsWith('.jpeg') ||
		lower.endsWith('.gif') ||
		lower.endsWith('.ico') ||
		lower.endsWith('.pdf') ||
		lower.endsWith('.mp4') ||
		lower.endsWith('.webm') ||
		lower.endsWith('.zip') ||
		lower.endsWith('.gz') ||
		lower.endsWith('.wasm')
	)
}

async function readAllBytes(
	f: ReturnType<typeof opfsFile>
): Promise<Uint8Array> {
	const stream = await f.stream()
	const reader = stream.getReader()
	const chunks: Uint8Array[] = []
	let total = 0
	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			if (value) {
				chunks.push(value)
				total += value.byteLength
			}
		}
	} finally {
		try {
			await reader.cancel()
		} catch {}
		try {
			reader.releaseLock()
		} catch {}
	}
	const out = new Uint8Array(total)
	let offset = 0
	for (const c of chunks) {
		out.set(c, offset)
		offset += c.byteLength
	}
	return out
}

function isTextPath(path: string): boolean {
	const lower = path.toLowerCase()
	return (
		lower.endsWith('.js') ||
		lower.endsWith('.ts') ||
		lower.endsWith('.tsx') ||
		lower.endsWith('.jsx') ||
		lower.endsWith('.mjs') ||
		lower.endsWith('.cjs') ||
		lower.endsWith('.json') ||
		lower.endsWith('.map') ||
		lower.endsWith('.css') ||
		lower.endsWith('.html') ||
		lower.endsWith('.md') ||
		lower.endsWith('.txt') ||
		lower.endsWith('.svg')
	)
}

async function mapFiles(
	root: Folder
): Promise<{ files: Record<string, { code: string | Uint8Array }> }> {
	const result = { files: {} as Record<string, { code: string | Uint8Array }> }
	async function traverse(node: FSNode): Promise<void> {
		if (isFolder(node)) {
			await Promise.all(node.children.map(child => traverse(child)))
		} else {
			if (isTextPath(node.path)) {
				const content = await getFile(node as File)
				result.files[node.path] = { code: content ?? '' }
			} else {
				// Read as bytes for binary assets
				const f = opfsFile((node as File).path)
				const bytes = await readAllBytes(f)
				result.files[node.path] = { code: bytes }
			}
		}
	}
	await traverse(root)
	return result
}

export const OPFS = {
	saveFile,
	getFile,
	move,
	remove,
	tree,
	getFileInChunks,
	mapFiles
}

// --- Additional helpers for WC→OPFS sync ---

async function ensureDirRecursive(path: string): Promise<void> {
	// Normalize and split
	const parts = path.replace(/^\/+/, '').split('/').filter(Boolean)
	let dir = await navigator.storage.getDirectory()
	for (const p of parts) {
		dir = await dir.getDirectoryHandle(p, { create: true })
	}
}

function parentDir(path: string): string {
	const cleaned = path.replace(/\\/g, '/').replace(/^\/+/, '')
	const idx = cleaned.lastIndexOf('/')
	return idx === -1 ? '/' : '/' + cleaned.slice(0, idx)
}

export async function writeBytes(
	path: string,
	bytes: Uint8Array
): Promise<void> {
	const parent = parentDir(path)
	await ensureDirRecursive(parent)
	const writer = await opfsFile(path).createWriter()
	await writer.truncate(0)
	await writer.write(bytes)
	await writer.close()
}

export async function writeText(path: string, text: string): Promise<void> {
	const parent = parentDir(path)
	await ensureDirRecursive(parent)
	const writer = await opfsFile(path).createWriter()
	await writer.truncate(0)
	await writer.write(text)
	await writer.close()
}

export const OPFSSync = {
	ensureDirRecursive,
	writeBytes,
	writeText
}

// --- Path-level helpers for Node-like fs shim ---

export async function readText(path: string): Promise<string> {
	return await opfsFile(path).text()
}

export async function readBytes(path: string): Promise<Uint8Array> {
	const ab = await opfsFile(path).arrayBuffer()
	return new Uint8Array(ab)
}

export async function removePath(path: string): Promise<void> {
	await removeEntryAtPath(path)
}

export async function movePath(
	oldPath: string,
	newPath: string
): Promise<void> {
	// Ensure target parent exists
	await ensureDirRecursive(parentDir(newPath))
	const f = opfsFile(oldPath)
	if (await f.exists()) {
		await f.moveTo(opfsFile(newPath))
		return
	}
	const d = opfsDir(oldPath)
	if (await d.exists()) {
		await d.moveTo(opfsDir(newPath))
		return
	}
	throw new Error(`Path not found: ${oldPath}`)
}

export async function list(
	path: string
): Promise<{ name: string; kind: 'file' | 'dir'; path: string }[]> {
	const d = opfsDir(path)
	const entries = await d.children()
	return entries.map(e => ({
		name: e.name,
		kind: e.kind as 'file' | 'dir',
		path: e.path
	}))
}

export async function mkdirp(path: string): Promise<void> {
	await ensureDirRecursive(path)
}

export async function existsPath(path: string): Promise<boolean> {
	try {
		if (await opfsFile(path).exists()) return true
	} catch {}
	try {
		if (await opfsDir(path).exists()) return true
	} catch {}
	return false
}

export async function fileStream(
	path: string
): Promise<ReadableStream<Uint8Array>> {
	return await opfsFile(path).stream()
}

export async function statPath(
	path: string
): Promise<{ isFile: boolean; size: number; mtimeMs: number } | null> {
	// Some opfs-tools helpers throw on invalid paths (e.g., '/').
	// Safely probe file first, then dir, guarding with try/catch.
	try {
		const f = opfsFile(path)
		if (await f.exists()) {
			const origin = await f.getOriginFile()
			const size = origin?.size ?? (await f.getSize())
			const mtime = origin?.lastModified ?? Date.now()
			return { isFile: true, size, mtimeMs: mtime }
		}
	} catch {}
	try {
		const d = opfsDir(path)
		if (await d.exists()) {
			return { isFile: false, size: 0, mtimeMs: Date.now() }
		}
	} catch {}
	return null
}
