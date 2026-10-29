import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MAP_BY_KEY,
  MAP_FAMILIES,
  MAP_H,
  MAP_NODES,
  MAP_SPOUSES,
  MAP_W,
  kinFor,
  pathTo,
} from '../data/map'
import type { Hit } from '../lib/search'
import { useLang } from '../lib/lang'
import { rise } from '../lib/motion'
import { ArrowIcon, SparkIcon, TargetIcon } from './Icons'

const ZOOMS = [0.55, 0.65, 0.75, 0.9, 1.05]
const START = 2
const HALF_W = 60
const HALF_H = 29
const YOU = MAP_BY_KEY.you

function down(topX: number, topY: number, bottomX: number, bottomY: number) {
  const bend = Math.max(52, Math.abs(bottomY - topY) * 0.55)
  return `M ${topX} ${topY + HALF_H} C ${topX} ${topY + HALF_H + bend}, ${bottomX} ${
    bottomY - HALF_H - bend
  }, ${bottomX} ${bottomY - HALF_H}`
}

function across(leftX: number, rightX: number, y: number) {
  const from = leftX + HALF_W
  const to = rightX - HALF_W
  const mid = (from + to) / 2
  const lift = Math.min(42, Math.max(8, (to - from) * 0.4))
  return `M ${from} ${y} C ${mid} ${y - lift}, ${mid} ${y - lift}, ${to} ${y}`
}

export function Tree({ onOpen }: { onOpen: (hit: Hit) => void }) {
  const { t } = useLang()
  const [selected, setSelected] = useState<string | null>(null)
  const [zoomIndex, setZoomIndex] = useState(START)
  const scroller = useRef<HTMLDivElement | null>(null)
  const zoom = ZOOMS[zoomIndex]

  const trunkPaths = useMemo(
    () =>
      MAP_FAMILIES.flatMap((family) => {
        const parents = family.parents.map((key) => MAP_BY_KEY[key])
        const midX = parents.reduce((sum, parent) => sum + parent.x, 0) / parents.length
        const topY = Math.max(...parents.map((parent) => parent.y))
        return family.children.map((childKey) => {
          const child = MAP_BY_KEY[childKey]
          return down(midX, topY, child.x, child.y)
        })
      }),
    [],
  )

  const spousePaths = useMemo(
    () =>
      MAP_SPOUSES.map(([a, b]) => {
        const first = MAP_BY_KEY[a]
        const second = MAP_BY_KEY[b]
        const [left, right] = first.x < second.x ? [first, second] : [second, first]
        return `M ${left.x + HALF_W} ${left.y} L ${right.x - HALF_W} ${right.y}`
      }),
    [],
  )

  const chain = useMemo(() => (selected ? pathTo(selected) : []), [selected])

  const hotPaths = useMemo(
    () =>
      chain.slice(0, -1).map((key, index) => {
        const a = MAP_BY_KEY[key]
        const b = MAP_BY_KEY[chain[index + 1]]
        if (Math.abs(a.y - b.y) > 60) {
          const [top, bottom] = a.y < b.y ? [a, b] : [b, a]
          return down(top.x, top.y, bottom.x, bottom.y)
        }
        const [left, right] = a.x < b.x ? [a, b] : [b, a]
        return across(left.x, right.x, left.y)
      }),
    [chain],
  )

  const chosen = selected ? kinFor(selected) : null
  const chainText = chain.map((key) => (key === 'you' ? 'bạn' : (kinFor(key)?.vi ?? ''))).join(' → ')

  useEffect(() => {
    const element = scroller.current
    if (!element) return
    // Keep you horizontally centred, but sit low in the frame so the row above
    // (your parents) is visible on open instead of blank canvas.
    element.scrollLeft = Math.max(0, YOU.x * zoom - element.clientWidth / 2)
    element.scrollTop = Math.max(0, YOU.y * zoom - element.clientHeight * 0.66)
  }, [zoom])

  const openChosen = () => {
    if (!chosen) return
    onOpen({ kin: chosen, path: chosen.paths[0], exact: true, score: 1000 })
  }

  return (
    <>
      <section className="intro intro--tight rise" style={rise(0)}>
        <span className="eyebrow">
          <SparkIcon size={11} /> {t.treeEyebrow}
        </span>
        <h1 className="display">
          {t.treeTitle} <em>{t.treeTitleEm}</em>
          {t.treeTitleTail}
        </h1>
        <p className="lede">{t.treeLede}</p>
      </section>

      <div className="map2 rise" style={rise(1)}>
        <div className="map2__bar">
          <span className="label">{t.treeMapLabel}</span>
          <span className="map2__hint">{t.treeDrag}</span>
        </div>

        <div className="map2__frame">
          <span className="map2__side map2__side--left">{t.treeNoi}</span>
          <span className="map2__side map2__side--right">{t.treeNgoai}</span>

          <div
            className="map2__scroller"
            ref={scroller}
            role="region"
            aria-label={t.treeMapLabel}
            tabIndex={0}
          >
            <div
              className="map2__stage"
              style={{ width: MAP_W * zoom, height: MAP_H * zoom }}
            >
              <div
                className="map2__canvas"
                style={{ width: MAP_W, height: MAP_H, transform: `scale(${zoom})` }}
              >
                <svg
                  className="map2__edges"
                  width={MAP_W}
                  height={MAP_H}
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  aria-hidden
                >
                  {trunkPaths.map((path, index) => (
                    <path key={`t${index}`} d={path} className="edge" />
                  ))}
                  {spousePaths.map((path, index) => (
                    <path key={`s${index}`} d={path} className="edge edge--spouse" />
                  ))}
                  {hotPaths.map((path, index) => (
                    <g key={`h${index}`}>
                      <path d={path} className="edge-glow" />
                      <path d={path} className="edge-hot" />
                    </g>
                  ))}
                </svg>

                {MAP_NODES.map((node) => {
                  const kin = node.self ? null : kinFor(node.key)
                  const isSelected = node.key === selected
                  const onPath = chain.includes(node.key)
                  const dim = Boolean(selected) && !onPath
                  const classes = ['node2']
                  if (node.self) classes.push('node2--self')
                  if (isSelected) classes.push('node2--on')
                  else if (onPath) classes.push('node2--path')
                  if (dim && !node.self) classes.push('node2--dim')

                  return (
                    <button
                      key={node.key}
                      type="button"
                      className={classes.join(' ')}
                      style={{ left: node.x - HALF_W, top: node.y - HALF_H }}
                      onClick={() => setSelected(isSelected ? null : node.key)}
                      aria-pressed={isSelected}
                      aria-label={
                        kin
                          ? `${kin.vi} — ${kin.en}. ${t.heroYou} ${kin.you}; ${t.heroThem} ${kin.them}.`
                          : 'Bạn — you are here'
                      }
                    >
                      <span className="node2__vi">{kin ? kin.vi : 'Bạn'}</span>
                      <span className="node2__en">{kin ? kin.en : t.treeSelf}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="zoombar">
            <button
              type="button"
              onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
              disabled={zoomIndex === 0}
              aria-label={t.treeZoomOut}
            >
              −
            </button>
            <span className="zoombar__pct">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomIndex((index) => Math.min(ZOOMS.length - 1, index + 1))}
              disabled={zoomIndex === ZOOMS.length - 1}
              aria-label={t.treeZoomIn}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomIndex(START)}
              aria-label={t.treeReset}
            >
              <TargetIcon size={14} />
            </button>
          </div>
        </div>

        <div className={`picked${chosen ? '' : ' picked--hint'}`} aria-live="polite">
          {chosen ? (
            <>
              <div className="picked__top">
                <span className="picked__path">{chainText}</span>
                <button type="button" className="picked__open" onClick={openChosen}>
                  {t.treeOpen}
                  <ArrowIcon size={11} />
                </button>
              </div>
              <div className="picked__body">
                <span className="picked__vi">{chosen.vi}</span>
                <span className="picked__pair">
                  <span>
                    {t.heroYou} <b>{chosen.you}</b>
                  </span>
                  <span>
                    {t.heroThem} <b>{chosen.them}</b>
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              <SparkIcon size={12} />
              <span>{t.treeHint}</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}
