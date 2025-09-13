import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m10 4h-6c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2v-10c0-1.11-.9-2-2-2h-8l-2-2z" fill="#e57373" fill-rule="nonzero" style="fill:#45403d"/><path d="m21.981 19.546h-8.6215v-6.774h8.6215m0-3.0791h-.61582v-1.2316h-1.2316v1.2316h-4.9266v-1.2316h-1.2316v1.2316h-.61582c-.68356 0-1.2316.55424-1.2316 1.2316v8.6215a1.2316 1.2316 0 0 0 1.2316 1.2316h8.6215a1.2316 1.2316 0 0 0 1.2316 -1.2316v-8.6215a1.2316 1.2316 0 0 0 -1.2316 -1.2316m-1.5211 4.9635-.65277-.65277-3.0052 3.0052-1.3055-1.3055-.65277.65277 1.9583 1.9583z" style="fill:#7daea3;stroke-width:.61582"/>',
}

export const FolderTasks = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
