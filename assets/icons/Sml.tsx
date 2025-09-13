import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M4.747 6.562h6.437c1.202 0 2.176.974 2.176 2.176v8.702h-2.176V8.738H9.008v7.614H6.833V8.738H4.746v8.702H2.481V8.738a2.176 2.176 0 0 1 2.266-2.176zm10.244 0h2.176v8.702h4.352v2.176H14.99z" fill="#f44336"/>',
}

export const Sml = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
