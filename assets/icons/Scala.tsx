import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 256 256' },
	c: '<g fill="#f44336" fill-rule="evenodd"><path d="m53.461 50.891 149.1-21.982v49.488l-149.1 21.982zM53.447 114.328l149.1-21.982v49.488l-149.1 21.982zM53.442 177.6l149.098-21.983v49.488L53.442 227.087z"/><path d="m56.28 91.659 95.604 30.921-2.832 8.757-95.604-30.921zM106.94 61.374l95.604 30.922-2.832 8.757-95.604-30.922zM56.278 155.037l95.604 30.921-2.832 8.758-95.604-30.922zM106.948 124.651l95.604 30.922-2.833 8.757-95.603-30.922z"/></g>',
}

export const Scala = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
