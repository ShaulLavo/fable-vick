import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#FF5722" fill-rule="nonzero" style="fill:#45403d"/><path d="m18.755 10.609c-.1328 0-.26392.05267-.36808.15683l-7.1664 7.1664v2.5734h2.5734l7.176-7.1567c.20832-.20832.20832-.53104 0-.73936l-1.8436-1.8436c-.10416-.10416-.23848-.15683-.37128-.15683zm-.76496 7.8129-2.0837 2.0837h7.8129v-2.0837z" style="fill:#e78a4e;stroke-width:1.0416"/>',
}

export const FolderCustom = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
