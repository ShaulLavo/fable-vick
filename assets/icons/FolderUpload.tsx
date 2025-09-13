import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m10 4h-6c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2v-10c0-1.11-.9-2-2-2h-8l-2-2z" fill="#e57373" fill-rule="nonzero" style="fill:#45403d"/><path d="m15.216 17.77v-4.4011h-2.9341l5.1346-5.1346 5.1346 5.1346h-2.9341v4.4011h-4.4011m-2.9341 2.9341v-1.467h10.269v1.467z" style="fill:#e78a4e;stroke-width:.73351"/>',
}

export const FolderUpload = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
