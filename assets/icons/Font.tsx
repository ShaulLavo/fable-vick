import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M8.98 14.538 12 6.507l3.007 8.031M10.731 3.119 3.753 20.882h2.855l1.42-3.806h7.93l1.434 3.806h2.855L13.269 3.119z" fill="#f44336"/>',
}

export const Font = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
