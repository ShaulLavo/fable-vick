import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#303F9F" style="fill:#45403d"/><path d="m15.505 20.695h3.6987v-4.4385h-3.6976zm-4.4374 0h3.6987v-9.6167h-3.6987zm8.8758 0h3.6987v-4.4385h-3.6987zm-4.4374-9.6167v4.4385h8.1361v-4.4385z" style="fill:#7daea3;stroke-width:1.1328"/>',
}

export const FolderLayoutOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
