import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 16 16' },
	c: '<defs><style>.cls-1{fill:#8949ce;}</style></defs><path class="cls-1" d="M12.5,5h-4L7.15,2.75A1,1,0,1,0,5.5,2a1,1,0,0,0,.82,1L7,5H3.5a1,1,0,0,0-1,1v6.5a1,1,0,0,0,1,1.05l9-.05a1,1,0,0,0,1-1.05V6A1,1,0,0,0,12.5,5Zm-2,1.55A1.5,1.5,0,0,1,12,8a1.47,1.47,0,0,1-.32.92,1.75,1.75,0,0,0-1.52.54,1.5,1.5,0,0,1,.34-3Zm-5,0a1.5,1.5,0,0,1,.34,3,1.75,1.75,0,0,0-1.52-.54A1.47,1.47,0,0,1,4,8,1.5,1.5,0,0,1,5.5,6.5ZM9.25,12H6.75a.75.75,0,0,1,0-1.5h2.5a.75.75,0,0,1,0,1.5Z"/>',
}

export const Robots = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
