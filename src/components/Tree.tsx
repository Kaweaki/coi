import { BRANCHES, resolveNode } from '../data/tree'
import type { Hit } from '../lib/search'
import { rise } from '../lib/motion'

export function Tree({ onOpen }: { onOpen: (hit: Hit) => void }) {
  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">Cây gia đình · family tree</span>
        <h1 className="display">
          Your family, <em>mapped</em>.
        </h1>
        <p className="lede">
          A sample family, four generations deep. Tap anyone to hear what you would call them — and
          what they would call you back.
        </p>
      </section>

      <div className="tree">
        {BRANCHES.map((branch, index) => (
          <section
            key={branch.key}
            className={`branch${branch.key === 'self' ? ' branch--self' : ''} rise`}
            style={rise(index + 1)}
          >
            <div className="branch__head">
              <span className="branch__label">{branch.label}</span>
              <span className="branch__sub">{branch.sub}</span>
              <i className="branch__rule" aria-hidden />
            </div>
            <div className="branch__row">
              {branch.nodes.map((node) => {
                const kin = resolveNode(node)
                if (!kin) {
                  return (
                    <span key={node.vi} className="node node--you" aria-current="true">
                      <span className="node__vi">{node.vi}</span>
                      <span className="node__en">{node.en}</span>
                    </span>
                  )
                }
                return (
                  <button
                    key={`${branch.key}-${node.vi}`}
                    type="button"
                    className="node"
                    onClick={() => onOpen({ kin, path: kin.paths[0], exact: true, score: 1000 })}
                  >
                    <span className="node__vi">{node.vi}</span>
                    <span className="node__en">{node.en}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="note-card rise" style={rise(6)}>
        <span className="label">How to read it</span>
        <p>
          Every arrow between you and another person is one word. Step up to your parents, sideways
          to their brothers and sisters, then down to your cousins — the pronoun is the sum of those
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
