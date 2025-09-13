import { createEffect, createSignal, For, on, onMount, Show } from 'solid-js'
import { BsSearch, BsGear } from 'solid-icons/bs'
import { useFS } from '../context/FsContext'
import { collectItems, getNode } from '../service/FS.service'
import { useTheme, ThemeKey } from '../context/ThemeContext'
import { Dynamic } from 'solid-js/web'
import { useAppState } from '../context/AppStateContext'
import { autofocus } from '@solid-primitives/autofocus'
import { isFolder } from '../types/FS.types'
import { themeSettings } from '../consts/themeSettings'


type FSItem = ReturnType<typeof collectItems> extends Array<infer T> ? T : never

type CommandItem = {
	name: string
	path: string
	type: 'command'
	Icon: any
	action: 'openThemeSelector'
}

type ThemeItem = {
	name: string
	path: string
	type: 'theme'
	Icon: any
	key: ThemeKey
}

type SearchItem = FSItem | CommandItem | ThemeItem

export default function SearchPalette() {
    const { isSearchBar, setIsSearchBar } = useAppState()
    const { currentBackground, currentColor, secondaryBackground, secondaryColor, setTheme, currentThemeName } = useTheme()
	const { fs, setCurrentNode } = useFS()
	const [searchBar, setSearchBar] = createSignal<HTMLDivElement>(null!)
	const [currentFolder, setCurrentFolder] = createSignal(fs)

	const calculateDepth = (path: string) =>
		path.split('/').filter(segment => segment !== '').length

	const fileItems = () =>
		currentFolder()
			.children.flatMap(collectItems)
			.sort((a, b) => {
				const depthA = calculateDepth(a.path)
				const depthB = calculateDepth(b.path)
				if (depthA !== depthB) {
					return depthA - depthB
				}

				if (a.type !== b.type) {
					return a.type === 'folder' ? -1 : 1
				}

				return a.path.localeCompare(b.path)
			})
	const [searchQuery, setSearchQuery] = createSignal('')
	const [selectedIndex, setSelectedIndex] = createSignal(0)
	const [filteredItems, setFilteredItems] =
		createSignal<SearchItem[]>(fileItems())
	const [isKeyboardNavigating, setIsKeyboardNavigating] = createSignal(false) // New signal
	const [mode, setMode] = createSignal<'search' | 'theme'>('search')
	const [originalTheme, setOriginalTheme] = createSignal<ThemeKey | null>(null)
	let list: HTMLDivElement = null!

	createEffect(() => {
		let query = searchQuery().toLowerCase().trim()
		if (mode() === 'theme') {
			const themes = Object.keys(themeSettings) as ThemeKey[]
			const items = themes
				.map(key => ({
					name: key,
					path: 'Theme',
					type: 'theme' as const,
					Icon: BsGear,
					key
				}))
				.filter(t => !query || t.name.toLowerCase().includes(query))
			setFilteredItems(items)
			setSelectedIndex(items.length > 0 ? 0 : -1)
			return
		}

		// search mode
		let fsFiltered = fileItems()
		let commands: CommandItem[] = []
		if (!query) {
			// empty query shows filesystem only
			setFilteredItems(fsFiltered)
		} else {
			let q = query
			if (q.startsWith('folder:')) {
				fsFiltered = fsFiltered.filter(item => item.type === 'folder')
				q = q.slice(7).trim()
			}
			// create commands when user types '>' or relates to theme
			const wantsCommands = query.startsWith('>') || q.includes('theme')
			if (wantsCommands) {
				commands.push({
					name: 'Set Theme…',
					path: 'Command',
					type: 'command',
					Icon: BsGear,
					action: 'openThemeSelector'
				})
			}
			const filteredFs = fsFiltered.filter(
				item =>
					item.name.toLowerCase().includes(q) ||
					item.path.toLowerCase().includes(q)
			)
			const results: SearchItem[] = [...commands, ...filteredFs]
			setFilteredItems(results)
		}
		setSelectedIndex(filteredItems().length > 0 ? 0 : -1)
	})

	const handleKeyDown = (e: KeyboardEvent) => {
		const items = filteredItems()

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				if (items.length > 0) {
					setSelectedIndex(prev => (prev + 1) % items.length)
					setIsKeyboardNavigating(true)
				}
				break
			case 'ArrowUp':
				e.preventDefault()
				if (items.length > 0) {
					setSelectedIndex(prev => (prev - 1 + items.length) % items.length)
					setIsKeyboardNavigating(true)
				}
				break
			case 'Enter':
				e.preventDefault()
				if (items.length > 0) {
					handleSelect(items[selectedIndex()])
				}
				break
			case 'Escape':
				e.preventDefault()
				if (mode() === 'theme') {
					const prev = originalTheme()
					if (prev) setTheme(prev)
					setMode('search')
					setOriginalTheme(null)
				}
				setIsSearchBar(false)
				break
			case 'Backspace':
				if (!searchQuery() && currentFolder() !== fs) {
					e.preventDefault()
					setCurrentFolder(fs)
				}
				break
		}

		const index = selectedIndex()
		if (items.length > 0 && index >= 0 && index < items.length && list) {
			const itemTop = getItemTop(index)
			const itemHeight = list.children[index].clientHeight
			const itemBottom = itemTop + itemHeight
			const currentScrollTop = list.scrollTop
			const visibleHeight = list.clientHeight

			if (itemTop < currentScrollTop) {
				list.scrollTo({ top: itemTop, behavior: 'instant' })
			} else if (itemBottom > currentScrollTop + visibleHeight) {
				const targetScrollTop = itemBottom - visibleHeight
				list.scrollTo({ top: targetScrollTop, behavior: 'instant' })
			}
		}
	}

	// Preview theme on keyboard navigation as selection changes in theme mode
	createEffect(() => {
		if (mode() !== 'theme') return
		const idx = selectedIndex()
		const item = filteredItems()[idx] as SearchItem | undefined
		if (item && item.type === 'theme') {
			setTheme((item as ThemeItem).key)
		}
	})

	const handleSelect = (item: SearchItem) => {
		if (item.type === 'command') {
			const cmd = item as CommandItem
			if (cmd.action === 'openThemeSelector') {
				setMode('theme')
				setOriginalTheme(currentThemeName())
				setSearchQuery('')
			}
			return
		}
		if (item.type === 'theme') {
			const themeItem = item as ThemeItem
			setTheme(themeItem.key)
			setIsSearchBar(false)
			setMode('search')
			setOriginalTheme(null)
			setSearchQuery('')
			return
		}
		const node = getNode(fs, (item as FSItem).path)
		if (isFolder(node)) {
			setCurrentFolder(node)
		} else {
			setCurrentNode(getNode(fs, (item as FSItem).path) ?? fs)
			setIsSearchBar(false)
		}
	}

	const handleMouseEnter = (index: number) => {
		if (!isKeyboardNavigating()) {
			// Only set if not navigating with keyboard
			setSelectedIndex(index)
			if (mode() === 'theme') {
				const item = filteredItems()[index] as SearchItem | undefined
				if (item && item.type === 'theme') {
					setTheme((item as ThemeItem).key)
				}
			}
		}
	}

	const getItemTop = (index: number) => {
		let top = 0
		for (let j = 0; j < index; j++) {
			top += list.children[j].clientHeight
		}
		return top
	}

	// onMount(() => {
	// 	const onClick = (event: MouseEvent) => {
	// 		const el = searchBar()
	// 		if (!el) return
	// 		if (el.contains(event.target as Node)) {
	// 			console.log(' contains!')
	// 			return
	// 		}
	// 		setIsSearchBar(false)
	// 	}
	// 	document.addEventListener('click', onClick)
	// 	return () => document.removeEventListener('click', onClick)
	// })
	return (
		<Show when={isSearchBar()}>
			<div
				class="fixed inset-0 bg-black/50 z-110"
				onClick={() => {
					if (mode() === 'theme') {
						const prev = originalTheme()
						if (prev) setTheme(prev)
						setMode('search')
						setOriginalTheme(null)
					}
					setIsSearchBar(false)
				}}
			></div>
			<div class="fixed z-[120] inset-0 flex items-start justify-center pt-[10vh]">
				<div
					style={{
						color: secondaryColor(),
						'background-color': secondaryBackground()
					}}
					class="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
					ref={setSearchBar}
				>
					<div class="flex items-center px-4 py-3 border-b border-gray-700">
						<BsSearch class="w-5 h-5 mr-3" />
						<input
							type="text"
							placeholder={
								mode() === 'theme'
									? 'Filter themes…'
									: 'Search files or type > for commands'
							}
							value={searchQuery()}
							onInput={e => setSearchQuery(e.currentTarget.value)}
							onKeyDown={handleKeyDown}
							class="w-full bg-transparent text-white outline-none placeholder-gray-500"
							ref={autofocus}
							autofocus
						/>
					</div>

					<div
						ref={list}
						class="max-h-[60vh] overflow-y-auto"
						onMouseMove={() => setIsKeyboardNavigating(false)} // Detect mouse movement
					>
						<For each={filteredItems()}>
							{(item, index) => (
								<div
									class="flex items-center px-4 py-2 cursor-pointer"
									style={{
										color:
											selectedIndex() === index()
												? currentColor()
												: secondaryColor(),
										'background-color':
											selectedIndex() === index()
												? currentBackground()
												: secondaryBackground()
									}}
									onClick={() => handleSelect(item)}
									onMouseEnter={() => handleMouseEnter(index())} // Conditional hover
								>
									<Dynamic component={item.Icon} class="w-5 h-5 mr-3" />
									<div class="flex flex-col">
										<span class="font-medium">{item.name}</span>
										<span class="text-xs">{item.path}</span>
									</div>
								</div>
							)}
						</For>

						<Show when={filteredItems().length === 0}>
							<div class="px-4 py-3 text-gray-400 text-center">
								{mode() === 'theme'
									? 'No matching themes'
									: 'No matching results'}
							</div>
						</Show>
					</div>

					<div
						style={{
							color: secondaryColor(),
							'background-color': secondaryBackground()
						}}
						class="px-4 py-2 text-xs flex justify-between"
					>
						<div>
							<kbd
								class="px-1.5 py-0.5 rounded text-xs mr-1"
								style={{
									color: currentColor(),
									'background-color': currentBackground()
								}}
							>
								↑
							</kbd>
							<kbd
								class="px-1.5 py-0.5 rounded text-xs mr-1"
								style={{
									color: currentColor(),
									'background-color': currentBackground()
								}}
							>
								↓
							</kbd>
							<span class="mr-2">to navigate</span>

							<kbd
								class="px-1.5 py-0.5 rounded text-xs mr-1"
								style={{
									color: currentColor(),
									'background-color': currentBackground()
								}}
							>
								Enter
							</kbd>
							<span class="mr-2">to select</span>

							<kbd
								class="px-1.5 py-0.5 rounded text-xs mr-1"
								style={{
									color: currentColor(),
									'background-color': currentBackground()
								}}
							>
								Esc
							</kbd>
							<span>to close</span>
						</div>
						<div>{filteredItems().length} results</div>
					</div>
				</div>
			</div>
		</Show>
	)
}
