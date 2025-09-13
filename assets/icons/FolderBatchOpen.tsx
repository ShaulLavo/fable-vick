import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#424242" style="fill:#45403d"/><path d="m11.83 14.525h8.4v1.4h-8.4zm0-2.8h8.4v1.4h-8.4zm0 5.6h5.6v1.4h-5.6zm7 0v4.2l3.5-2.1z" fill="#9E9E9E" style="fill:#ddc7a1"/>',
}

export const FolderBatchOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
