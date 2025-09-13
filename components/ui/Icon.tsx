import { lazy } from 'solid-js'

const Icon = lazy(() => import('./IconImpl'))
export default Icon

export type { IconProps } from './IconImpl'

