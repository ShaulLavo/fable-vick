import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<path d="m19 20h-15c-1.11 0-2-.9-2-2v-12c0-1.11.89-2 2-2h6l2 2h7c1.097 0 2 .903 2 2h-17v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="#e57373" style="fill:#45403d"/><path d="m17.22 14.679a1.7651 1.7651 0 0 0 -1.7651 1.7651 1.7651 1.7651 0 0 0 1.7651 1.7651 1.7651 1.7651 0 0 0 1.7651 -1.7651 1.7651 1.7651 0 0 0 -1.7651 -1.7651m0 4.707a2.9419 2.9419 0 0 1 -2.9419 -2.9419 2.9419 2.9419 0 0 1 2.9419 -2.9419 2.9419 2.9419 0 0 1 2.9419 2.9419 2.9419 2.9419 0 0 1 -2.9419 2.9419m0-7.3547c-2.9419 0-5.4542 1.8298-6.4721 4.4128 1.0179 2.583 3.5302 4.4128 6.4721 4.4128 2.9419 0 5.4542-1.8298 6.4721-4.4128-1.0179-2.583-3.5302-4.4128-6.4721-4.4128z" style="fill:#7daea3;stroke-width:.58837"/>',
}

export const FolderReviewOpen = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
