import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m18.93 12-3.47 6H8.54l-3.47-6 3.47-6h6.92l3.47 6m4.84 0-4.04 7L18 18l3.46-6L18 6l1.73-1 4.04 7M.23 12l4.04-7L6 6l-3.46 6L6 18l-1.73 1-4.04-7z" fill="#42a5f5"/>',
}

export const Xaml = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
