import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<path fill-rule="evenodd" clip-rule="evenodd" d="M3 2V5L6.5 8L3 11V14L9.5 8L3 2ZM9 12H13C13.5523 12 14 12.4477 14 13C14 13.5523 13.5523 14 13 14H9C8.44772 14 8 13.5523 8 13C8 12.4477 8.44772 12 9 12Z" fill="#2DA3F9"/>',
}

export const Bat = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
