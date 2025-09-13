import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path fill="#45403d" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill-rule="nonzero"/> <g transform="matrix(.67949 0 0 .67949 9.214 8.738)" fill="#010101"> <circle fill="#89b482" cx="7" cy="14" r="3"/> <circle fill="#89b482" cx="11" cy="6" r="3"/> <circle fill="#89b482" cx="16.6" cy="17.6" r="3"/> </g>',
}

export const FolderCluster = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
