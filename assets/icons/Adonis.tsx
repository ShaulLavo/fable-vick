import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 180 180' },
	c: '<path d="m79.579 25.741-66.481 115.15h63.305l11.218-19.433H47.613L79.804 65.7l20.005 34.649 11.423-19.783zm42.118 50.221-45.203 78.297h90.408z" style="fill:#7c4dff;paint-order:fill markers stroke;stroke-width:1.0631"/>',
}

export const Adonis = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
