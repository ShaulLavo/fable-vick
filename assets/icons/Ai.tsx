import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<defs><style>.cls-1{fill:#49160a;}.cls-2{fill:#f69f11;}</style></defs><path class="cls-1" d="M12.5,14h-9A1.55,1.55,0,0,1,2,12.5v-9A1.55,1.55,0,0,1,3.5,2l9,0A1.55,1.55,0,0,1,14.05,3.5v9A1.55,1.55,0,0,1,12.5,14Z"/><path class="cls-2" d="M6.16,4.43H7l2.12,7H7.82L6.58,6.76,5.33,11.42H4ZM5.25,9.14H7.93v1.18H5.25Z"/><path class="cls-2" d="M9.68,4.43h1.25V5.67H9.68Zm0,2h1.25v5H9.68Z"/>',
}

export const Ai = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
