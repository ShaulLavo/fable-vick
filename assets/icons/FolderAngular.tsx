import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#45403d" fill-rule="nonzero"/><path d="m16.599 9.132-4.4079 2.0386 0.41501 6.5536zm2.7441 0 3.9929 8.5921 0.41501-6.5536zm-1.3721 3.2597-1.5783 3.8407h3.1591zm-2.402 5.7687-0.61371 1.4865 3.0157 1.7191 3.0157-1.7191-0.61371-1.4865z" fill="#ffcdd2" stroke-width=".64389"/>',
}

export const FolderAngular = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
