import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 300 300' },
	c: '<path d="M151.48 27.937v120.54H30.94v117.58h238.12V27.927z" style="fill:#4caf50;paint-order:fill markers stroke" transform="translate(0 3)"/>',
}

export const Wallaby = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
