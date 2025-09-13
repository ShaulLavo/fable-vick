import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-0.9-2-2v-12c0-1.11 0.89-2 2-2h6l2 2h7c1.097 0 2 0.903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-0.23 0.87-1.01 1.5-1.93 1.5z" fill="#45403d"/><path d="m11.097 9.6131h5.3457v2.9001l3.7821-3.7754 3.7754 3.7754-3.7754 3.7821h2.9v5.3457h-5.3457v-5.3457h2.4457l-3.7821-3.7821v2.4457h-5.3457v-5.3457m0 6.6821h5.3457v5.3457h-5.3457z" fill="#a9b665" stroke-width=".66821"/>',
}

export const FolderComponentOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
