import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<text x="3.667" y="21.362" fill="#0288d1" font-family="sans-serif" font-size="26.338" letter-spacing="0" stroke-width="1.796" word-spacing="0" style="line-height:1.25"><tspan x="3.667" y="21.362" font-family="Roboto" font-style="italic" font-weight="bold">P</tspan></text>',
}

export const Pascal = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
