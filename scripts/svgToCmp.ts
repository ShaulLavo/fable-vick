import fs from 'fs'
import path from 'path'
import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypescript from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'
import xml2js from 'xml2js'

export const makeSvgComponents = compileTime(async () => {
	const sourceDir = path.resolve(__dirname, '../assets/svg/icons2')
	const targetDir = path.resolve(__dirname, '../assets/icons')

	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir)
	}

	const svgFiles = fs
		.readdirSync(sourceDir)
		.filter(file => file.endsWith('.svg'))

	function toPascalCase(str: string): string {
		return str
			.split(/[-_]/) // Split by hyphen or underscore
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join('')
	}
	for (const file of svgFiles) {
		const svgPath = path.join(sourceDir, file)
		const svgContent = fs.readFileSync(svgPath, 'utf-8')

		try {
			// Parse the SVG content
			const result = await xml2js.parseStringPromise(svgContent)
			const svg = result.svg
			if (!svg) {
				console.error(`No <svg> element found in ${file}`)
				continue
			}

			// Extract the viewBox attribute
			const viewBox = svg.$?.viewBox
			if (!viewBox) {
				console.error(`No viewBox attribute in ${file}`)
				continue
			}

			// Extract the inner content of the SVG (everything between <svg> and </svg>)
			const startIndex = svgContent.indexOf('>') + 1
			const endIndex = svgContent.lastIndexOf('<')
			let innerContent = svgContent.slice(startIndex, endIndex).trim()

			// Minimize whitespace and escape single quotes for string safety
			innerContent = innerContent.replace(/\s+/g, ' ')
			innerContent = innerContent.replace(/'/g, "\\'")

			// Generate the component name from the file name
			const baseName = path.basename(file, '.svg')
			const componentName = toPascalCase(baseName)

			// Generate the component code
			const componentCode = `
			import { CustomIcon, IconBaseProps } from 'solid-icons';

			type Props = Exclude<IconBaseProps, 'src'>

			const iconContent = {
			a: { fill: "currentColor", viewBox: "${viewBox}" },
			c: '${innerContent}',
			};

			export const ${componentName} = (props: Props) => <CustomIcon size={16} color="#2c4f7c" {...props} src={iconContent} />;
      `.trim()
			const code = await format(componentCode, {
				parser: 'typescript',
				plugins: [prettierPluginTypescript, prettierPluginEstree],
				semi: false,
				trailingComma: 'es5',
				singleQuote: true,
				printWidth: 100,
				tabWidth: 4,
				useTabs: true,
				jsxSingleQuote: true,
				bracketSpacing: true,
				jsxBracketSameLine: false,
				arrowParens: 'always'
			})

			const targetFile = path.join(targetDir, `${componentName}.tsx`)
			fs.writeFileSync(targetFile, code, 'utf-8')

			console.log(`Created component: ${componentName}.tsx`)
		} catch (err) {
			console.error(`Error processing ${file}:`, err)
		}
	}
})
