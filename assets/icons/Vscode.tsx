import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 300 300' },
	c: '<defs/><path d="m218.62 29.953-105.41 96.92L54.301 82.47 29.955 96.64l58.068 53.359-58.068 53.359 24.346 14.212 58.909-44.402 105.41 96.878 51.424-24.976V54.93zm0 63.744v112.6l-74.719-56.302z" fill="#2196f3" stroke-width="17.15"/>',
}

export const Vscode = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
