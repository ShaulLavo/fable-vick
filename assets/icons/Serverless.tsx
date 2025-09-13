import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<svg fill="none" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="m2.0773 16.605h3.5126l-1.0883 3.2866h-2.4243zm0-6.2483h5.5816l-1.0882 3.2866h-4.4934zm0-6.2482h7.6507l-1.0884 3.2865h-6.5623zm11.113 0h8.7328v3.2865h-9.821zm-2.0689 6.2482h10.802v3.2866h-11.89zm-2.069 6.2483h12.871v3.2866h-13.959z" fill="#ef5350" stroke-width=".94502"/>',
}

export const Serverless = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
