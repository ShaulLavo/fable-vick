import { BiSolidRename } from 'solid-icons/bi'
import {
	FaSolidFile,
	FaSolidFileCircleCheck,
	FaSolidFileCircleMinus,
	FaSolidFileCirclePlus,
	FaSolidFileImage,
	FaSolidFolderClosed,
	FaSolidFolderMinus,
	FaSolidFolderOpen,
	FaSolidFolderPlus,
	FaSolidTrashCan
} from 'solid-icons/fa'
import { FiSend } from 'solid-icons/fi'
import {
	OcChevrondown2,
	OcChevronleft2,
	OcChevronright2,
	OcChevronup2
} from 'solid-icons/oc'
import { SiReact, SiSvg, SiTypescript, SiVite } from 'solid-icons/si'
import { dirNameIconMap, fileExtIconMap } from '../consts/icons'
import { FSNode, isFolder } from '../types/FS.types'
import { BsChatLeftDotsFill, BsYinYang } from 'solid-icons/bs'
import { IconTypes } from 'solid-icons'
import { JSX, ValidComponent } from 'solid-js'
import { BlocksScale } from '../assets/icons/BlocksScale'
import { RiLogosWechat2Fill } from 'solid-icons/ri'
import { VsCircleFilled } from 'solid-icons/vs'
interface BaseIcons {
	chevronDown: ValidComponent
	chevronUp: ValidComponent
	chevronLeft: ValidComponent
	chevronRight: ValidComponent
	file: ValidComponent
	activeFile: ValidComponent
	folder: ValidComponent
	folderOpen: ValidComponent
	addFile: ValidComponent
	removeFile: ValidComponent
	addFolder: ValidComponent
	removeFolder: ValidComponent
	typescript: ValidComponent
	vite: ValidComponent
	svg: ValidComponent
	image: ValidComponent
	react: ValidComponent
	trash: ValidComponent
	rename: ValidComponent
	zen: ValidComponent
	loader: ValidComponent
	send: ValidComponent
	chat: ValidComponent
	dirty: ValidComponent
}

export const BASE_ICONS: BaseIcons = {
	chevronDown: OcChevrondown2,
	chevronUp: OcChevronup2,
	chevronLeft: OcChevronleft2,
	chevronRight: OcChevronright2,
	file: FaSolidFile,
	activeFile: FaSolidFileCircleCheck,
	folder: FaSolidFolderClosed,
	folderOpen: FaSolidFolderOpen,
	addFile: FaSolidFileCirclePlus,
	removeFile: FaSolidFileCircleMinus,
	addFolder: FaSolidFolderPlus,
	removeFolder: FaSolidFolderMinus,
	typescript: SiTypescript,
	vite: SiVite,
	svg: SiSvg,
	image: FaSolidFileImage,
	react: SiReact,
	trash: FaSolidTrashCan,
	rename: BiSolidRename,
	zen: BsYinYang,
	loader: BlocksScale,
	send: FiSend,
	chat: RiLogosWechat2Fill,
	dirty: VsCircleFilled
}
type IconSetNames = 'base' | 'cool'

const iconSet: string = 'cool'

export const getNodeIcon = (node: FSNode): ValidComponent => {
	if (iconSet === 'cool') {
		if (isFolder(node)) {
			return node.isOpen ? dirNameIconMap['baseOpen'] : dirNameIconMap['base']
		}

		const filePath = () => node?.path
		const currentExtension = () => filePath()?.split('.').pop()

		return (
			fileExtIconMap[currentExtension() as keyof typeof fileExtIconMap] ??
			fileExtIconMap.document
		)
	}
	if (!isFolder(node)) return BASE_ICONS.file
	return node.isOpen ? BASE_ICONS.folderOpen : BASE_ICONS.folder
}
