import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<g fill="#388e3c"><path d="M11.2 21.1H8.1l-2.3-7.9v7.9H2.7V2.9h3.1l2.3 7.4V2.9h3.1zM21.3 19.2c0 1-.8 1.9-1.9 1.9h-4.8c-1 0-1.9-.8-1.9-1.9v-3.8l3.2-.7V18h2.3V7.2h3.1v12z"/></g>',
}

export const Nunjucks = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
