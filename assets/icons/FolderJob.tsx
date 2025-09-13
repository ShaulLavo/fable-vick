import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#7B1FA2" fill-rule="nonzero" style="fill:#45403d"/><path d="m22.409 11.145h-2.543v-1.2715c0-.35049-.14042-.66781-.37592-.89668a1.2428 1.2428 0 0 0 -.89557 -.37592h-2.543c-.69987 0-1.2715.57273-1.2715 1.2715v1.2715h-2.543c-.69988 0-1.2715.57272-1.2715 1.2715v6.9943c0 .69877.57161 1.2715 1.2715 1.2715h10.172c.69876 0 1.2715-.57273 1.2715-1.2715v-6.9932c0-.69988-.57273-1.2715-1.2715-1.2715zm-6.3574-1.2715h2.543v1.2715h-2.543zm.63464 8.582-.63574-.63574 1.9073-1.9073-1.9073-1.9073.63574-.63574 2.543 2.543z" style="fill:#e78a4e;stroke-width:1.1056"/>',
}

export const FolderJob = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
