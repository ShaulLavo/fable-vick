import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" style="fill:#45403d"/><path d="M19.7 9h-9.3C9.6 9 9 9.6 9 10.3v9.3c0 .7.6 1.3 1.3 1.3h9.3c.7 0 1.3-.6 1.3-1.3v-9.3c.1-.7-.5-1.3-1.2-1.3zm0 10.7h-9.3v-8h9.3v8z" style="fill:#b388ff"/>',
}

export const FolderModal = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
