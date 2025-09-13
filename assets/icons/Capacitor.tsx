import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19.081 2.35-4.795 4.795L9.62 2.482 7.05 5.05l4.664 4.665 2.57 2.57 4.705 4.705 2.57-2.57-4.705-4.705 4.795-4.797zM5.052 7.05l-2.57 2.57 4.665 4.664L2.35 19.08l2.57 2.57 4.796-4.796 4.704 4.705 2.57-2.57-7.274-7.274z" style="fill:#4fc3f7;paint-order:fill markers stroke"/>',
}

export const Capacitor = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
