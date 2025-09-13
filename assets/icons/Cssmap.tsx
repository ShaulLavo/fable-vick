import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M18 8v2h2v10H10v-2H8v4h14V8z" style="fill:#42a5f5" transform="translate(-.233 -.5)"/><path d="m4.676 3-.489 2.51H14.4l-.33 1.623H3.865l-.496 2.502H13.58l-.571 2.863-4.118 1.36-3.569-1.36.248-1.232H3.06l-.593 3.005 5.898 2.254 6.8-2.254.902-4.53.18-.91L17.407 3z" style="fill:#42a5f5" transform="translate(-.233 -.5)"/>',
}

export const Cssmap = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
