import { list as opfsList, statPath as opfsStatPath } from '../../../service/OPFS.service'
import { resolvePath } from '../utils'

export type IO = { writeln: (s?: string) => void }

export async function cmdLs(args: string[], cwd: string, io: IO) {
  const target = args[0]
  const p = target ? resolvePath(cwd, target) : cwd
  try {
    const stat = await opfsStatPath(p)
    if (!stat) return io.writeln(`ls: cannot access ${p}: No such file or directory`)
    if (stat.isFile) {
      const name = p.split('/').filter(Boolean).pop() || '/'
      io.writeln(name)
      return
    }
    const entries = await opfsList(p)
    const out = entries.map(e => (e.kind === 'dir' ? e.name + '/' : e.name)).join('  ')
    io.writeln(out)
  } catch (e: any) {
    io.writeln(`ls: ${e?.message ?? String(e)}`)
  }
}

export async function cmdCd(args: string[], cwd: string, io: IO): Promise<string> {
  const target = args[0] ?? '/'
  const next = resolvePath(cwd, target)
  const stat = await opfsStatPath(next)
  if (!stat) { io.writeln(`cd: no such file or directory: ${target}`); return cwd }
  if (stat.isFile) { io.writeln(`cd: not a directory: ${target}`); return cwd }
  return next
}

