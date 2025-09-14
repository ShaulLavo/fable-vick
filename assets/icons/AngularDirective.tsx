import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m9.8691 2.5-6.8457 3.166 0.64453 10.178zm4.2617 0 6.2012 13.344 0.64453-10.178zm-2.1309 5.0625-2.4512 5.9648h4.9062zm-3.7305 8.959-0.95312 2.3086 4.6836 2.6699 4.6836-2.6699-0.95312-2.3086z" fill="#ab47bc"/>',
}

export const AngularDirective = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
