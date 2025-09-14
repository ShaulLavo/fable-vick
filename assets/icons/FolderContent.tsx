import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill="#45403d" fill-rule="nonzero"/><path d="m17.51 14.937h3.9322v.96533h-3.9322zm0-1.6082h3.9322v.96533h-3.9322zm0 3.2163h3.9322v.96533h-3.9322zm4.4944-6.7541h-10.114c-.6181 0-1.1233.57941-1.1233 1.2867v8.3633c0 .70733.50523 1.2857 1.1233 1.2857h10.115c.61702 0 1.1233-.57834 1.1233-1.2867v-8.3633c0-.70626-.50523-1.2857-1.1244-1.2857zm0 9.649h-5.0566v-8.3633h5.0566z" style="fill:#7daea3;stroke-width:1.075"/>',
}

export const FolderContent = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
