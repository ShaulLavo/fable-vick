import { Cpp } from '../assets/icons/Cpp'
import { Csharp } from '../assets/icons/Csharp'
import { Css } from '../assets/icons/Css'
import { Git } from '../assets/customIcons'
import { Docker } from '../assets/icons/Docker'
import { Document } from '../assets/icons/Document'
import { FolderBase } from '../assets/icons/FolderBase'
import { FolderBaseOpen } from '../assets/icons/FolderBaseOpen'
import { Go } from '../assets/icons/Go'
import { Html } from '../assets/icons/Html'
import { Image } from '../assets/icons/Image'
import { Java } from '../assets/icons/Java'
import { Js } from '../assets/icons/Js'
import { Json } from '../assets/icons/Json'
import { Markdown } from '../assets/icons/Markdown'
import { Perl } from '../assets/icons/Perl'
import { Php } from '../assets/icons/Php'
import { Python } from '../assets/icons/Python'
import { React } from '../assets/icons/React'
import { Reactts } from '../assets/icons/Reactts'
import { Ruby } from '../assets/icons/Ruby'
import { Rust } from '../assets/icons/Rust'
import { Sass } from '../assets/icons/Sass'
import { Swift } from '../assets/icons/Swift'
import { Typescript } from '../assets/icons/Typescript'
import { Typescriptdef } from '../assets/icons/Typescriptdef'
import { Xml } from '../assets/icons/Xml'
import { Yaml } from '../assets/icons/Yaml'

export const fileExtIconMap = {
	tsx: Reactts,
	jsx: React,
	ts: Typescript,
	js: Js,
	py: Python,
	rb: Ruby,
	java: Java,
	php: Php,
	html: Html,
	css: Css,
	scss: Sass,
	json: Json,
	xml: Xml,
	yaml: Yaml,
	dockerfile: Docker,
	'd.ts': Typescriptdef,
	cpp: Cpp,
	cs: Csharp,
	go: Go,
	rs: Rust,
	pl: Perl,
	md: Markdown,
	swift: Swift,
	gitignore: Git,
	document: Document,
	png: Image,
	jpg: Image,
	jpeg: Image,
	svg: Image,
	gif: Image,
	webp: Image,
	ico: Image,
	bmp: Image,
	tiff: Image,
	tif: Image,
	heic: Image,
	heif: Image
}
export const dirNameIconMap = {
	base: FolderBase,
	baseOpen: FolderBaseOpen
}
