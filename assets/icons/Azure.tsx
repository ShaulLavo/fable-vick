import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M13.098 3.885 6.311 18.327l-4.769-.052 5.323-9.161 6.233-5.23m.732 1.14 8.627 15.09H6.5l9.726-1.735-5.093-6.055z" style="fill:#1e88e5;stroke-width:1.0458"/>',
}

export const Azure = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
