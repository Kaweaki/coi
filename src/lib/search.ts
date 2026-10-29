import type { Kin, Step } from '../data/kinship'
import { KINSHIP, PATH_INDEX, pathKey } from '../data/kinship'
import { parseRelation } from './parse'
import { normalize } from './text'

export type Hit = {
  kin: Kin
  /** The exact path that matched, so the breadcrumb stays truthful. */
  path: Step[]
  exact: boolean
  score: number
  /** Set when the hit came from a name the user saved, not from the query text. */
  namedAs?: string
}

const STOP = new Set([
  'my',
  'the',
  'a',
  'an',
  'of',
  'to',
  'is',
  'who',
  'that',
  'this',
  'person',
  'someone',
  'our',
  'their',
  'his',
  'her',
  'your',
  's',
])

/**
 * Fields are weighted, not flattened into one haystack: a word in `keys`
 * means "this is that relation", while the same word in a note is usually
 * an aside. Without this, "cousin" returns thím (whose note mentions
 * cousins) above the cousin entry itself.
 */
const FIELDS: Map<string, { tokens: Set<string>; phrase: string; weight: number }[]> = new Map(
  KINSHIP.map((kin) => {
    const build = (text: string, weight: number) => {
      const phrase = normalize(text).replace(/'/g, ' ').replace(/\s+/g, ' ').trim()
      const tokens = new Set<string>()
      for (const raw of phrase.split(' ')) {
        if (!raw) continue
        tokens.add(raw)
        if (raw.endsWith('s')) tokens.add(raw.slice(0, -1))
      }
      return { tokens, phrase, weight }
    }

    return [
      kin.id,
      [
        build([kin.vi, kin.you, kin.them, kin.keys.join(' ')].join(' '), 60),
        build(kin.en, 30),
        build(kin.gloss, 6),
        build(kin.note ?? '', 4),
      ],
    ]
  }),
)

function tokensOf(query: string): string[] {
  return normalize(query)
    .replace(/'/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP.has(token))
}

function scoreKin(kin: Kin, tokens: string[], phrase: string): number {
  const fields = FIELDS.get(kin.id)
  if (!fields) return 0

  let score = 0
  let phraseBonus = 0

  for (const field of fields) {
    let matched = 0
    for (const token of tokens) {
      if (field.tokens.has(token)) matched += 1
    }
    if (!matched) continue

    score += (matched / Math.max(tokens.length, 1)) * field.weight

    // Counted once, and only on the fields that *are* the relation. Stacking
    // it per field let “dượng” (en: “aunt’s husband”) outrank cô for “aunt”.
    if (field.weight >= 30 && phrase.length > 2 && field.phrase.includes(phrase)) {
      phraseBonus = 55
    }
  }

  score += phraseBonus
  if (score === 0) return 0

  // Direct relations beat deep ones when the words tie.
  score -= kin.paths[0].length * 2

  // A term that literally starts the entry ("Chú") is usually the intent.
  if (normalize(kin.vi).startsWith(phrase)) score += 45

  return score
}

const CACHE = new Map<string, Hit[]>()

export function search(query: string): Hit[] {
  const key = normalize(query).trim()
  if (key.length < 2) return []

  const cached = CACHE.get(key)
  if (cached) return cached

  const hits: Hit[] = []
  const seenPaths = new Set<string>()

  for (const path of parseRelation(query)) {
    const hit = PATH_INDEX.get(pathKey(path))
    if (!hit) continue
    const pathId = pathKey(path)
    if (seenPaths.has(pathId)) continue
    seenPaths.add(pathId)
    hits.push({ kin: hit.kin, path: hit.path, exact: true, score: 1000 })
  }

  const tokens = tokensOf(query)
  const phrase = key.replace(/'/g, ' ').replace(/\s+/g, ' ').trim()

  for (const kin of KINSHIP) {
    if (hits.some((hit) => hit.kin.id === kin.id)) continue
    const score = scoreKin(kin, tokens, phrase)
    if (score > 0) {
      hits.push({ kin, path: kin.paths[0], exact: false, score })
    }
  }

  const STRONG = 50

  const sorted = hits.sort((a, b) => {
    if (a.exact !== b.exact) return a.exact ? -1 : 1

    // Among solid matches, the closest relation leads: "aunt" should open
    // with cô and dì, not with dượng (an aunt's husband, one step further).
    if (a.score >= STRONG && b.score >= STRONG) {
      const depth = a.path.length - b.path.length
      if (depth !== 0) return depth
    }

    if (b.score !== a.score) return b.score - a.score
    return a.path.length - b.path.length
  })

  const deduped: Hit[] = []
  const seenKin = new Set<string>()
  for (const hit of sorted) {
    if (seenKin.has(hit.kin.id)) continue
    seenKin.add(hit.kin.id)
    deduped.push(hit)
  }

  CACHE.set(key, deduped)
  return deduped
}

/** Resolve an explicit path built by tapping, not typing. */
export function hitForPath(path: Step[]): Hit | null {
  const hit = PATH_INDEX.get(pathKey(path))
  if (!hit) return null
  return { kin: hit.kin, path: hit.path, exact: true, score: 1000 }
}
