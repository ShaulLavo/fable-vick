import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m10 4h-6c-1.11 0-2 0.89-2 2v12c0 1.097 0.903 2 2 2h16c1.097 0 2-0.903 2-2v-10c0-1.11-0.9-2-2-2h-8l-2-2z" fill="#45403d" fill-rule="nonzero"/><path d="m11.097 9.6129h5.3457v2.9001l3.7821-3.7754 3.7754 3.7754-3.7754 3.7821h2.9v5.3457h-5.3457v-5.3457h2.4457l-3.7821-3.7821v2.4457h-5.3457v-5.3457m0 6.6821h5.3457v5.3457h-5.3457z" fill="#a9b665" stroke-width=".66821"/>',
}

export const FolderComponent = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
