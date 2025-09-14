import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#45403d"/><path d="m16.599 9.132-4.4079 2.0386 0.41501 6.5536zm2.7441 0 3.9929 8.5921 0.41501-6.5536zm-1.3721 3.2597-1.5783 3.8407h3.1591zm-2.402 5.7687-0.61371 1.4865 3.0157 1.7191 3.0157-1.7191-0.61371-1.4865z" fill="#ffcdd2" stroke-width=".64389"/>',
}

export const FolderAngularOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
