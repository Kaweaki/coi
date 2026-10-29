import type { CSSProperties } from 'react'

/** Staggered entrance delay for `.rise` elements. */
export function rise(index: number): CSSProperties {
  return { animationDelay: `${Math.min(index, 8) * 65}ms` }
}
