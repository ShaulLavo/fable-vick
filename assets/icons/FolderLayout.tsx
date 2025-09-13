import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#303F9F" fill-rule="nonzero" style="fill:#45403d"/><path d="m15.506 20.695h3.6989v-4.4385h-3.6977zm-4.4375 0h3.6989v-9.6167h-3.6989zm8.8761 0h3.6989v-4.4385h-3.6989zm-4.4375-9.6167v4.4385h8.1364v-4.4385z" style="fill:#7daea3;stroke-width:1.1329"/>',
}

export const FolderLayout = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
