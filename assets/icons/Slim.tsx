import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M6.959 2.5a4.605 4.605 0 0 0-4.615 4.615v9.957a4.605 4.605 0 0 0 4.615 4.615h9.957a4.605 4.605 0 0 0 4.615-4.615V7.115A4.605 4.605 0 0 0 16.916 2.5zm4.938 2.691a6.811 6.811 0 0 1 6.81 6.813H13.43L9.938 7.287l.699 4.717H5.086a6.811 6.811 0 0 1 6.81-6.813z" fill="#f57f17"/>',
}

export const Slim = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
