// Simple per-path dirty tracking for editor files
// We leverage the existing docChanged check in the editor update listener
// to mark paths as dirty, and clear on save.

import { createSignal } from 'solid-js'

const dirty = new Map<string, boolean>()
// Baseline content per path (last known saved/loaded content)
const baseline = new Map<string, string>()
const [dirtyVersion, setDirtyVersion] = createSignal(0)

export function markDirty(path: string | undefined | null) {
  if (!path) return
  dirty.set(path, true)
  setDirtyVersion(v => v + 1)
}

export function clearDirty(path: string | undefined | null) {
  if (!path) return
  dirty.delete(path)
  setDirtyVersion(v => v + 1)
}

export function isDirty(path: string | undefined | null): boolean {
  if (!path) return false
  return !!dirty.get(path)
}

export { dirtyVersion }

// Set or update the baseline (saved) content for a path.
// Call this after loading a file from storage and after successful save.
export function setBaseline(path: string | undefined | null, content: string) {
  if (!path) return
  baseline.set(path, content)
  // Baseline changed; consumers may need to recompute dirty
  setDirtyVersion(v => v + 1)
}

export function getBaseline(path: string | undefined | null): string {
  if (!path) return ''
  return baseline.get(path) ?? ''
}

// Update dirty flag for a path by comparing provided content with baseline
export function updateDirtyForPath(
  path: string | undefined | null,
  content: string
) {
  if (!path) return
  const base = baseline.get(path) ?? ''
  const nowDirty = content !== base
  const prevDirty = !!dirty.get(path)
  if (nowDirty !== prevDirty) {
    if (nowDirty) dirty.set(path, true)
    else dirty.delete(path)
    setDirtyVersion(v => v + 1)
  }
}
