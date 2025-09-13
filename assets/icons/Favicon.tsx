import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m12 17.77 6.18 3.73-1.64-7.03L22 9.74l-7.19-.62L12 2.5 9.19 9.12 2 9.74l5.45 4.73-1.63 7.03z" fill="#ffd54f"/>',
}

export const Favicon = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
