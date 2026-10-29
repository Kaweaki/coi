import { useMemo, useState } from 'react'
import type { Hit } from '../lib/search'
import { search } from '../lib/search'
import { KIN_BY_ID } from '../data/kinship'
import { hasSpeech, speak } from '../lib/speech'
import { rise } from '../lib/motion'
import { ArrowIcon, CloseIcon, SearchIcon, SoundIcon, SparkIcon } from './Icons'

const CHIPS = [
  "My mother's younger brother",
  "My father's older sister",
  'My wife’s mother',
  "My older brother's son",
]

type AskProps = {
  onOpen: (hit: Hit) => void
  recents: string[]
  saved: string[]
}

function kinHit(id: string): Hit | null {
  const kin = KIN_BY_ID[id]
  if (!kin) return null
  return { kin, path: kin.paths[0], exact: true, score: 1000 }
}

export function Ask({ onOpen, recents, saved }: AskProps) {
  const [query, setQuery] = useState('')
  const hits = useMemo(() => search(query), [query])
  const trimmed = query.trim()
  const hero = trimmed.length > 1 ? hits[0] : undefined
  const rest = hits.slice(1, 6)

  const recentHits = recents.map(kinHit).filter((hit): hit is Hit => Boolean(hit)).slice(0, 4)
  const savedHits = saved.map(kinHit).filter((hit): hit is Hit => Boolean(hit))

  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">
          <SparkIcon size={11} /> Bảng xưng hô · kinship
        </span>
        <h1 className="display">
          Who is this <em>person</em> to&nbsp;you?
        </h1>
        <p className="lede">
          Type it the way you would explain it out loud. Cội answers with the word you use for them —
          and the one they use for you.
        </p>
      </section>

      <div className="search bezel rise" style={rise(1)}>
        <div className="bezel__core search__core">
          <SearchIcon size={17} className="search__icon" />
          <input
            className="search__input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="My mother's younger brother"
            aria-label="Describe the relationship"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="text"
          />
          {query ? (
            <button
              type="button"
              className="search__clear"
              onClick={() => setQuery('')}
              aria-label="Clear the search"
            >
              <CloseIcon size={12} />
            </button>
          ) : null}
        </div>
      </div>

      {!hero && trimmed.length > 1 ? (
        <div className="empty bezel rise" style={rise(2)}>
          <div className="bezel__core empty__core">
            <span className="label">Không tìm thấy</span>
            <p className="empty__title">No match for “{trimmed}” yet.</p>
            <p className="empty__body">
              Describe the chain instead of the title — “father’s older sister” or “my sister’s
              husband”. Four words are the sweet spot.
            </p>
            <div className="chip-row">
              {CHIPS.slice(0, 3).map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => setQuery(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {hero ? (
        <HeroCard hit={hero} onOpen={onOpen} />
      ) : trimmed.length <= 1 ? (
        <>
          <section className="block rise" style={rise(2)}>
            <span className="label">Start with</span>
            <div className="chip-row">
              {CHIPS.map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => setQuery(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          </section>

          {recentHits.length > 0 ? (
            <section className="block rise" style={rise(3)}>
              <span className="label">Recent</span>
              <div className="chip-row">
                {recentHits.map((hit) => (
                  <button
                    key={hit.kin.id}
                    type="button"
                    className="chip chip--ghost"
                    onClick={() => onOpen(hit)}
                  >
                    {hit.kin.vi}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {savedHits.length > 0 ? (
            <section className="block rise" style={rise(4)}>
              <div className="block__head">
                <span className="label">Your people</span>
                <span className="block__count">{savedHits.length}</span>
              </div>
              <div className="rows">
                {savedHits.map((hit) => (
                  <Row key={hit.kin.id} hit={hit} onOpen={onOpen} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="facts rise" style={rise(savedHits.length ? 5 : 4)}>
            <span className="label">Three things worth knowing</span>
            <ol className="facts__list">
              <li>
                <span className="facts__no">01</span>
                <span>
                  <strong>Pronouns are a relationship, not a person.</strong> Your friend’s father is
                  chú to you and bác to someone two years older.
                </span>
              </li>
              <li>
                <span className="facts__no">02</span>
                <span>
                  <strong>Age beats family.</strong> You need to know whether someone is older or
                  younger than the person who connects you — that single fact changes the word.
                </span>
              </li>
              <li>
                <span className="facts__no">03</span>
                <span>
                  <strong>You change too.</strong> When you speak to chú, you are cháu. The pair
                  moves together, in both directions, in the same sentence.
                </span>
              </li>
            </ol>
          </section>
        </>
      ) : null}

      {rest.length > 0 ? (
        <section className="block rise" style={rise(3)}>
          <span className="label">Other readings</span>
          <div className="rows">
            {rest.map((hit) => (
              <Row key={hit.kin.id} hit={hit} onOpen={onOpen} />
            ))}
          </div>
        </section>
      ) : null}

      {hero && !rest.length ? <div className="tail-note">One reading. Nothing ambiguous in that chain.</div> : null}
    </>
  )
}

function HeroCard({ hit, onOpen }: { hit: Hit; onOpen: (hit: Hit) => void }) {
  const { kin } = hit
  const spoken = hasSpeech()

  return (
    <article className="hero rise" style={rise(2)}>
      <div className="hero__core">
        <span className="hero__glow" aria-hidden />
        <div className="hero__top">
          <span className="hero__en">{kin.en}</span>
          <span className="hero__tone">{kin.tone ?? `/${kin.say}/`}</span>
        </div>
        <h2 className="hero__vi">{kin.vi}</h2>
        <div className="hero__pair">
          <span className="pair">
            <span className="pair__k">You call them</span>
            <span className="pair__v">{kin.you}</span>
          </span>
          <span className="pair__rule" aria-hidden />
          <span className="pair">
            <span className="pair__k">They call you</span>
            <span className="pair__v">{kin.them}</span>
          </span>
        </div>
        <p className="hero__gloss">{kin.gloss}</p>
        <div className="hero__actions">
          <button
            type="button"
            className="iconpill"
            onClick={(event) => {
              event.stopPropagation()
              speak(kin.vi)
            }}
            aria-label={`Hear ${kin.vi}`}
            disabled={!spoken}
          >
            <SoundIcon size={14} />
            <span>Hear it</span>
          </button>
          <button type="button" className="iconpill iconpill--solid" onClick={() => onOpen(hit)}>
            <span>Full picture</span>
            <ArrowIcon size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

function Row({ hit, onOpen }: { hit: Hit; onOpen: (hit: Hit) => void }) {
  return (
    <button type="button" className="row" onClick={() => onOpen(hit)}>
      <span className="row__main">
        <span className="row__vi">{hit.kin.vi}</span>
        <span className="row__en">{hit.kin.en}</span>
      </span>
      <span className="row__pair">
        {hit.kin.you} <span className="row__arrow">→</span> {hit.kin.them}
      </span>
    </button>
  )
}
