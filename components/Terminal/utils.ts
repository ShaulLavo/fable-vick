import { hexToRgb } from '../../utils/color'

export function normalizePath(path: string): string {
  if (!path) return '/'
  const isAbs = path.startsWith('/')
  const parts = path.split('/').filter(Boolean)
  const stack: string[] = []
  for (const p of parts) {
    if (p === '.' || p === '') continue
    if (p === '..') {
      if (stack.length) stack.pop()
      continue
    }
    stack.push(p)
  }
  const joined = '/' + stack.join('/')
  return isAbs ? joined : joined || '/'
}

export function resolvePath(cwd: string, target?: string): string {
  if (!target || target.trim() === '') return cwd
  if (target.startsWith('/')) return normalizePath(target)
  const base = cwd.endsWith('/') ? cwd : cwd + '/'
  return normalizePath(base + target)
}

export const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m'
}

export function fgFromHex(hex: string | undefined): string {
  if (!hex) return '\x1b[96m'
  const rgb = hexToRgb(hex)
  if (!rgb) return '\x1b[96m'
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`
}

