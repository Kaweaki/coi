/**
 * Renders the family map without a browser and checks the pressable surface.
 *
 *   npx esbuild scripts/render-map.tsx --bundle --platform=node --format=esm --jsx=automatic \
 *     --external:react --external:react-dom --external:react-dom/server \
 *     --outfile=node_modules/.cache/render-map.mjs && node node_modules/.cache/render-map.mjs
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { Tree } from '../src/components/Tree'
import { MAP_NODES, kinFor } from '../src/data/map'

const people = { 'paternal-grandfather': 'Ông Bảy', mother: 'Mẹ Lan' }
const html = renderToStaticMarkup(<Tree onOpen={() => undefined} people={people} />)
const nodes = (html.match(/class="node2[ "]|class="node2 [^"]*"/g) ?? []).length
const anchor = html.includes('node2--self')
const names = MAP_NODES.map((node) => (node.self ? 'Bạn' : (kinFor(node.key)?.vi ?? '')))
const missing = names.filter((name) => name && !html.includes(name))
const namedLabels = ['Ông Bảy', 'Mẹ Lan'].filter((name) => html.includes(name))

console.log(
  `map nodes: ${nodes}/${MAP_NODES.length} · bạn anchor: ${anchor} · missing names: ${missing.length} · saved labels: ${namedLabels.length}/2`,
)

if (nodes !== MAP_NODES.length || !anchor || missing.length || namedLabels.length !== 2) {
  if (missing.length) console.log(missing.join(', '))
  process.exit(1)
}
