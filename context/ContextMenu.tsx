import { createElementBounds, NullableBounds } from '@solid-primitives/bounds'
import { createEffect, createSignal, For, onCleanup, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Span } from '../components/ui/Span'
import Icon from '../components/ui/Icon'
import { useTheme } from './ThemeContext'
import { unwrap } from 'solid-js/store'

export type ContextMenuItem =
	| {
			label: string
			action?: () => void
			onHover?: () => void
			subMenuItems?: ContextMenuItem[]
	  }
	| undefined

interface ContextMenuProps {}

const [position, setPosition] = createSignal<{ x: number; y: number } | null>(
	null
)
const [items, setItems] = createSignal<(ContextMenuItem | undefined)[]>([])

function Dvider() {
	const { secondaryColor } = useTheme()
	return (
		<li class="border-t my-1" style={{ 'border-color': secondaryColor() }}></li>
	)
}

function ContextMenuItemComponent(props: {
	item?: ContextMenuItem
	onClose: () => void
	position: { x: number; y: number }
}) {
	if (!props.item) return <Dvider />
	const [itemRef, setItemRef] = createSignal<HTMLLIElement | null>(null)
	const [isHovered, setIsHovered] = createSignal(false)
	const isSubMenu = () =>
		Array.isArray(props.item!.subMenuItems) &&
		props.item!.subMenuItems.length > 0
	const showSubMenu = () => isSubMenu() && isHovered()
	const bounds = createElementBounds(itemRef)
	const { currentBackground, secondaryColor } = useTheme()
	let timeout: ReturnType<typeof setTimeout>
	return (
		<li
			onMouseEnter={() => {
				isSubMenu() && setIsHovered(true)
				props.item?.onHover?.()
			}}
			onMouseLeave={() => {
				setTimeout(() => {
					// setIsHovered(false)
				}, 1000)
			}}
			ref={setItemRef}
		>
			<Span
				enableHover
				class="w-full text-left px-8 py-2 flex items-center justify-between"
				onClick={() => {
					if (!isSubMenu()) {
						props.item!.action?.()
						props.onClose()
					}
				}}
			>
				<span>{props.item.label}</span>
				<Show when={isSubMenu()}>
					<span>
						<Icon icon="chevronRight" />
					</span>
				</Show>
			</Span>
			<Show when={showSubMenu()}>
				<Portal>
					<div
						class="absolute shadow-md  overflow-hidden"
						style={{
							left: `${props.position.x + bounds.width!}px`,
							top: `${props.position.y}px`,
							'z-index': 1000,
							background: currentBackground(),
							color: secondaryColor()
						}}
					>
						<ul class="py-2">
							<For each={props.item.subMenuItems}>
								{subItem => (
									<ContextMenuItemComponent
										item={subItem}
										onClose={props.onClose}
										position={{
											x: bounds.right!,
											y: props.position.y
										}}
									/>
								)}
							</For>
						</ul>
					</div>
				</Portal>
			</Show>
		</li>
	)
}

export function ContextMenu(props: ContextMenuProps) {
	const { currentBackground, secondaryColor } = useTheme()
	const [menuElement, setMenuElement] = createSignal<HTMLDivElement | null>(
		null
	)
	const { hideContextMenu } = useContextMenu()

	createEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (menuElement() && !menuElement()!.contains(e.target as Node)) {
				hideContextMenu()
			}
		}
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				hideContextMenu()
			}
		}
		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('keydown', handleEscape)
		onCleanup(() => {
			document.removeEventListener('mousedown', handleOutsideClick)
			document.removeEventListener('keydown', handleEscape)
		})
	})

	return (
		<Show when={position()}>
			<Portal>
				<div
					ref={setMenuElement}
					class="absolute shadow-md rounded-md overflow-hidden"
					style={{
						left: `${position()!.x}px`,
						top: `${position()!.y}px`,
						'z-index': 1000,
						background: currentBackground(),
						color: secondaryColor()
					}}
				>
					<ul class="py-2">
						<For each={items()}>
							{item => (
								<ContextMenuItemComponent
									position={{
										x: position()!.x,
										y: position()!.y
									}}
									item={item}
									onClose={hideContextMenu}
								/>
							)}
						</For>
					</ul>
				</div>
			</Portal>
		</Show>
	)
}

export function useContextMenu() {
	const showContextMenu = (
		e: MouseEvent,
		menuItems: (ContextMenuItem | undefined)[],
		offset = { x: 0, y: 0 }
	) => {
		e.preventDefault()
		e.stopPropagation()
		setPosition({ x: e.clientX + offset.x, y: e.clientY + offset.y })
		setItems(menuItems)
	}
	const hideContextMenu = () => {
		setPosition(null)
	}
	return {
		menuPosition: position,
		menuItems: items,
		showContextMenu,
		hideContextMenu
	}
}
