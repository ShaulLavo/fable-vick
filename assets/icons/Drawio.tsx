import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<g transform="translate(39.905 2.332) scale(.74832)" fill="#fb8c00"><path d="m-36.654 8.842 1.76-1.017 5.1 8.833-1.76 1.017zM-44.781 16.642l5.083-8.804 1.766 1.02-5.083 8.804z"/><rect x="-42.373" y="1.19" width="10.166" height="8.5" rx="1.35"/><rect x="-34.918" y="16.15" width="10.166" height="8.5" rx="1.35"/><rect x="-49.828" y="16.15" width="10.166" height="8.5" rx="1.35"/></g>',
}

export const Drawio = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
