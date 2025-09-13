import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<g id="vue"> <g id="Group"> <path id="Vector" d="M8 6.43898L6.34444 3.83333H3.8138L8 10.7917L12.1895 3.83333H9.65556L8 6.43898Z" fill="#3965BD"/> <path id="Vector_2" d="M8 12.1667L13 3.83333H11.3333L8 9.24999L4.66667 3.83333H3L8 12.1667Z" fill="#2ECC71"/> </g> </g>',
}

export const Vue = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
