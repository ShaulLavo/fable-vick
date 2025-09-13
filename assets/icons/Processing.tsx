import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 800 800' },
	c: '<svg fill="none" version="1.1" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"> <g> <g transform="translate(33.541 65)" stroke="#536dfe"> <path d="m400 500c300 0 300-400 0-400" fill="none" stroke="#536dfe" stroke-width="150"/> </g> <path d="m433.54 265-300 400" fill="none" stroke="#673ab7" stroke-width="150"/> <path d="m133.54 365 100 200" stroke="#82b1ff" stroke-width="150"/> </g>',
}

export const Processing = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
