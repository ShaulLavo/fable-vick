import { file } from 'opfs-tools'
import { Component, createSignal, createEffect, on, Show } from 'solid-js'
import { useFS } from '../context/FsContext'
import { Spinner, SpinnerType } from 'solid-spinner'
const ImageViewer: Component<{ fileData?: Uint8Array }> = props => {
	const [imgUrl, setImgUrl] = createSignal<string | null>(null)

	createEffect(() => {
		const blob = new Blob([props.fileData || new Uint8Array()], {
			type: 'image/png'
		})
		const url = URL.createObjectURL(blob)
		setImgUrl(prev => {
			if (prev) URL.revokeObjectURL(prev)
			return url
		})
	})

	return (
		<div>
			<Show when={imgUrl()} fallback={<Spinner type={SpinnerType.tailSpin} />}>
				<img
					src={imgUrl()!}
					class='class="w-full h-full object-contain"'
					alt="Image"
				/>
			</Show>
		</div>
	)
}
export default ImageViewer
