import { CustomIcon, IconBaseProps } from 'solid-icons'

type Props = Exclude<IconBaseProps, 'src'>

const iconContent = {
	a: { fill: 'currentColor', viewBox: '0 0 24 24' },
	c: '<defs/><g transform="translate(1.956 5.304) scale(.06696)" data-name="Layer 2" style="fill-rule:evenodd;fill:none"><g id="Mark"><path class="cls-1" style="fill:#00ff93" d="M100 49v100L0 100V0zM201 100V0l99 49z"/><path class="cls-2" style="fill:#00b368" d="M100 49v100l101-49V0zM201 100v100l99-51V49z"/></g></g>',
}

export const Buildkite = (props: Props) => (
	<CustomIcon size={16} color='#2c4f7c' {...props} src={iconContent} />
)
