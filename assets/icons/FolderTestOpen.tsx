import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-.9-2-2v-12c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" style="fill-rule:nonzero;fill:#45403d"/><g transform="matrix(.69514 0 0 .69514 8.32 6.7069)" style="fill:#a7ffeb"><path d="m7 2v2h1v14c0 2.194 1.806 4 4 4s4-1.806 4-4v-14h1v-2h-10m4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1m2-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1m1-5h-4v-3h4z" style="fill-rule:nonzero;fill:#89b482"/></g>',
}

export const FolderTestOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
