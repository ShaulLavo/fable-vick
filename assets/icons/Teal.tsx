import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 200 200' },
	c: '<path d="M100 21.838A78.162 78.162 0 0 0 21.838 100 78.162 78.162 0 0 0 100 178.162 78.162 78.162 0 0 0 178.162 100 78.162 78.162 0 0 0 100 21.838zm2.532 30.56h38.814v38.813h-38.814z" fill="#00acc1"/>',
}

export const Teal = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
