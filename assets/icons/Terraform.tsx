import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 50 61' },
	c: '<g fill="#5c6bc0"><path class="rect-dark" d="m33.674 38.29 14.225-8.206V13.647L33.674 21.87"/><path class="rect-light" d="m17.888 13.647 14.225 8.223v16.42l-14.225-8.215M2.101 20.907l14.225 8.214V12.693L2.101 4.479m15.787 43.828 14.225 8.214V40.093L17.888 31.88"/></g>',
}

export const Terraform = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
