import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path style="fill:#1e88e5;stroke-width:.89894" d="M125.55 98.701h331.24v883.32H125.55z" transform="matrix(.0201 0 0 .0201 1.705 1.135)"/><path d="M125.55 816.4c0-607.28 772.91-607.28 772.91-607.28v331.24s-441.66 0-441.66 276.04v165.62H125.56z" style="fill:#69f0ae;stroke-width:.89894" transform="matrix(.0201 0 0 .0201 1.705 1.135)"/>',
}

export const Twine = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
