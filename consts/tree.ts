import { sortTreeInDraft } from '../service/FS.service'
import { Folder } from '../types/FS.types'
// compileTime
export const initialTree: Folder = sortTreeInDraft({
	name: 'root',
	path: '',
	isOpen: true,
	children: [
		{ name: 'bun.lockb', path: 'bun.lockb' },
		{ name: 'index.html', path: 'index.html' },
		{ name: 'package.json', path: 'package.json' },
		{ name: 'README.md', path: 'README.md' },
		{
			name: 'src',
			path: 'src',
			isOpen: true,
			children: [
				{ name: 'App.module.css', path: 'src/App.module.css' },
				{ name: 'App.tsx', path: 'src/App.tsx' },
				{
					name: 'assets',
					path: 'src/assets',
					isOpen: false,
					children: [{ name: 'favicon.ico', path: 'src/assets/favicon.ico' }]
				},
				{
					name: 'components',
					path: 'src/components',
					isOpen: true,
					children: [
						{ name: 'Asci.tsx', path: 'src/components/Asci.tsx' },
						{
							name: 'FileSystem',
							path: 'src/components/FileSystem',
							isOpen: false,
							children: [
								{
									name: 'Arrow.tsx',
									path: 'src/components/FileSystem/Arrow.tsx'
								},
								{
									name: 'FileSystem.css',
									path: 'src/components/FileSystem/FileSystem.css'
								},
								{
									name: 'FileSystem.tsx',
									path: 'src/components/FileSystem/FileSystem.tsx'
								},
								{
									name: 'NameInput.tsx',
									path: 'src/components/FileSystem/NameInput.tsx'
								},
								{
									name: 'Node.tsx',
									path: 'src/components/FileSystem/Node.tsx'
								}
							]
						},
						{
							name: 'ui',
							path: 'src/components/ui',
							isOpen: false,
							children: [
								{ name: 'Button.tsx', path: 'src/components/ui/Button.tsx' },
								{ name: 'Input.tsx', path: 'src/components/ui/Input.tsx' }
							]
						}
					]
				},
				{
					name: 'consts',
					path: 'src/consts',
					isOpen: false,
					children: [
						{ name: 'demo.ts', path: 'src/consts/demo.ts' },
						{ name: 'storage.ts', path: 'src/consts/storage.ts' }
					]
				},
				{
					name: 'context',
					path: 'src/context',
					isOpen: false,
					children: [
						{ name: 'FsContext.tsx', path: 'src/context/FsContext.tsx' }
					]
				},
				{
					name: 'hooks',
					path: 'src/hooks',
					isOpen: true,
					children: [
						{ name: 'useDnd.ts', path: 'src/hooks/useDnd.ts' },
						{ name: 'useFsDnd.ts', path: 'src/hooks/useFsDnd.ts' },
						{ name: 'useOPFS.ts', path: 'src/hooks/useOPFS.ts' }
					]
				},
				{ name: 'index.css', path: 'src/index.css' },
				{ name: 'index.tsx', path: 'src/index.tsx' },
				{ name: 'logo.svg', path: 'src/logo.svg' },
				{ name: 'Main.tsx', path: 'src/Main.tsx' },
				{
					name: 'service',
					path: 'src/service',
					isOpen: false,
					children: [
						{ name: 'FS.service.ts', path: 'src/service/FS.service.ts' },
						{ name: 'OPFS.service.ts', path: 'src/service/OPFS.service.ts' }
					]
				},
				{
					name: 'stores',
					path: 'src/stores',
					isOpen: false,
					children: [{ name: 'icons.tsx', path: 'src/stores/icons.tsx' }]
				},
				{
					name: 'types',
					path: 'src/types',
					isOpen: false,
					children: [{ name: 'FS.types.ts', path: 'src/types/FS.types.ts' }]
				},
				{
					name: 'utils',
					path: 'src/utils',
					isOpen: false,
					children: [
						{ name: 'cn.ts', path: 'src/utils/cn.ts' },
						{ name: 'storage.ts', path: 'src/utils/storage.ts' }
					]
				}
			]
		},
		{ name: 'tsconfig.json', path: 'tsconfig.json' },
		{ name: 'vite.config.ts', path: 'vite.config.ts' }
	]
})
