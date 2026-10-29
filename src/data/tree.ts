import { KIN_BY_ID } from './kinship'

export type TreeNode = {
  kinId: string
  vi: string
  en: string
  /** You are not a body to look up — render the anchor instead of a button. */
  self?: boolean
  /** Sit across the full width of the wing, for catch-all relations. */
  wide?: boolean
}

export type Wing = {
  key: 'noi' | 'ngoai' | 'both'
  /** Shown above the wing only when there are two of them, to mark the side. */
  label?: string
  nodes: TreeNode[]
}

export type Generation = {
  key: string
  vi: string
  en: string
  wings: Wing[]
}

/**
 * The sample family, read top to bottom. Two wings always mean nội on the
 * left and ngoại on the right; a single wing is your own generation or the
 * one below, where the side no longer changes the word.
 *
 * Parents sit last in their wing so bố and mẹ land on the same baseline,
 * directly above the seam that leads to you.
 */
export const GENERATIONS: Generation[] = [
  {
    key: 'ong-ba',
    vi: 'Ông bà',
    en: 'grandparents',
    wings: [
      {
        key: 'noi',
        label: 'nội',
        nodes: [
          { kinId: 'paternal-grandfather', vi: 'Ông nội', en: 'grandpa' },
          { kinId: 'paternal-grandmother', vi: 'Bà nội', en: 'grandma' },
        ],
      },
      {
        key: 'ngoai',
        label: 'ngoại',
        nodes: [
          { kinId: 'maternal-grandfather', vi: 'Ông ngoại', en: 'grandpa' },
          { kinId: 'maternal-grandmother', vi: 'Bà ngoại', en: 'grandma' },
        ],
      },
    ],
  },
  {
    key: 'bo-me',
    vi: 'Bố mẹ',
    en: 'parents and their siblings',
    wings: [
      {
        key: 'noi',
        label: 'nội',
        nodes: [
          { kinId: 'paternal-uncle-elder', vi: 'Bác', en: "dad's older brother" },
          { kinId: 'paternal-uncle-younger', vi: 'Chú', en: "dad's younger brother" },
          { kinId: 'paternal-aunt-by-younger-uncle', vi: 'Thím', en: "chú's wife" },
          { kinId: 'paternal-aunt', vi: 'Cô', en: "dad's sister" },
          { kinId: 'father', vi: 'Bố', en: 'father' },
        ],
      },
      {
        key: 'ngoai',
        label: 'ngoại',
        nodes: [
          { kinId: 'maternal-aunt', vi: 'Dì', en: "mom's sister" },
          { kinId: 'maternal-uncle', vi: 'Cậu', en: "mom's brother" },
          { kinId: 'maternal-aunt-by-uncle', vi: 'Mợ', en: "cậu's wife" },
          { kinId: 'mother', vi: 'Mẹ', en: 'mother' },
        ],
      },
    ],
  },
  {
    key: 'ban',
    vi: 'Bạn',
    en: 'you and your siblings',
    wings: [
      {
        key: 'both',
        nodes: [
          { kinId: 'elder-brother', vi: 'Anh', en: 'older brother' },
          { kinId: 'elder-sister', vi: 'Chị', en: 'older sister' },
          { kinId: 'self', vi: 'Bạn', en: 'the point of view', self: true },
          { kinId: 'younger-brother', vi: 'Em trai', en: 'younger brother' },
          { kinId: 'younger-sister', vi: 'Em gái', en: 'younger sister' },
          { kinId: 'cousin', vi: 'Anh họ', en: 'cousins · anh · chị · em họ', wide: true },
        ],
      },
    ],
  },
  {
    key: 'doi-sau',
    vi: 'Đời sau',
    en: 'the generation below',
    wings: [
      {
        key: 'both',
        nodes: [
          { kinId: 'nephew-elder-brother', vi: 'Cháu', en: 'niece · nephew', wide: true },
          { kinId: 'son', vi: 'Con trai', en: 'son' },
          { kinId: 'daughter', vi: 'Con gái', en: 'daughter' },
          { kinId: 'grandson-son', vi: 'Cháu nội', en: 'grandchild · son’s side' },
          { kinId: 'grandson-daughter', vi: 'Cháu ngoại', en: 'grandchild · daughter’s side' },
        ],
      },
    ],
  },
]

export function resolveNode(node: TreeNode) {
  if (node.self) return null
  return KIN_BY_ID[node.kinId] ?? null
}
