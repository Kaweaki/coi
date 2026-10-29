/** Tiny localStorage helpers — the app works fine when storage is blocked. */

export function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function writeList(key: string, value: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value.slice(0, 24)))
  } catch {
    /* private mode, quota, or storage disabled */
  }
}
