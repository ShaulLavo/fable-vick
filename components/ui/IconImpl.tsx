import { JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { BASE_ICONS } from '../../stores/icons'

type IconPropsBase = {
  icon: keyof typeof BASE_ICONS
}

// Common props supported by solid-icons components
type IconVisualProps = {
  size?: number | string
  color?: string
  class?: string
}

export type IconProps = IconPropsBase & IconVisualProps & JSX.HTMLAttributes<SVGSVGElement>

export default function Icon(props: IconProps) {
  const { icon, ...rest } = props
  return <Dynamic component={BASE_ICONS[icon]} {...rest} />
}

