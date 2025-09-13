import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 281.25 281.25' },
	c: '<path d="m196.18 101.74-52.778 42.444 52.778 40.889V101.74m-136.67 110-30-18.889v-100L62.843 81.74l47.778 37 96.666-89.222 44.444 27.778v172.22l-55.555 22.222-85.111-81.555-51.555 41.555m3.333-48.889 20.667-19.111-20.667-19.778z" fill="#ab47bc"/>',
}

export const Visualstudio = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
