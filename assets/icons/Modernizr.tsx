import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path fill="#E91E63" d="M2 16.8v-3.2h3.2v-3.2h3.2V7.2h3.2v9.6zM12.4 7.2a9.6 9.6 0 0 1 9.6 9.6h-9.6V7.2z"/>',
}

export const Modernizr = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
