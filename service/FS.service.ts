import { IconTypes } from 'solid-icons'
import { getNodeIcon } from '../stores/icons'
import { Folder, FSNode, isFolder } from '../types/FS.types'
import { ValidComponent } from 'solid-js'

export function compareNodes(a: FSNode, b: FSNode) {
	const aIsFolder = isFolder(a)
	const bIsFolder = isFolder(b)
	if (aIsFolder && !bIsFolder) return -1
	if (!aIsFolder && bIsFolder) return 1
	return a.name.localeCompare(b.name)
}

export function sortTreeInDraft(draft: Folder, recursive = true) {
	draft.children.sort(compareNodes)
	if (recursive) {
		draft.children.forEach(child => {
			if (isFolder(child)) sortTreeInDraft(child, recursive)
		})
	}
	return draft
}
export function getNode(root: Folder, path: string): FSNode | null {
	if (!path || path === '' || path === '/') return root
	const segments = path.replace(/^\//, '').split('/')
	let current: FSNode = root
	for (const seg of segments) {
		if (!isFolder(current)) return null
		const next = current.children.find(child => child.name === seg)
		if (!next) return null
		current = next
	}
	return current
}

export function getParent(node: FSNode, root: Folder) {
	try {
		if (!node) return null
		if (node.path === '' || node.path === '/') return null
		const segments = node.path.replace(/^\//, '').split('/')
		segments.pop()
		const parentPath = segments.length ? '/' + segments.join('/') : ''
		const parent = getNode(root, parentPath)
		return parent && isFolder(parent) ? parent : null
	} catch (e) {
		if (
			e instanceof TypeError &&
			e.message.includes('Cannot read properties of null')
		) {
			console.error('An error occurred while trying to get the parent node.')
			// TODO: figure out why this is happens
			// localStorage.clear()
			// window.location.reload()
		}
		return null
	}
}

export function getFolder(fs: Folder, path: string) {
	const node = getNode(fs, path)
	if (!node) return null
	return node && isFolder(node) ? node : getParent(node, fs)
}

export function folderHas(name: string, parent: Folder): boolean {
	return parent.children.some(child => child.name === name)
}
export function nodeChildOf(node: FSNode, folder: Folder): boolean {
	if (node.path === folder.path) return false
	const folderSegments = folder.path
		.replace(/^\//, '')
		.split('/')
		.filter(Boolean)
	const nodeSegments = node.path.replace(/^\//, '').split('/').filter(Boolean)

	if (nodeSegments.length <= folderSegments.length) return false

	for (let i = 0; i < folderSegments.length; i++) {
		if (nodeSegments[i] !== folderSegments[i]) return false
	}

	return true
}

export function collectItems(node: FSNode) {
	type Item = {
		name: string
		path: string
		type: 'folder' | 'file'
		Icon: ValidComponent
	}
	if (isFolder(node)) {
		let items: Item[] = []

		items.push({
			name: node.name,
			path: node.path,
			type: 'folder',
			Icon: getNodeIcon(node)
		})

		items = items.concat(node.children.flatMap(collectItems))
		return items
	} else {
		return [
			{
				name: node.name,
				path: node.path,
				type: 'file',
				Icon: getNodeIcon(node)
			} as Item
		]
	}
}
