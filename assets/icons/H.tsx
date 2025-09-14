import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M16.745 19.818h-3.007v-5.882q0-2.381-1.736-2.381-.869 0-1.438.663-.56.662-.56 1.718v5.882H6.988V4.533h3.016v6.508h.037q1.186-1.802 3.193-1.802 3.511 0 3.511 4.239z" fill="#0277bd" aria-label="h"/>',
}

export const H = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
