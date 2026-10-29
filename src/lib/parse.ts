import type { Step } from '../data/kinship'
import { normalize } from './text'

/**
 * Turns English, Vietnamese or Swedish phrasing into candidate kin paths.
 *
 * "my mother's younger brother"  -> [['mother', 'youngerBrother']]
 * "min mammas yngre bror"        -> [['mother', 'youngerBrother']]
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
  spouse: [['husband'], ['wife']],

  son: [['son']],
  boy: [['son']],
  daughter: [['daughter']],
  girl: [['daughter']],
  child: [['son'], ['daughter']],
  kid: [['son'], ['daughter']],

  brother: [['elderBrother'], ['youngerBrother']],
  sister: [['elderSister'], ['youngerSister']],
  sibling: [['elderBrother'], ['youngerBrother'], ['elderSister'], ['youngerSister']],

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

/**
 * Swedish is possessive by prefix ("min mammas") rather than by clitic
 * ("mother's"), so it gets its own segmenter: every noun is one generation step,
 * and a preceding age adjective picks the sibling variant.
 */
const SV_WORDS: Record<string, StepOption[]> = {
  mamma: [['mother']],
  mor: [['mother']],
  moder: [['mother']],
  pappa: [['father']],
  far: [['father']],
  fader: [['father']],
  syster: [['elderSister'], ['youngerSister']],
  bror: [['elderBrother'], ['youngerBrother']],
  broder: [['elderBrother'], ['youngerBrother']],
  storasyster: [['elderSister']],
  lillasyster: [['youngerSister']],
  storebror: [['elderBrother']],
  lillebror: [['youngerBrother']],
  mormor: [['mother', 'mother']],
  morfar: [['mother', 'father']],
  farmor: [['father', 'mother']],
  farfar: [['father', 'father']],
  faster: [
    ['father', 'elderSister'],
    ['father', 'youngerSister'],
  ],
  moster: [
    ['mother', 'elderSister'],
    ['mother', 'youngerSister'],
  ],
  farbror: [
    ['father', 'elderBrother'],
    ['father', 'youngerBrother'],
  ],
  morbror: [
    ['mother', 'elderBrother'],
    ['mother', 'youngerBrother'],
  ],
  son: [['son']],
  dotter: [['daughter']],
  barn: [['son'], ['daughter']],
  fru: [['wife']],
  maka: [['wife']],
  man: [['husband']],
  make: [['husband']],
  systerson: [
    ['elderSister', 'son'],
    ['youngerSister', 'son'],
  ],
  systerdotter: [
    ['elderSister', 'daughter'],
    ['youngerSister', 'daughter'],
  ],
  brorson: [
    ['elderBrother', 'son'],
    ['youngerBrother', 'son'],
  ],
  brorsdotter: [
    ['elderBrother', 'daughter'],
    ['youngerBrother', 'daughter'],
  ],
  svarmor: [
    ['husband', 'mother'],
    ['wife', 'mother'],
  ],
  svarfar: [
    ['husband', 'father'],
    ['wife', 'father'],
  ],
}

const SV_FILLER = new Set([
  'min',
  'mitt',
  'mina',
  'var',
  'vår',
  'vart',
  'våra',
  'hans',
  'hennes',
  'deras',
  'den',
  'det',
  'dom',
  'de',
  'som',
  'till',
  'av',
  'i',
  'på',
  'är',
])

const SV_ELDER = new Set(['aldre', 'aldst', 'stora', 'stor', 'forsta'])
const SV_YOUNGER = new Set(['yngre', 'yngst', 'lilla', 'liten', 'andra', 'minsta'])

/** Words that mark a query as Swedish. Several also read as English nouns, so
 *  they only *try* Swedish first; the English pass still runs if it comes back empty. */
const SV_CUES = new Set([
  'min',
  'mitt',
  'mina',
  'mamma',
  'pappa',
  'mormor',
  'morfar',
  'farmor',
  'farfar',
  'faster',
  'moster',
  'farbror',
  'morbror',
  'syster',
  'bror',
  'broder',
  'fru',
  'maka',
  'man',
  'make',
  'svarmor',
  'svarfar',
  'systerson',
  'systerdotter',
  'brorson',
  'brorsdotter',
  'son',
  'dotter',
  'barn',
])

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

function filterByAge(opts: StepOption[], age: 'elder' | 'younger'): StepOption[] {
  const filtered = opts.filter((opt) => {
    const step = opt[0]
    return age === 'elder' ? step.startsWith('elder') : step.startsWith('younger')
  })
  return filtered.length ? filtered : opts
}

function parseSwedish(query: string): Step[][] {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return []

  const groups: StepOption[][] = []
  let age: 'elder' | 'younger' | null = null
  let sawNoun = false

  for (const raw of words) {
    if (SV_FILLER.has(raw)) continue

    const direct = SV_WORDS[raw]
    // Genitive: "mammas", "fars", "systers" — but never strip a word that is
    // itself a noun ("barn" stays barn, "far" stays far).
    const stripped = raw.endsWith('s') ? SV_WORDS[raw.slice(0, -1)] : undefined
    const opts = direct ?? stripped

    if (!opts) {
      if (SV_ELDER.has(raw)) {
        age = 'elder'
        continue
      }
      if (SV_YOUNGER.has(raw)) {
        age = 'younger'
        continue
      }
      return []
    }

    sawNoun = true
    groups.push(age ? filterByAge(opts, age) : opts)
    age = null
  }

  if (!sawNoun) return []
  return combine(groups)
}

function looksSwedish(query: string): boolean {
  return normalize(query)
    .split(' ')
    .some((word) => SV_CUES.has(word) || SV_CUES.has(word.replace(/s$/, '')))
}

export function parseRelation(query: string): Step[][] {
  const trimmed = normalize(query).trim()
  if (!trimmed) return []

  // A Swedish cue means the Swedish pass gets first refusal — otherwise a word
  // like “son” would end the English parse early and drop “min brors”.
  if (looksSwedish(trimmed)) {
    const swedish = parseSwedish(query)
    if (swedish.length) return swedish
  }

  const segments = segmentsOf(query)
  const english: StepOption[][] = []
  let englishOk = segments.length > 0

  for (const segment of segments) {
    const words = segment.split(/\s+/).filter(Boolean)
    const options = optionsForWords(words)
    if (!options) {
      englishOk = false
      break
    }
    english.push(options)
  }

  if (englishOk && english.length) return combine(english)
  return parseSwedish(query)
}
