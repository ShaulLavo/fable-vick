import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<defs><style>.cls-1{fill:#ae5edb;}</style></defs><polygon class="cls-1" points="3 7 3 9 7 12.5 7 10.5 4 8 7 5.5 7 3.5 3 7"/><polygon class="cls-1" points="9 3.5 9 5.5 12 8 9 10.5 9 12.5 13 9 13 7 9 3.5"/>',
}

export const Eex = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
