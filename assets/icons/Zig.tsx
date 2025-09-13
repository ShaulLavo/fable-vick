import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<g style="fill:#f7a41d"><g style="fill:#f9a825"><path d="M0 10v80h19l6-10 12-10H20V30h15V10zm40 0v20h62V10zm91 0-6 10-12 10h17v40h-15v20h35V10zM48 70v20h62V70z" style="fill:#f9a825;shape-rendering:crispEdges" transform="matrix(.13568 0 0 .13568 1.824 5.214)"/><path d="M37 70 19 90V75zM113 30l18-20v15zM96.98 10.63 133.26.23 52.97 89.4 16.69 99.8z" style="fill:#f9a825" transform="matrix(.13568 0 0 .13568 1.824 5.214)"/></g></g>',
}

export const Zig = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
