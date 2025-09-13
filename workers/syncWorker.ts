self.onmessage = async ({ data: { buffer } }) => {
	let flagArray = new Int32Array(buffer, 0, 1)
	let sizeArray = new Int32Array(buffer, 4, 1)
	let dataArray = new Uint8Array(buffer, 8, buffer.byteLength - 8)
	const root = await navigator.storage.getDirectory()
	const fileHandle = await root.getFileHandle('example.txt')
	const syncAccessHandle = await fileHandle.createSyncAccessHandle()
	const fileSize = syncAccessHandle.getSize()
	const requiredSize = fileSize + 8
	if (requiredSize > buffer.byteLength) {
		if (requiredSize > buffer.maxByteLength) {
			throw new Error('File exceeds max buffer size of 1GB')
		}
		buffer.grow(requiredSize)
		dataArray = new Uint8Array(buffer, 8, buffer.byteLength - 8)
	}
	const dataView = new DataView(buffer, 8, fileSize)
	syncAccessHandle.read(dataView, { at: 0 })
	sizeArray[0] = fileSize
	Atomics.store(flagArray, 0, 1)
	const minimalSize = fileSize + 8
	if (buffer.byteLength > minimalSize) {
		buffer.shrink(minimalSize)
		dataArray = new Uint8Array(buffer, 8, buffer.byteLength - 8)
	}
	syncAccessHandle.close()
}
