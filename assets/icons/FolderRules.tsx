import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m10 4h-6c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2v-10c0-1.11-.9-2-2-2h-8l-2-2z" fill="#e57373" fill-rule="nonzero" style="fill:#45403d"/><path d="m17.345 18.448-2.3198-2.3198.81772-.81772 1.5021 1.4963 3.8218-3.8218.81772.82352m-3.4797-3.4797a.57994 .57994 0 0 1 .57994 .57994 .57994 .57994 0 0 1 -.57994 .57994 .57994 .57994 0 0 1 -.57994 -.57994 .57994 .57994 0 0 1 .57994 -.57994m4.0596 0h-2.4242c-.24358-.67273-.88152-1.1599-1.6354-1.1599s-1.3919.48715-1.6354 1.1599h-2.4242a1.1599 1.1599 0 0 0 -1.1599 1.1599v8.1192a1.1599 1.1599 0 0 0 1.1599 1.1599h8.1192a1.1599 1.1599 0 0 0 1.1599 -1.1599v-8.1192a1.1599 1.1599 0 0 0 -1.1599 -1.1599z" style="fill:#ea6962;stroke-width:.57994"/>',
}

export const FolderRules = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
