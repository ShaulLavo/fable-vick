import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 300 300' },
	c: '<g style="mix-blend-mode:normal" transform="translate(-1638 -1844)"><path d="M1788 1886a108.02 108.02 0 0 0-104.92 82.828 114.07 64.249 0 0 1 104.92-39.053 114.07 64.249 0 0 1 104.96 39.261 108.02 108.02 0 0 0-104.96-83.037zm-104.96 133.01a108.02 108.02 0 0 0 104.96 83.037 108.02 108.02 0 0 0 104.92-82.828 114.07 64.249 0 0 1-104.92 39.053 114.07 64.249 0 0 1-104.96-39.261z" style="fill:#f57c00;paint-order:fill markers stroke"/><circle cx="1699.5" cy="2110.8" r="22.627" style="fill:#9e9e9e;paint-order:fill markers stroke"/><circle cx="1684.3" cy="1892.6" r="16.617" style="fill:#616161;mix-blend-mode:normal;paint-order:fill markers stroke"/><circle cx="1879.8" cy="1877.4" r="21.213" style="fill:#757575;mix-blend-mode:normal;paint-order:fill markers stroke"/></g>',
}

export const Jupyter = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
