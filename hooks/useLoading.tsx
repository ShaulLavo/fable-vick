import { createMemo, createSignal } from 'solid-js'

export const useLoading = () => {
	const [loaderCount, setLoaderCount] = createSignal(0)
	const isLoading = createMemo(() => loaderCount() > 0)
	const setIsLoading = (loading: boolean) => {
		if (loading) {
			setLoaderCount(c => c + 1)
		} else {
			setLoaderCount(c => Math.max(0, c - 1))
		}
	}
	return { isLoading, setIsLoading }
}
