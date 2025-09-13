import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 990 990' },
	c: '<defs/><path d="M113.26 876.74V113.27h763.47v763.47zm143.59-620.4v476.18h240.61V355.63h140.21v376.96h95.457V256.34z" fill="#e53935" stroke-width=".771" style="fill:#cb3837"/>',
}

export const Npm = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
