import { KIN_BY_ID } from '../data/kinship'

export type TreeNode = { kinId: string; vi: string; en: string; self?: boolean }

export type Branch = {
  key: string
  label: string
  sub: string
  nodes: TreeNode[]
}

export const BRANCHES: Branch[] = [
  {
    key: 'noi',
    label: 'Bên nội',
    sub: "father's side",
    nodes: [
      { kinId: 'paternal-grandfather', vi: 'Ông nội', en: 'grandpa' },
      { kinId: 'paternal-grandmother', vi: 'Bà nội', en: 'grandma' },
      { kinId: 'paternal-uncle-elder', vi: 'Bác', en: "dad's older brother" },
      { kinId: 'paternal-uncle-younger', vi: 'Chú', en: "dad's younger brother" },
      { kinId: 'paternal-aunt-by-younger-uncle', vi: 'Thím', en: "chú's wife" },
      { kinId: 'paternal-aunt', vi: 'Cô', en: "dad's sister" },
      { kinId: 'father', vi: 'Bố', en: 'father' },
    ],
  },
  {
    key: 'ngoai',
    label: 'Bên ngoại',
    sub: "mother's side",
    nodes: [
      { kinId: 'maternal-grandfather', vi: 'Ông ngoại', en: 'grandpa' },
      { kinId: 'maternal-grandmother', vi: 'Bà ngoại', en: 'grandma' },
      { kinId: 'maternal-aunt', vi: 'Dì', en: "mom's sister" },
      { kinId: 'maternal-uncle', vi: 'Cậu', en: "mom's brother" },
      { kinId: 'maternal-aunt-by-uncle', vi: 'Mợ', en: "cậu's wife" },
      { kinId: 'mother', vi: 'Mẹ', en: 'mother' },
    ],
  },
  {
    key: 'self',
    label: 'Bạn',
    sub: 'you and your generation',
    nodes: [
      { kinId: 'elder-brother', vi: 'Anh', en: 'older brother' },
      { kinId: 'elder-sister', vi: 'Chị', en: 'older sister' },
      { kinId: 'cousin', vi: 'Anh họ', en: 'cousin' },
      { kinId: 'self', vi: 'Bạn', en: 'you', self: true },
      { kinId: 'younger-brother', vi: 'Em trai', en: 'younger brother' },
      { kinId: 'younger-sister', vi: 'Em gái', en: 'younger sister' },
    ],
  },
  {
    key: 'sau',
    label: 'Đời sau',
    sub: 'the generation below',
    nodes: [
      { kinId: 'nephew-elder-brother', vi: 'Cháu', en: 'nephew · niece' },
      { kinId: 'son', vi: 'Con trai', en: 'son' },
      { kinId: 'daughter', vi: 'Con gái', en: 'daughter' },
      { kinId: 'grandson-son', vi: 'Cháu nội', en: 'grandson' },
      { kinId: 'grandson-daughter', vi: 'Cháu ngoại', en: 'grandson' },
    ],
  },
]

export function resolveNode(node: TreeNode) {
  if (node.self) return null
  return KIN_BY_ID[node.kinId] ?? null
}
