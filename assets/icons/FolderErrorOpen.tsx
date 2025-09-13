import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<style type="text/css"> .st0{fill:#ea6962;} .st1{fill:#FFCDD2;} </style> <path class="st0" d="m19 20h-15c-1.1 0-2-.9-2-2v-12c0-1.1.9-2 2-2h6l2 2h7c1.1 0 2 .9 2 2h-17v10l2.1-8h17.1l-2.3 8.5c-.2.9-1 1.5-1.9 1.5z" style="fill:#45403d"/> <path d="m17.79 15.89h-1.18v-3.54h1.18m0 5.9h-1.18v-1.18h1.18m-.59-7.67a5.9 5.9 0 0 0-5.9 5.9 5.9 5.9 0 0 0 5.9 5.9 5.9 5.9 0 0 0 5.9-5.9 5.9 5.9 0 0 0-5.9-5.9z" style="fill:#ea6962;stroke-width:.59"/>',
}

export const FolderErrorOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
