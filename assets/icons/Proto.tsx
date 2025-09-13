import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 200 200' },
	c: '<g stroke-width="1.786"><path d="M17.493 82.498 99.999 28.34v35.003L17.493 117.5z" fill="#ff5722"/><path d="m17.493 117.501 82.506 54.159v-35.003L17.493 82.498z" fill="#03a9f4"/><path d="M182.506 117.501 100 171.66v-35.003l82.506-54.159z" fill="#ffeb3b"/><path d="M182.506 82.498 100 28.34v35.003l82.506 54.158z" fill="#00e676"/></g>',
}

export const Proto = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
