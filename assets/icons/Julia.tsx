import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<path d="M9 11C9 12.6574 10.3433 14 12 14C13.6574 14 15 12.6574 15 11C15 9.3433 13.6574 8 12 8C10.3433 8 9 9.3433 9 11Z" fill="#BE7BDD"/> <path d="M1 11C1 12.6574 2.3433 14 4 14C5.6567 14 7 12.6574 7 11C7 9.3433 5.6567 8 4 8C2.3433 8 1 9.3433 1 11Z" fill="#DF665F"/> <path d="M5 4C5 5.6567 6.3433 7 8 7C9.65737 7 11 5.6567 11 4C11 2.3433 9.65737 1 8 1C6.3433 1 5 2.3433 5 4Z" fill="#66C155"/>',
}

export const Julia = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
