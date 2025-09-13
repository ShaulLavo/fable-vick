import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-.9-2-2v-12c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#e57373" style="fill:#45403d"/><g transform="matrix(.56815 0 0 .56815 8.8739 9.409)" style="fill:#bbdefb"><g transform="translate(-3.3597e-5,-5e-5)" style="fill:#bbdefb"><path d="m9.8376 14.066h10.021l-5.4167 5.9341h-9.9666z" style="fill:#7daea3"/><path d="m26.25 7.033h-20.586l-5.4138 5.934h20.586z" style="fill:#7daea3"/><path d="m12.041 0h9.9836l-5.3917 5.9341h-9.9916z" style="fill:#7daea3"/></g></g>',
}

export const FolderStencilOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
