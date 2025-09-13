import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M11 10H5L3 8l2-2h6V3l1-1 1 1v1h6l2 2-2 2h-6v2h6l2 2-2 2h-6v6a2 2 0 0 1 2 2H9a2 2 0 0 1 2-2V10z" fill="#43a047"/>',
}

export const Routing = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
