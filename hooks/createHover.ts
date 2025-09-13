import { createSignal } from 'solid-js'

export function createHover() {
	const [isHovered, setIsHovered] = createSignal(false)
	const onMouseEnter = () => setIsHovered(true)
	const onMouseLeave = () => setIsHovered(false)
	return { isHovered, bind: { onMouseEnter, onMouseLeave } }
}
