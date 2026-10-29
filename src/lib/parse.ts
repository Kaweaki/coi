import type { Step } from '../data/kinship'
import { normalize } from './text'

/**
 * Turns English (or Vietnamese) phrasing into candidate kin paths.
 *
 * "my mother's younger brother"  -> [['mother', 'youngerBrother']]
 * "dad's brother"                -> both the older and younger brother paths
 * "grandfather"                  -> both the nội and ngoại paths
 *
 * Where a word genuinely has four answers (uncle, aunt, cousin) the parser
 * gives up and lets the search index surface every option instead.
 */

type StepOption = Step[]

const WORDS: Record<string, StepOption[]> = {
  father: [['father']],
  dad: [['father']],
  daddy: [['father']],
  papa: [['father']],
  pop: [['father']],
  ba: [['father']],
  bo: [['father']],
  cha: [['father']],
  tia: [['father']],

  mother: [['mother']],
  mom: [['mother']],
  mommy: [['mother']],
  mum: [['mother']],
  mama: [['mother']],
  me: [['mother']],
  ma: [['mother']],
  u: [['mother']],

  husband: [['husband']],
  hubby: [['husband']],
  chong: [['husband']],
  wife: [['wife']],
  vo: [['wife']],
  spouse: [
    ['husband'],
    ['wife'],
  ],

  son: [['son']],
  boy: [['son']],
  daughter: [['daughter']],
  girl: [['daughter']],
  child: [
    ['son'],
    ['daughter'],
  ],
  kid: [
    ['son'],
    ['daughter'],
  ],

  brother: [['elderBrother'], ['youngerBrother']],
  sister: [['elderSister'], ['youngerSister']],
  sibling: [
    ['elderBrother'],
    ['youngerBrother'],
    ['elderSister'],
    ['youngerSister'],
  ],

  grandfather: [
    ['father', 'father'],
    ['mother', 'father'],
  ],
  grandpa: [
    ['father', 'father'],
    ['mother', 'father'],
  ],
  granddad: [
    ['father', 'father'],
    ['mother', 'father'],
  ],
  grandmother: [
    ['father', 'mother'],
    ['mother', 'mother'],
  ],
  grandma: [
    ['father', 'mother'],
    ['mother', 'mother'],
  ],
  granny: [
    ['father', 'mother'],
    ['mother', 'mother'],
  ],
}

/** Words with four or more valid readings — hand these to the search index. */
const AMBIGUOUS = new Set([
  'uncle',
  'aunt',
  'auntie',
  'cousin',
  'nephew',
  'niece',
  'relative',
  'family',
  'grandchild',
  'grandson',
  'granddaughter',
])

const FILLER = new Set([
  'my',
  'the',
  'a',
  'an',
  'our',
  'their',
  'his',
  'her',
  'your',
  'of',
  'to',
  'is',
  'who',
  'that',
  'this',
  'person',
  'people',
  'someone',
  'relative',
  'side',
  's',
])

const ELDER = new Set(['older', 'elder', 'eldest', 'oldest', 'big', 'first', 'senior'])
const YOUNGER = new Set(['younger', 'youngest', 'little', 'baby', 'small', 'second', 'junior'])

function ageFor(word: string): 'elder' | 'younger' | null {
  if (ELDER.has(word)) return 'elder'
  if (YOUNGER.has(word)) return 'younger'
  return null
}

function optionsForWords(words: string[]): StepOption[] | null {
  const age = words.map(ageFor).find(Boolean) ?? null
  const noun = words.find((word) => word in WORDS && !FILLER.has(word))
  if (!noun) return null
  if (AMBIGUOUS.has(noun)) return null

  let opts = WORDS[noun]
  if (!opts) return null

  if (age && (noun === 'brother' || noun === 'sister' || noun === 'sibling')) {
    const wantElder = age === 'elder'
    opts = opts.filter((opt) => {
      const step = opt[0]
      return wantElder ? step.startsWith('elder') : step.startsWith('younger')
    })
  }

  if (noun === 'grandfather' || noun === 'grandmother' || noun === 'grandpa' || noun === 'grandma') {
    const paternal = words.some((word) => word === 'paternal' || word === 'noi')
    const maternal = words.some((word) => word === 'maternal' || word === 'ngoai')
    if (paternal) opts = opts.filter((opt) => opt[0] === 'father')
    if (maternal) opts = opts.filter((opt) => opt[0] === 'mother')
  }

  return opts.length ? opts : null
}

function segmentsOf(query: string): string[] {
  const possessive = query.replace(/[’‘]/g, "'")
  // "younger brother of my mother" -> "my mother's younger brother"
  const reversed = possessive.match(/^(.+?)\s+of\s+(?:my\s+|our\s+)?(.+)$/)
  const text = reversed && !possessive.includes("'s") ? `${reversed[2]}'s ${reversed[1]}` : possessive

  return text
    .split(/\s*'\s*s?\b|\s*'s\b/)
    .map((part) =>
      normalize(part)
        .replace(/'/g, '')
        .trim(),
    )
    .filter(Boolean)
}

/** Cartesian product of per-segment options, capped so nothing explodes. */
function combine(groups: StepOption[][]): StepOption[] {
  let paths: StepOption[] = [[]]
  for (const group of groups) {
    const next: StepOption[] = []
    for (const path of paths) {
      for (const option of group) {
        next.push([...path, ...option])
        if (next.length >= 48) break
      }
      if (next.length >= 48) break
    }
    paths = next
  }
  return paths
}

export function parseRelation(query: string): Step[][] {
  const trimmed = normalize(query).trim()
  if (!trimmed) return []

  const segments = segmentsOf(query)
  if (!segments.length) return []

  const groups: StepOption[][] = []
  for (const segment of segments) {
    const words = segment.split(/\s+/).filter(Boolean)
    const options = optionsForWords(words)
    if (!options) return []
    groups.push(options)
  }

  return combine(groups)
}
