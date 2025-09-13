import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#FFB300" style="fill:#45403d"/><path d="m11.375 11.618h3.0812v-3.0812h-3.0812zm4.6218 9.2436h3.0812v-3.0812h-3.0812zm-4.6218 0h3.0812v-3.0812h-3.0812zm0-4.6218h3.0812v-3.0812h-3.0812zm4.6218 0h3.0812v-3.0812h-3.0812zm4.6218-7.703v3.0812h3.0812v-3.0812zm-4.6218 3.0812h3.0812v-3.0812h-3.0812zm4.6218 4.6218h3.0812v-3.0812h-3.0812zm0 4.6218h3.0812v-3.0812h-3.0812z" style="fill:#ea6962;stroke-width:.94806"/>',
}

export const FolderAppOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
