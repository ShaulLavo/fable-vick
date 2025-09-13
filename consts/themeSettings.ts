import { Extension } from '@codemirror/state'
import {
	duotoneDark,
	duotoneDarkBracketColors,
	duotoneLight,
	duotoneLightBracketColors,
	xTermDuotoneDarkTheme,
	xTermDuotoneLightTheme
} from '../themes/duotone'
import {
	githubDark,
	githubDarkBracketColors,
	githubLight,
	githubLightBracketColors,
	xTermGithubDarkTheme,
	xTermGithubLightTheme
} from '../themes/github'
import {
	dark,
	darkBracketColors,
	darkColors,
	light,
	lightBracketColors,
	lightColors,
	xTermDarkTheme,
	xTermlightTheme
} from '../themes/light'
import { mojo, mojoBracketColors, xTermMojoTheme } from '../themes/mojo'
import {
	baseColors,
	poimandres,
	poimandresBracketColors,
	xTermPoimandresTheme
} from '../themes/poimandres'
import {
	tokyoNight,
	tokyoNightBracketColors,
	xTermTokyoNightTheme
} from '../themes/toktoNight'
import {
	tokyoNightDay,
	tokyoNightDayBracketColors,
	xTermTokyoNightDayTheme
} from '../themes/tokyoNightDay'
import {
	tokyoNightStorm,
	tokyoNightStormBracketColors,
	xTermTokyoNightStormTheme
} from '../themes/tokyoNightStorm'
import {
	whiteDark,
	whiteDarkBracketColors,
	whiteLight,
	whiteLightBracketColors,
	xTermWhiteDarkTheme,
	xTermWhiteLightTheme
} from '../themes/white'
import {
	xCodeDarkBracketColors,
	xCodeLightBracketColors,
	xTermXcodeDarkTheme,
	xTermXcodeLightTheme,
	xcodeDark,
	xcodeLight
} from '../themes/xcode'

const themeCSSMap = {
	xcodeLight: () => import('highlight.js/styles/xcode.min.css?raw'),
	githubLight: () => import('highlight.js/styles/github.min.css?raw'),
	githubDark: () => import('highlight.js/styles/github-dark.min.css?raw'),
	tokyoNightDark: () => import('highlight.js/styles/tokyo-night-dark.css?raw'),
	tokyoNightLight: () =>
		import('highlight.js/styles/tokyo-night-light.css?raw'),
	white: () => import('highlight.js/styles/isbl-editor-light.min.css?raw'),
	black: () => import('highlight.js/styles/ir-black.min.css?raw'),
	greyScale: () => import('highlight.js/styles/grayscale.min.css?raw'),
	hybrid: () => import('highlight.js/styles/hybrid.min.css?raw'),
	googleCode: () => import('highlight.js/styles/googlecode.min.css?raw'),
	tokyoNightBright: () =>
		import('highlight.js/styles/tomorrow-night-bright.min.css?raw'),
	vs2015: () => import('highlight.js/styles/vs2015.min.css?raw'),
	pandaSyntaxDark: () =>
		import('highlight.js/styles/panda-syntax-dark.min.css?raw'),
	nord: () => import('highlight.js/styles/nord.min.css?raw'),
	felipec: () => import('highlight.js/styles/felipec.min.css?raw')
}

type ThemeSettingType = {
	theme: Extension
	background: string
	color: string
	secondaryColor: string
	secondaryBackground: string
	mode: 'light' | 'dark'
	xTermTheme: any
	color1: string
	color2: string
	rainbowBracket: Record<BracketColors, `#${string}`>
	hljsCss: () => Promise<{ default: string }>
}
type BracketColors =
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'indigo'
	| 'violet'

export const themeSettings = {
	xcodeDark: {
		theme: xcodeDark,
		background: '#292A30',
		color: '#DABAFF',
		secondaryBackground: '#32343A',
		secondaryColor: '#E6E0FF',
		mode: 'dark',
		xTermTheme: xTermXcodeDarkTheme,
		color1: '\x1b[38;2;255;129;112m',
		color2: '\x1b[38;2;107;223;255m',
		rainbowBracket: xCodeDarkBracketColors,
		hljsCss: themeCSSMap.vs2015
	},
	xcodeLight: {
		theme: xcodeLight,
		background: '#fff',
		color: '#522BB2',
		secondaryBackground: '#f3f4f6',
		secondaryColor: '#4725A4',
		mode: 'light',
		xTermTheme: xTermXcodeLightTheme,
		color1: '\x1b[38;2;210;52;35m',
		color2: '\x1b[38;2;3;47;98m',
		rainbowBracket: xCodeLightBracketColors,
		hljsCss: themeCSSMap.xcodeLight
	},
	white: {
		theme: whiteLight,
		background: '#ffffff',
		color: '#000000',
		secondaryBackground: '#f2f2f2',
		secondaryColor: '#333333',
		mode: 'light',
		xTermTheme: xTermWhiteLightTheme,
		color1: '\x1b[38;2;4;49;250m',
		color2: '\x1b[38;2;107;122;136m',
		rainbowBracket: whiteLightBracketColors,
		hljsCss: themeCSSMap.white
	},
	black: {
		theme: whiteDark,
		background: '#000000',
		color: '#ffffff',
		secondaryBackground: '#101010',
		secondaryColor: '#E6E6E6',
		mode: 'dark',
		xTermTheme: xTermWhiteDarkTheme,
		color1: '\x1b[38;2;187;154;247m',
		color2: '\x1b[38;2;168;168;177m',
		rainbowBracket: whiteDarkBracketColors,
		hljsCss: themeCSSMap.black
	},
	duotoneDark: {
		theme: duotoneDark,
		background: '#2a2734',
		color: '#7a63ee',
		secondaryBackground: '#343046',
		secondaryColor: '#9A8CFF',
		mode: 'dark',
		xTermTheme: xTermDuotoneDarkTheme,
		color1: '\x1b[38;2;250;173;92m',
		color2: '\x1b[38;2;154;134;253m',
		rainbowBracket: duotoneDarkBracketColors,
		hljsCss: themeCSSMap.hybrid
	},
	duotoneLight: {
		theme: duotoneLight,
		background: '#faf8f5',
		color: '#896724',
		secondaryBackground: '#f0ede9',
		secondaryColor: '#6F521B',
		mode: 'light',
		xTermTheme: xTermDuotoneLightTheme,
		color1: '\x1b[38;2;6;50;137m',
		color2: '\x1b[38;2;22;89;223m',
		rainbowBracket: duotoneLightBracketColors,
		hljsCss: themeCSSMap.hybrid
	},
	githubDark: {
		theme: githubDark,
		background: '#0d1117',
		color: '#ff7b72',
		secondaryBackground: '#161b22',
		secondaryColor: '#FFA29C',
		mode: 'dark',
		xTermTheme: xTermGithubDarkTheme,
		color1: '\x1b[38;2;255;123;114m',
		color2: '\x1b[38;2;121;192;255m',
		rainbowBracket: githubDarkBracketColors,
		hljsCss: themeCSSMap.githubDark
	},
	githubLight: {
		theme: githubLight,
		background: '#fff',
		color: '#d73a49',
		secondaryBackground: '#f6f8fa',
		secondaryColor: '#B02A3A',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '\x1b[38;2;215;58;73m',
		color2: '\x1b[38;2;0;92;197m',
		rainbowBracket: githubLightBracketColors,
		hljsCss: themeCSSMap.githubLight
	},
	tokyoNight: {
		theme: tokyoNight,
		background: '#1a1b26',
		color: '#787c99',
		secondaryBackground: '#232437',
		secondaryColor: '#9AA0C3',
		mode: 'dark',
		xTermTheme: xTermTokyoNightTheme,
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m',
		rainbowBracket: tokyoNightBracketColors,
		hljsCss: themeCSSMap.tokyoNightDark
	},
	tokyoNightDay: {
		theme: tokyoNightDay,
		background: '#e1e2e7',
		color: '#3760bf',
		secondaryBackground: '#d6d7de',
		secondaryColor: '#2D4EA0',
		mode: 'light',
		xTermTheme: xTermTokyoNightDayTheme,
		color1: '\x1b[38;2;245;42;101m',
		color2: '\x1b[38;2;55;96;191m',
		rainbowBracket: tokyoNightDayBracketColors,
		hljsCss: themeCSSMap.tokyoNightLight
	},
	tokyoNightStorm: {
		theme: tokyoNightStorm,
		background: '#24283b',
		color: '#2ac3de',
		secondaryBackground: '#2F3450',
		secondaryColor: '#5FD6EA',
		mode: 'dark',
		xTermTheme: xTermTokyoNightStormTheme,
		color1: '\x1b[38;2;255;83;112m',
		color2: '\x1b[38;2;122;162;247m',
		rainbowBracket: tokyoNightStormBracketColors,
		hljsCss: themeCSSMap.tokyoNightBright
	},
	poimandres: {
		theme: poimandres,
		background: baseColors.bg,
		color: baseColors.white,
		secondaryBackground: '#232635',
		secondaryColor: baseColors.offWhite,
		mode: 'dark',
		xTermTheme: xTermPoimandresTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;255m',
		rainbowBracket: poimandresBracketColors,
		hljsCss: themeCSSMap.pandaSyntaxDark
	},
	light: {
		theme: light,
		background: lightColors.background,
		color: lightColors.foreground,
		secondaryBackground: '#f0f0ee',
		secondaryColor: '#141C2C',
		mode: 'light',
		xTermTheme: xTermlightTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;253m',
		rainbowBracket: lightBracketColors,
		hljsCss: themeCSSMap.googleCode
	},
	dark: {
		theme: dark,
		background: darkColors.background,
		color: darkColors.text,
		secondaryBackground: '#3A3535',
		secondaryColor: '#FFFFFF',
		mode: 'dark',
		xTermTheme: xTermDarkTheme,
		color1: '\x1b[38;2;208;103;157m',
		color2: '\x1b[38;2;173;215;253m',
		rainbowBracket: darkBracketColors,
		hljsCss: themeCSSMap.greyScale
	},

	defaultLight: {
		theme: [],
		background: '#ffffff',
		color: '#000000',
		secondaryBackground: '#f5f5f5',
		secondaryColor: '#333333',
		mode: 'light',
		xTermTheme: xTermGithubLightTheme,
		color1: '',
		color2: '',
		rainbowBracket: {
			red: '#FF0000',
			orange: '#FFA500',
			yellow: '#FFFF00',
			green: '#008000',
			blue: '#0000FF',
			indigo: '#00BFFF',
			violet: '#FF00FF'
		},
		hljsCss: themeCSSMap.greyScale
	},
	mojo: {
		theme: mojo,
		background: '#1E1E1E',
		color: '#A6A6A6',
		secondaryBackground: '#2A2A2A',
		secondaryColor: '#C7C7C7',
		mode: 'dark',
		xTermTheme: xTermMojoTheme,
		color1: '\x1b[38;2;200;100;100m',
		color2: '\x1b[38;2;65;166;217m',
		rainbowBracket: mojoBracketColors,
		hljsCss: themeCSSMap.pandaSyntaxDark
	}
} as const satisfies Record<string, ThemeSettingType>
