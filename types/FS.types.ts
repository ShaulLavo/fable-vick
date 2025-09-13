export interface BaseNode {
	name: string
	path: string
}
export interface Folder extends BaseNode {
	children: FSNode[]
	isOpen: boolean
}
export interface File extends BaseNode {}
export type FSNode = Folder | File

export function isFolder(node: any): node is Folder {
	return node && Array.isArray(node.children)
}
