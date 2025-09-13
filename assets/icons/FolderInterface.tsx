import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#45403d" fill-rule="nonzero"/><path d="M13.814 8.71a1.354 1.275 0 0 0-1.355 1.276v10.201a1.354 1.275 0 0 0 1.355 1.278h8.126a1.354 1.275 0 0 0 1.355-1.278v-10.2A1.354 1.275 0 0 0 21.94 8.71zm0 4.465h8.126v3.188h-8.126zm0 4.462h8.126v2.55h-8.126v-2.55z" fill="#bbdefb"/>',
}

export const FolderInterface = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
