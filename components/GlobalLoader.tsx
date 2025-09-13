import { Show } from 'solid-js/web'
import { useAppState } from '../context/AppStateContext'
import { useTheme } from '../context/ThemeContext'
import Icon from './ui/Icon'

export const GlobalLoader = (props: { show?: boolean }) => {
    const { isGlobalLoading } = useAppState()
    const { currentColor } = useTheme()
	return (
		<Show when={props.show ?? isGlobalLoading()}>
			<div class="fixed top-0 left-0 w-full h-full bg-black/50 z-120 flex items-center justify-center">
				<Icon color={currentColor()} icon="loader" size={100} />
			</div>
		</Show>
	)
}

export const Loader = (props: { show: boolean; class?: string }) => {
    const { currentColor } = useTheme()
	return (
		<Show when={props.show}>
			<Icon color={currentColor()} icon="loader" class={props.class} size={30} />
		</Show>
	)
}
