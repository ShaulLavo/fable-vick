import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 64 64' },
	c: '<path d="m37.275 55.618-20.29-26.686 9.53-7.247 20.29 26.686h.003l5.527 7.247z" fill="#359b8b"/><path d="M34.4 8.378 23.638 22.533V8.403H11.665V22.22l7.84 33.234h4.132V42.308l.003.003 20.29-26.686-.008-.006 5.504-7.24H34.558v.12z" fill="#3cbeae"/>',
}

export const Karma = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
