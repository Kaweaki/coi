import { KINSHIP, type Kin } from '../data/kinship'
import { normalize } from './text'

/**
 * Names you give your own relatives. Stored as kinId -> name, so a name never
 * duplicates the relationship it labels and moves with it if the label changes.
 */
export type People = Record<string, string>

export type NamedKin = { kin: Kin; name: string }

const KEY = 'coi.people'
const MAX_LENGTH = 28
const MAX_PEOPLE = 60

export function cleanName(input: string): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH)
}

export function readPeople(): People {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

    const people: People = {}
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value !== 'string') continue
      const name = cleanName(value)
      if (name) people[id] = name
    }
    return people
  } catch {
    return {}
  }
}

export function writePeople(people: People): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(people))
  } catch {
    /* private mode or quota — names simply do not persist */
  }
}

export function withName(people: People, id: string, raw: string): People {
  const name = cleanName(raw)
  const next = { ...people }
  if (!name) {
    delete next[id]
    return next
  }
  if (!next[id] && Object.keys(next).length >= MAX_PEOPLE) return people
  next[id] = name
  return next
}

export function withoutName(people: People, id: string): People {
  const next = { ...people }
  delete next[id]
  return next
}

export function nameFor(people: People, id: string): string {
  return people[id] ?? ''
}

export function namedCount(people: People): number {
  return Object.keys(people).length
}

/**
 * Name lookup, ranked: exact, then prefix, then anywhere in the name, then a
 * loose all-tokens match ("anh tu" finds "Anh Tuấn"). Diacritics are ignored so
 * "bjorn" still finds "Björn".
 */
export function findPeople(people: People, query: string): NamedKin[] {
  const needle = normalize(query)
  if (needle.length < 2) return []
  const tokens = needle.split(' ').filter(Boolean)

  const hits: { kin: Kin; name: string; score: number }[] = []
  for (const kin of KINSHIP) {
    const name = people[kin.id]
    if (!name) continue
    const hay = normalize(name)
    if (!hay) continue

    let score = 0
    if (hay === needle) score = 100
    else if (hay.startsWith(needle)) score = 80
    else if (hay.includes(needle)) score = 60
    else if (tokens.length > 1 && tokens.every((token) => hay.split(' ').some((word) => word.startsWith(token)))) {
      score = 40
    }

    if (score) hits.push({ kin, name, score })
  }

  return hits
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map(({ kin, name }) => ({ kin, name }))
}

/** Every named relative, for the account list. */
export function namedPeople(people: People): NamedKin[] {
  return Object.entries(people)
    .map(([id, name]) => {
      const kin = KINSHIP.find((entry) => entry.id === id)
      return kin ? { kin, name } : null
    })
    .filter((entry): entry is NamedKin => Boolean(entry))
    .sort((a, b) => a.name.localeCompare(b.name))
}
