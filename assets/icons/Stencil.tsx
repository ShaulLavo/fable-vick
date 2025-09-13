import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<g style="fill:#536dfe"><g style="fill:#448aff"><path d="M9.838 14.066h10.02L14.443 20H4.475zM26.25 7.033H5.664L.25 12.967h20.586zM12.041 0h9.984l-5.392 5.934H6.64z" style="fill:#448aff" transform="translate(1.524 4.094) scale(.79063)"/></g></g>',
}

export const Stencil = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
