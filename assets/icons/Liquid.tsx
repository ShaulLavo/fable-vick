import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M12 21.669a6.927 6.927 0 0 1-6.927-6.927C5.073 10.124 12 2.33 12 2.33s6.927 7.793 6.927 12.41A6.927 6.927 0 0 1 12 21.67z" style="fill:#29b6f6;stroke-width:1.1546"/>',
}

export const Liquid = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
