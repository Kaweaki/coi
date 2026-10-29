import { GENERATIONS, resolveNode, type TreeNode } from '../data/tree'
import type { Hit } from '../lib/search'
import { rise } from '../lib/motion'
import { SparkIcon } from './Icons'

function hitFor(node: TreeNode): Hit | null {
  const kin = resolveNode(node)
  if (!kin) return null
  return { kin, path: kin.paths[0], exact: true, score: 1000 }
}

export function Tree({ onOpen }: { onOpen: (hit: Hit) => void }) {
  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">
          <SparkIcon size={11} /> Cây gia đình · family tree
        </span>
        <h1 className="display">
          Your family, <em>mapped</em>.
        </h1>
        <p className="lede">
          Four generations, split by side. Press anyone to see the word you call them — and the one
          they call you back.
        </p>
      </section>

      <div className="map rise" style={rise(1)}>
        <div className="map__key">
          <span>
            <i className="keydot keydot--noi" aria-hidden /> nội · father’s side
          </span>
          <span>
            <i className="keydot keydot--ngoai" aria-hidden /> ngoại · mother’s side
          </span>
        </div>

        {GENERATIONS.map((generation, index) => (
          <section className="gen" key={generation.key} aria-labelledby={`gen-${generation.key}`}>
            <header className="gen__head">
              <h2 className="gen__vi" id={`gen-${generation.key}`}>
                {generation.vi}
              </h2>
              <span className="gen__en">{generation.en}</span>
              <i className="gen__rule" aria-hidden />
            </header>

            <div
              className={`gen__wings gen__wings--${generation.wings.length === 2 ? 'two' : 'one'}`}
            >
              {generation.wings.map((wing) => (
                <div className={`wing wing--${wing.key}`} key={wing.key}>
                  {wing.label ? <span className="wing__tag">{wing.label}</span> : null}
                  <div className="wing__nodes">
                    {wing.nodes.map((node) => {
                      const hit = hitFor(node)

                      if (!hit) {
                        return (
                          <span className="you" key={`${generation.key}-${node.kinId}`} aria-current="true">
                            <span className="you__vi">{node.vi}</span>
                            <span className="you__en">{node.en}</span>
                          </span>
                        )
                      }

                      return (
                        <button
                          key={`${generation.key}-${node.kinId}`}
                          type="button"
                          className={`rel${node.wide ? ' rel--wide' : ''}`}
                          onClick={() => onOpen(hit)}
                          aria-label={`${node.vi} — ${node.en}. You call them ${hit.kin.you}; they call you ${hit.kin.them}.`}
                        >
                          <span className="rel__vi">{node.vi}</span>
                          <span className="rel__en">{node.en}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {index < GENERATIONS.length - 1 ? <span className="gen__seam" aria-hidden /> : null}
          </section>
        ))}
      </div>

      <section className="note-card rise" style={rise(2)}>
        <span className="label">How to read it</span>
        <p>
          Every step between you and another person is one word. Up to your parents, sideways to
          their brothers and sisters, then down to your cousins — the pronoun is the sum of those
          steps, not a title you memorise.
        </p>
        <p className="note-card__aside">
          Nội and ngoại are not ranks. They are a compass: nội is your father’s side, ngoại is your
          mother’s.
        </p>
      </section>
    </>
  )
}
