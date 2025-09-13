import { ReactiveMap } from '@solid-primitives/map'
import { isDev } from 'solid-js/web'
export const enum ACTIONS {
	SAVE_FILE = 'SAVE_FILE',
	GET_FILE = 'GET_FILE',
	MOVE = 'MOVE',
	REMOVE = 'REMOVE',
	TREE = 'TREE',
	WRITE = 'WRITE',
	READ_CHUNK = 'READ_CHUNK',
	MAP_FILES = 'MAP_FILES',
	CREATE_FILE = 'CREATE_FILE',
	CREATE_FOLDER = 'CREATE_FOLDER'
}
const pendingActions = new ReactiveMap<ACTIONS, number>()

export const isLoading = () => pendingActions.size > 0
export const actions = () => Array.from(pendingActions.keys())

const logs: Array<any[]> = []
const immediateActions = [ACTIONS.TREE]

export const measure = async <T, Args extends unknown[]>(
	action: ACTIONS,
	data: Record<string, any>,
	fn: (...args: Args) => Promise<T>,
	...args: Args
): Promise<T> => {
	addAction(action)
	const start = performance.now()
	try {
		return await fn(...args)
	} finally {
		const duration = performance.now() - start
		const source = data.source ? `${data.source} ` : ''
		delete data.source
		if (isDev) {
			const log = [`${source}${action}`, `${duration.toFixed(2)} ms`, data]
			if (immediateActions.includes(action)) {
				console.info(`${log[0]} took ${log[1]} ms`)
			} else {
				logs.push(log)
			}
		}

		removeAction(action)
	}
}
setInterval(() => {
	if (logs.length > 0) {
		console.table(logs)
		logs.length = 0
	}
}, 2000)

const addAction = (action: ACTIONS) => {
	const count = pendingActions.get(action) ?? 0
	pendingActions.set(action, count + 1)
}
const removeAction = (action: ACTIONS) => {
	const count = pendingActions.get(action) ?? 0
	if (count <= 1) {
		pendingActions.delete(action)
	} else {
		pendingActions.set(action, count - 1)
	}
}

export const observeFirstContentfulPaint = () => {
	const { promise, resolve } = Promise.withResolvers<void>()
	const observer = new PerformanceObserver(list => {
		for (const entry of list.getEntries()) {
			if (entry.name === 'first-contentful-paint') {
				console.log(
					`First Contentful Paint took ${entry.startTime.toFixed(2)} ms`
				)

				resolve()
				observer.disconnect()
			}
		}
	})

	observer.observe({ type: 'paint', buffered: true })
	return promise
}
