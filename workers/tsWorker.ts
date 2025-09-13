import {
	createDefaultMapFromCDN,
	createSystem,
	createVirtualTypeScriptEnvironment,
	VirtualTypeScriptEnvironment
} from '@typescript/vfs'
import lzstring from 'lz-string'
import ts, { sys } from 'typescript'
import { createWorkerStorage } from './workerStorage'

import { createWorker } from '@valtown/codemirror-ts/worker'
import * as Comlink from 'comlink'
import { compilerOptions } from '../consts/typescript'
import { OPFS } from '../service/OPFS.service'
import type { Folder } from '../types/FS.types'

let storage: Awaited<ReturnType<typeof createWorkerStorage>>
let virtualTypeScriptEnvironment: VirtualTypeScriptEnvironment = null!
let opfsSys: (ts.System & { opfsRelease?: (p: string) => void }) | null = null
const worker = createWorker(async () => {
	storage = await createWorkerStorage()
	const fsMap = await createDefaultMapFromCDN(
		compilerOptions,
		ts.version,
		true,
		ts,
		lzstring,
		undefined,
		storage
	)

    // Preload the entire OPFS tree into the TS VFS alongside libs
	try {
		const root: Folder = { name: 'root', path: '', isOpen: true, children: [] }
		const fullTree = await OPFS.tree(root)
        const { files } = await OPFS.mapFiles(fullTree)
        for (const [p, payload] of Object.entries(files)) {
            if (typeof payload.code === 'string') {
                fsMap.set(p, payload.code)
            }
        }
        // Do not register project roots here; CM TS integration will open files as needed
    } catch (e) {
        // If OPFS is unavailable, proceed with libs only
        console.warn('[TS Worker] OPFS preload failed:', e)
    }
	const system = createSystem(fsMap)

    virtualTypeScriptEnvironment = createVirtualTypeScriptEnvironment(
        system,
        [],
        ts,
        compilerOptions
    )

	return virtualTypeScriptEnvironment
})
Comlink.expose(worker)
self.postMessage('ready')
