import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-.9-2-2v-12c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#e57373" style="fill:#45403d"/><path d="m15.32 16.342 2.064-5.4897 2.0554 5.4897m-2.9226-7.8052-4.7698 12.141h1.9513l.97131-2.6017h5.4203l.97999 2.6017h1.9513l-4.7698-12.141z" style="fill:#ea6962;stroke-width:.86724"/>',
}

export const FolderFontsOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
