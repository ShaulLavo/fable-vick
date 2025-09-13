import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#9CCC65" style="fill:#45403d"/><path d="m17.008 12.191-2.6724 3.5644 2.0315 2.7081-1.1407.85738l-3.2077-4.2785-4.2773 5.7037h15.683z" style="fill:#a9b665;stroke-width:1.0456"/>',
}

export const FolderEnvironmentOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
