import {
	ClientOptions,
	loadSandpackClient,
	SandboxSetup
} from '@codesandbox/sandpack-client'
import { onMount } from 'solid-js'
import { useFS } from '../context/FsContext'
import { useOPFS } from '../hooks/useOPFS'

export function Sandpack() {
	let iframe: HTMLIFrameElement = null!
	const { currentFileContent, fs } = useFS()
	const { mapFiles } = useOPFS()
	onMount(async () => {
		const content: SandboxSetup = await mapFiles(fs)

		const options: ClientOptions = {}

		const client = await loadSandpackClient(iframe, content, options)
	})

	return <iframe class="hidden" ref={iframe} />
}
