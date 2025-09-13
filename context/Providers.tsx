import type { JSX } from 'solid-js'

import { initialTree } from '../consts/tree'
import type { Folder } from '../types/FS.types'
import { AppStateProvider } from './AppStateContext'
import { FSProvider } from './FsContext'
import { TerminalProvider } from './TerminalContext'
import { FontProvider } from './FontContext'
import { ThemeProvider } from './ThemeContext'
import { LlmProvider } from './LlmContext'

// Single entry-point for all app providers + a coordinating reducer
export function Providers(props: {
	children: JSX.Element
	initialFs?: Folder
}) {
	return (
		<AppStateProvider>
			<FontProvider>
				<ThemeProvider>
					<LlmProvider>
						<FSProvider initialTree={props.initialFs ?? initialTree}>
							<TerminalProvider>{props.children}</TerminalProvider>
						</FSProvider>
					</LlmProvider>
				</ThemeProvider>
			</FontProvider>
		</AppStateProvider>
	)
}
