import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 50 50' },
	c: '<g fill="#fbc02d"><g stroke-width=".283"><path d="M10.268 2.406h13.587v13.587H10.268zM26.144 17.996h13.587v13.587H26.144zM10.268 34.006h13.587v13.587H10.268z"/></g><path d="M15.327 4.553 33.63 22.858l-3.236 3.236L12.09 7.789z"/><path d="M36.54 24.267 18.235 42.572l-3.237-3.237L33.303 21.03z"/></g>',
}

export const Puppet = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
