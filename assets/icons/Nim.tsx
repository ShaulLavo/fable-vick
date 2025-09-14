import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M4.383 15.808 2.207 3.839l5.985 7.617L12 3.839l3.808 7.617 5.985-7.617-2.176 11.969H4.383m15.234 3.264a1.088 1.088 0 0 1-1.088 1.089H5.47a1.088 1.088 0 0 1-1.088-1.089v-1.088h15.234z" style="fill:#ffca28;stroke-width:1.0881"/>',
}

export const Nim = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
