import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 323 323' },
	c: '<path fill="#f0ad00" d="m106.716 99.763 54.785 54.782 54.779-54.782z"/><path fill="#7fd13b" d="M96.881 89.93H216.83l-55.18-55.184H41.7zM228.427 101.523l59.705 59.704L228.16 221.2l-59.705-59.704z"/><path fill="#60b5cc" d="m175.552 34.746 112.703 112.695V34.746z"/><path fill="#5a6378" d="m34.746 281.3 119.8-119.8-119.8-119.8z"/><path fill="#f0ad00" d="m288.255 175.01-53.148 53.149 53.148 53.14z"/><path fill="#60b5cc" d="M281.3 288.254 161.5 168.455l-119.8 119.8z"/>',
}

export const Elm = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
