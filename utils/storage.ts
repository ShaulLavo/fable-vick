import { LOCAL_STORAGE_CAP } from '../consts/storage'

export function storageKey(key: string): string {
	return key
	const ID_NAME = 'fs-id'
	let id = localStorage.getItem(ID_NAME)
	if (!id) {
		localStorage.setItem(ID_NAME, (id = crypto.randomUUID()))
	}
	return `${key}-${id}`
}

function truncateToMaxSize(value: string, maxSize: number): string {
	if (new Blob([value]).size <= maxSize) return value
	let low = 0
	let high = value.length
	while (low <= high) {
		const mid = Math.floor((low + high) / 2)
		const size = new Blob([value.slice(0, mid)]).size
		if (size > maxSize) high = mid - 1
		else low = mid + 1
	}
	return value.slice(0, high)
}

export function cappedSetItem(key: string, value: string) {
	const newValue =
		new Blob([value]).size > LOCAL_STORAGE_CAP
			? truncateToMaxSize(value, LOCAL_STORAGE_CAP)
			: value
	localStorage.setItem(key, newValue)
}
