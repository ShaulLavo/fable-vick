import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#9CCC65" fill-rule="nonzero" style="fill:#45403d"/><path d="m17.008 12.191-2.6724 3.5643 2.0315 2.708-1.1407.85734-3.2077-4.2784l-4.2773 5.7034h15.683z" style="fill:#a9b665;stroke-width:1.0455"/>',
}

export const FolderEnvironment = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
