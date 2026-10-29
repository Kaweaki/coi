/**
 * Kinship engine checks — no test framework needed.
 *
 *   npx esbuild scripts/check-kinship.ts --bundle --platform=node --format=esm \
 *     --outfile=/tmp/check-kinship.mjs && node /tmp/check-kinship.mjs
 */
import { KINSHIP, PATH_INDEX } from '../src/data/kinship'
import { GENERATIONS } from '../src/data/tree'
import { search } from '../src/lib/search'

const cases: [string, string][] = [
  ["my mother's younger brother", 'Cậu'],
  ["my father's younger brother", 'Chú'],
  ["dad's older sister", 'Cô'],
  ['my wife’s mother', 'Mẹ vợ'],
  ["my older brother's son", 'Cháu'],
  ["my mum's sister's husband", 'Dượng'],
  ['younger brother of my mother', 'Cậu'],
  ["my father's father", 'Ông nội'],
  ['grandfather', 'Ông nội'],
  ['chú', 'Chú'],
  ["my sister's husband", 'Anh rể'],
  ["my daughter's husband", 'Con rể'],
  ["my son's son", 'Cháu trai'],
  ["husband's father", 'Bố chồng'],
]

let failures = 0
for (const [query, expected] of cases) {
  const top = search(query)[0]
  const ok = top?.kin.vi === expected
  if (!ok) failures += 1
  const got = top ? `${top.kin.vi} (${top.kin.id}${top.exact ? ', exact' : ', fuzzy'})` : 'NONE'
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${query}  ->  ${got}${ok ? '' : `   [want ${expected}]`}`)
}

console.log('\nambiguity')
for (const query of ['uncle', 'aunt', 'cousin', 'brother', 'grandmother']) {
  console.log(`${query}: ${search(query).slice(0, 6).map((hit) => hit.kin.vi).join(' | ')}`)
}

console.log('\ndataset')
const ids = new Set<string>()
const seenPaths = new Map<string, string>()
for (const kin of KINSHIP) {
  if (ids.has(kin.id)) console.log('DUPLICATE ID', kin.id)
  ids.add(kin.id)
  if (!kin.paths.length) console.log('NO PATHS', kin.id)
  for (const path of kin.paths) {
    const key = path.join('>')
    if (seenPaths.has(key)) console.log(`PATH COLLISION ${key}: ${seenPaths.get(key)} / ${kin.id}`)
    seenPaths.set(key, kin.id)
  }
  for (const field of ['vi', 'you', 'self', 'them', 'gloss', 'say', 'en'] as const) {
    if (!kin[field]?.trim()) console.log(`EMPTY ${field}: ${kin.id}`)
  }
}
console.log(`entries: ${KINSHIP.length} · unique paths: ${seenPaths.size} · indexed: ${PATH_INDEX.size}`)

console.log('\nfamily map')
let mapNodes = 0
for (const generation of GENERATIONS) {
  for (const wing of generation.wings) {
    for (const node of wing.nodes) {
      if (node.self) continue
      mapNodes += 1
      if (!KINSHIP.some((kin) => kin.id === node.kinId)) {
        throw new Error(`tree node points at a missing relation: ${generation.key}/${node.vi} -> ${node.kinId}`)
      }
    }
  }
}
console.log(`generations: ${GENERATIONS.length} · pressable nodes: ${mapNodes} · every id resolves`)

console.log(failures ? `\n${failures} FAILURES` : '\nall parse cases pass')
process.exit(failures ? 1 : 0)
