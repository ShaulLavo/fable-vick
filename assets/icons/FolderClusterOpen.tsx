import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path fill="#45403d" d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z"/> <g transform="matrix(.67949 0 0 .67949 9.214 8.738)" fill="#010101"> <circle fill="#89b482" cx="7" cy="14" r="3"/> <circle fill="#89b482" cx="11" cy="6" r="3"/> <circle fill="#89b482" cx="16.6" cy="17.6" r="3"/> </g>',
}

export const FolderClusterOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
