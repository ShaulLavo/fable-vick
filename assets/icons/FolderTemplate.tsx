import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#A1887F" fill-rule="nonzero" style="fill:#45403d"/><path d="M10.6 17.829h5.333v-1.286H10.6zm0 2.571h5.333v-1.286H10.6zm0-5.143h5.333v-1.286H10.6zm0-3.857v1.286h5.333V11.4zm6.667 0H22.6v9h-5.333z" fill="#ddc7a1"/>',
}

export const FolderTemplate = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
