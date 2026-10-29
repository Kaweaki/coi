import { KIN_BY_ID } from './kinship'

/**
 * The family as one big diagram. Coordinates are in map units; the canvas is
 * 1680×1160 and the viewport pans/zooms over it. You sit at the centre of your
 * own generation, ancestors above, descendants below.
 */
export type MapNode = {
  key: string
  kinId: string
  x: number
  y: number
  self?: boolean
}

export const MAP_W = 1680
export const MAP_H = 1160

export const MAP_NODES: MapNode[] = [
  { key: 'ong-noi', kinId: 'paternal-grandfather', x: 410, y: 120 },
  { key: 'ba-noi', kinId: 'paternal-grandmother', x: 560, y: 120 },
  { key: 'ong-ngoai', kinId: 'maternal-grandfather', x: 1090, y: 120 },
  { key: 'ba-ngoai', kinId: 'maternal-grandmother', x: 1240, y: 120 },

  { key: 'bac', kinId: 'paternal-uncle-elder', x: 180, y: 380 },
  { key: 'chu', kinId: 'paternal-uncle-younger', x: 330, y: 380 },
  { key: 'thim', kinId: 'paternal-aunt-by-younger-uncle', x: 480, y: 380 },
  { key: 'co', kinId: 'paternal-aunt', x: 630, y: 380 },
  { key: 'bo', kinId: 'father', x: 780, y: 380 },

  { key: 'me', kinId: 'mother', x: 1020, y: 380 },
  { key: 'di', kinId: 'maternal-aunt', x: 1170, y: 380 },
  { key: 'cau', kinId: 'maternal-uncle', x: 1320, y: 380 },
  { key: 'mo', kinId: 'maternal-aunt-by-uncle', x: 1470, y: 380 },

  { key: 'cousin', kinId: 'cousin', x: 180, y: 640 },
  { key: 'anh', kinId: 'elder-brother', x: 590, y: 640 },
  { key: 'chi', kinId: 'elder-sister', x: 720, y: 640 },
  { key: 'you', kinId: 'self', x: 850, y: 640, self: true },
  { key: 'em-trai', kinId: 'younger-brother', x: 980, y: 640 },
  { key: 'em-gai', kinId: 'younger-sister', x: 1110, y: 640 },

  { key: 'chau', kinId: 'nephew-elder-brother', x: 560, y: 890 },
  { key: 'con-trai', kinId: 'son', x: 850, y: 890 },
  { key: 'con-gai', kinId: 'daughter', x: 1000, y: 890 },

  { key: 'chau-noi', kinId: 'grandson-son', x: 850, y: 1090 },
  { key: 'chau-ngoai', kinId: 'grandson-daughter', x: 1000, y: 1090 },
]

export const MAP_BY_KEY: Record<string, MapNode> = Object.fromEntries(
  MAP_NODES.map((node) => [node.key, node]),
)

/** Blood lines. A couple draws one trunk from their midpoint, then fans out. */
export const MAP_FAMILIES: { parents: string[]; children: string[] }[] = [
  { parents: ['ong-noi', 'ba-noi'], children: ['bac', 'chu', 'co', 'bo'] },
  { parents: ['ong-ngoai', 'ba-ngoai'], children: ['me', 'di', 'cau'] },
  { parents: ['bo', 'me'], children: ['you', 'anh', 'chi', 'em-trai', 'em-gai'] },
  { parents: ['bac'], children: ['cousin'] },
  { parents: ['anh'], children: ['chau'] },
  { parents: ['you'], children: ['con-trai', 'con-gai'] },
  { parents: ['con-trai'], children: ['chau-noi'] },
  { parents: ['con-gai'], children: ['chau-ngoai'] },
]

export const MAP_SPOUSES: [string, string][] = [
  ['ong-noi', 'ba-noi'],
  ['ong-ngoai', 'ba-ngoai'],
  ['chu', 'thim'],
  ['cau', 'mo'],
  ['bo', 'me'],
]

/** Sibling rows, used only for the path finder — no extra ink on the map. */
const SIBLINGS: string[][] = [
  ['bac', 'chu', 'co', 'bo'],
  ['me', 'di', 'cau'],
  ['you', 'anh', 'chi', 'em-trai', 'em-gai'],
]

const adjacency: Record<string, string[]> = {}
const link = (a: string, b: string) => {
  adjacency[a] = adjacency[a] ?? []
  adjacency[b] = adjacency[b] ?? []
  if (!adjacency[a].includes(b)) adjacency[a].push(b)
  if (!adjacency[b].includes(a)) adjacency[b].push(a)
}

for (const family of MAP_FAMILIES) {
  for (const parent of family.parents) for (const child of family.children) link(parent, child)
}
for (const [a, b] of MAP_SPOUSES) link(a, b)
for (const group of SIBLINGS) {
  for (const a of group) for (const b of group) if (a !== b) link(a, b)
}

export const MAP_ADJ = adjacency

/** Shortest chain of people from you to a node, inclusively. */
export function pathTo(target: string): string[] {
  if (target === 'you') return ['you']
  const previous = new Map<string, string>()
  const seen = new Set(['you'])
  const queue = ['you']

  while (queue.length) {
    const current = queue.shift() as string
    if (current === target) break
    for (const next of MAP_ADJ[current] ?? []) {
      if (seen.has(next)) continue
      seen.add(next)
      previous.set(next, current)
      queue.push(next)
    }
  }

  if (!previous.has(target)) return []
  const chain = [target]
  let cursor = target
  while (cursor !== 'you') {
    cursor = previous.get(cursor) as string
    chain.unshift(cursor)
  }
  return chain
}

export function kinFor(key: string) {
  const node = MAP_BY_KEY[key]
  if (!node || node.self) return null
  return KIN_BY_ID[node.kinId] ?? null
}
