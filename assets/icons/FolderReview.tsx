import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m10 4h-6c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2v-10c0-1.11-.9-2-2-2h-8l-2-2z" fill="#e57373" fill-rule="nonzero" style="fill:#45403d"/><path d="m17.22 14.68a1.7651 1.7651 0 0 0 -1.7651 1.7651 1.7651 1.7651 0 0 0 1.7651 1.7651 1.7651 1.7651 0 0 0 1.7651 -1.7651 1.7651 1.7651 0 0 0 -1.7651 -1.7651m0 4.707a2.9419 2.9419 0 0 1 -2.9419 -2.9419 2.9419 2.9419 0 0 1 2.9419 -2.9419 2.9419 2.9419 0 0 1 2.9419 2.9419 2.9419 2.9419 0 0 1 -2.9419 2.9419m0-7.3547c-2.9419 0-5.4542 1.8298-6.4721 4.4128 1.0179 2.583 3.5302 4.4128 6.4721 4.4128 2.9419 0 5.4542-1.8298 6.4721-4.4128-1.0179-2.583-3.5302-4.4128-6.4721-4.4128z" style="fill:#7daea3;stroke-width:.58837"/>',
}

export const FolderReview = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
