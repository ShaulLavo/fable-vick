import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-.9-2-2v-12c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" style="fill-rule:nonzero;fill:#45403d"/><g transform="matrix(.65434 0 0 .65434 3.2169 2.9566)" style="fill:#ffccbc"><path d="m14.167 28.901l-1.685-18.901h18.516l-1.687 18.898-7.582 2.102-7.562-2.099zm6.823-4.89l-6-3.607v-1.307l6-3.608v2.023l-3.828 2.238 3.828 2.239v2.022zm1.5-.002v-2.021l3.855-2.238-3.855-2.237v-2.022l6 3.591v1.336l-6 3.591z" style="fill:#e78a4e"/></g>',
}

export const FolderViewOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
