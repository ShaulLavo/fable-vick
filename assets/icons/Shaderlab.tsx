import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M9.961 17h-2.61l-4.91-5 4.91-5h2.61l1.31-2.26L18.061 3l1.87 6.74-1.31 2.26 1.31 2.26-1.87 6.74-6.79-1.74L9.961 17m.14-.25 5.13 1.38-2.96-5.13h-5.92l3.75 3.75m6.87.38 1.38-5.13-1.38-5.13-2.97 5.13 2.97 5.13m-6.87-9.88L6.351 11h5.92l2.96-5.13z" fill="#1976d2"/>',
}

export const Shaderlab = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
