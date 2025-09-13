import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M7 14a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2m5.65-4A5.99 5.99 0 0 0 7 6a6 6 0 0 0-6 6 6 6 0 0 0 6 6 5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4z" fill="#26a69a"/>',
}

export const Key = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
