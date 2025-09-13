import Dialog from '@corvu/dialog'
import { JSX, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useTheme } from '../../context/ThemeContext'

type Action = {
	label: string
	value: string
	// visual hint only
	variant?: 'primary' | 'secondary' | 'danger'
}

export type ConfirmOptions = {
	title: string
	description?: string | JSX.Element
	actions: Action[] // order defines emphasis; first is primary
}

let enqueueConfirm: (opts: ConfirmOptions) => Promise<string>

export function openConfirm(opts: ConfirmOptions) {
	if (!enqueueConfirm) {
		console.warn('ConfirmDialogHost is not mounted yet')
	}
	return enqueueConfirm?.(opts) ?? Promise.resolve('cancel')
}

export const ConfirmDialogHost = () => {
	const [open, setOpen] = createSignal(false)
	const [options, setOptions] = createSignal<ConfirmOptions | null>(null)
	const { currentBackground, currentColor } = useTheme()
	let resolver: (value: string) => void = () => {}

	const close = (value: string) => {
		setOpen(false)
		// Wait a tick for dialog to close before resolving
		queueMicrotask(() => {
			resolver?.(value)
			setOptions(null)
		})
	}

	enqueueConfirm = (opts: ConfirmOptions) => {
		setOptions(opts)
		setOpen(true)
		return new Promise<string>(resolve => {
			resolver = resolve
		})
	}

	onCleanup(() => {
		// If host unmounts while a dialog is open, ensure promises settle
		if (open()) resolver?.('cancel')
		enqueueConfirm = undefined
	})

	// Render the dialog at end of body
	return (
		<Portal>
			<Dialog open={open()} onOpenChange={setOpen} modal>
				<Dialog.Portal>
					<Dialog.Overlay
						style={{
							position: 'fixed',
							inset: '0',
							'background-color': 'rgba(0,0,0,0.35)'
						}}
					/>
					<Dialog.Content
						style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							'min-width': '360px',
							'max-width': 'min(92vw, 520px)',
							padding: '16px',
							'border-radius': '8px',
							'background-color': currentBackground(),
							color: currentColor(),
							'box-shadow': '0 10px 30px rgba(0,0,0,0.35)'
						}}
					>
						<Show when={options()}>
							{opts => (
								<div
									style={{
										display: 'flex',
										'flex-direction': 'column',
										gap: '12px'
									}}
								>
									<Dialog.Label
										style={{ 'font-size': '14px', 'font-weight': 600 }}
									>
										{opts().title}
									</Dialog.Label>
									<Show when={opts().description}>
										<Dialog.Description
											style={{ 'font-size': '12px', opacity: 0.85 }}
										>
											{opts().description}
										</Dialog.Description>
									</Show>
									<div
										style={{
											display: 'flex',
											'justify-content': 'flex-end',
											gap: '8px',
											'margin-top': '8px'
										}}
									>
										{opts().actions.map((a, i) => (
											<button
												onClick={() => close(a.value)}
												style={{
													padding: '6px 10px',
													'font-size': '12px',
													'border-radius': '6px',
													border: '1px solid rgba(255,255,255,0.15)',
													cursor: 'pointer',
													'background-color':
														a.variant === 'danger'
															? 'rgba(220, 38, 38, 0.1)'
															: i === 0 || a.variant === 'primary'
																? 'rgba(255,255,255,0.08)'
																: 'transparent',
													color: currentColor()
												}}
											>
												{a.label}
											</button>
										))}
									</div>
								</div>
							)}
						</Show>
						<Dialog.Close />
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog>
		</Portal>
	)
}
