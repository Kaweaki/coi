/**
 * Renders the family map without a browser and checks the pressable surface.
 *
 *   npx esbuild scripts/render-map.tsx --bundle --platform=node --format=esm --jsx=automatic \
 *     --external:react --external:react-dom --external:react-dom/server \
 *     --outfile=/tmp/render-map.mjs && node /tmp/render-map.mjs
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { Tree } from '../src/components/Tree'
import { GENERATIONS } from '../src/data/tree'

const nodes = GENERATIONS.flatMap((generation) =>
  generation.wings.flatMap((wing) => wing.nodes),
)
const expected = nodes.filter((node) => !node.self).length

const html = renderToStaticMarkup(<Tree onOpen={() => undefined} />)
const buttons = (html.match(/<button/g) ?? []).length
const anchor = html.includes('class="you"')
const missing = nodes.map((node) => node.vi).filter((word) => !html.includes(word))

console.log(`buttons: ${buttons}/${expected} · you anchor: ${anchor} · missing names: ${missing.length}`)

if (buttons !== expected || !anchor || missing.length) {
  if (missing.length) console.log(missing.join(', '))
  process.exit(1)
}
