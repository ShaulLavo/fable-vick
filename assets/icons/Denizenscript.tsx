import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<text x="2.91" y="20.739" fill="#ffd54f" font-family="sans-serif" font-size="24.416" letter-spacing="0" stroke-width="1.665" word-spacing="0" style="line-height:1.25" xml:space="preserve"><tspan x="2.91" y="20.739" font-family="Arial" font-weight="bold">D</tspan></text>',
}

export const Denizenscript = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
