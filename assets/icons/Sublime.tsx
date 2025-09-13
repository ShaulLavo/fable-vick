import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<defs><clipPath id="a"><path d="M0 0h24v24H0z"/></clipPath></defs><g clip-path="url(#a)"><path d="M11.232 13.667 6.87 12.252a.343.343 0 0 1-.221-.301l-.042-3.352a.331.331 0 0 1 .216-.3l10.279-3.288c.122-.039.22.032.22.16v3.351a.34.34 0 0 1-.219.303l-4.241 1.414 4.311 1.346c.122.038.22.172.22.299v3.304a.343.343 0 0 1-.217.304L6.87 18.988c-.12.042-.218-.029-.219-.155l-.021-3.449a.333.333 0 0 1 .217-.3l4.385-1.417z" fill-rule="evenodd" fill="#FFB74D"/></g>',
}

export const Sublime = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
