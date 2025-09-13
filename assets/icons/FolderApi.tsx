import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path fill="#45403d" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" fill-rule="nonzero"/> <path fill="#d8a657" d="M11.915 19.79h2.465v2.464h1.642v-4.107h-4.107zm2.465-6.571h-2.465v1.642h4.107v-4.107H14.38zm4.928 9.035h1.643V19.79h2.464v-1.643h-4.107zm1.643-9.035v-2.465h-1.643v4.107h4.107V13.22z"/>',
}

export const FolderApi = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
