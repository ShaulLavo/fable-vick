import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<g fill="#0288d1"><path d="m5.747 14.046 6.254 8.61 6.252-8.61-6.254 3.807z"/><path d="M11.999 1.343 5.747 11.83l6.252 3.807 6.253-3.807z"/></g>',
}

export const Solidity = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
