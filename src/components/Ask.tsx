import { useEffect, useMemo, useRef, useState } from 'react'
import { KIN_BY_ID } from '../data/kinship'
import { useLang } from '../lib/lang'
import { rise } from '../lib/motion'
import { findPeople, nameFor, type People } from '../lib/people'
import { search, type Hit } from '../lib/search'
import { hasSpeech, speak } from '../lib/speech'
import { ArrowIcon, CloseIcon, SearchIcon, SoundIcon, SparkIcon, TagIcon } from './Icons'

type AskProps = {
  onOpen: (hit: Hit) => void
  recents: string[]
  saved: string[]
  people: People
}

function kinHit(id: string): Hit | null {
  const kin = KIN_BY_ID[id]
  if (!kin) return null
  return { kin, path: kin.paths[0], exact: true, score: 1000 }
}

/** Saved names outrank text matches: a name is an exact, personal answer. */
function withNames(people: People, query: string, textHits: Hit[]): Hit[] {
  const named: Hit[] = findPeople(people, query).map(({ kin, name }) => ({
    kin,
    path: kin.paths[0],
    exact: true,
    score: 2000,
    namedAs: name,
  }))

  const seen = new Set<string>()
  return [...named, ...textHits].filter((hit) => {
    if (seen.has(hit.kin.id)) return false
    seen.add(hit.kin.id)
    return true
  })
}

export function Ask({ onOpen, recents, saved, people }: AskProps) {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const trimmed = query.trim()
  const hits = useMemo(() => withNames(people, query, search(query)), [people, query])
  const hero = trimmed.length > 1 ? hits[0] : undefined
  const rest = hits.slice(1, 6)
  const anchor = useRef<HTMLElement>(null)

  // A resolved answer starts below the fold on a phone; bring it up as it lands.
  const heroId = hero?.kin.id
  useEffect(() => {
    if (!heroId || !anchor.current) return
    anchor.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [heroId])

  const recentHits = recents.map(kinHit).filter((hit): hit is Hit => Boolean(hit)).slice(0, 4)
  const savedHits = saved.map(kinHit).filter((hit): hit is Hit => Boolean(hit))

  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">
          <SparkIcon size={11} /> {t.askEyebrow}
        </span>
        <h1 className="display">
          {t.askTitle} <em>{t.askTitleEm}</em> {t.askTitleTail}
        </h1>
        <p className="lede">{t.askLede}</p>
      </section>

      <div className="search2 rise" style={rise(1)}>
        <SearchIcon size={18} className="search2__icon" />
        <input
          className="search2__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.askPlaceholder}
          aria-label={t.askHint}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          inputMode="text"
        />
        {query ? (
          <button
            type="button"
            className="search2__clear"
            onClick={() => setQuery('')}
            aria-label={t.askClear}
          >
            <CloseIcon size={13} />
          </button>
        ) : null}
      </div>
      <p className="search2__hint rise" style={rise(1)}>
        {t.askHint}
      </p>

      {!hero && trimmed.length > 1 ? (
        <div className="empty2 rise" style={rise(2)}>
          <span className="label">{t.askEmptyLabel}</span>
          <p className="empty2__title">{t.emptyTitle(trimmed)}</p>
          <p className="empty2__body">{t.askEmptyBody}</p>
          <div className="chip-row">
            {t.chips.slice(0, 3).map((chip) => (
              <button key={chip} type="button" className="chip" onClick={() => setQuery(chip)}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hero ? (
        <HeroCard hit={hero} onOpen={onOpen} people={people} anchor={anchor} />
      ) : trimmed.length <= 1 ? (
        <>
          <section className="block rise" style={rise(2)}>
            <span className="label">{t.askStart}</span>
            <div className="chip-row">
              {t.chips.map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => setQuery(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          </section>

          {recentHits.length > 0 ? (
            <section className="block rise" style={rise(3)}>
              <span className="label">{t.askRecent}</span>
              <div className="chip-row">
                {recentHits.map((hit) => (
                  <button
                    key={hit.kin.id}
                    type="button"
                    className="chip chip--ghost"
                    onClick={() => onOpen(hit)}
                  >
                    {nameFor(people, hit.kin.id) || hit.kin.vi}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {savedHits.length > 0 ? (
            <section className="block rise" style={rise(4)}>
              <div className="block__head">
                <span className="label">{t.askPeople}</span>
                <span className="block__count">{savedHits.length}</span>
              </div>
              <div className="rows">
                {savedHits.map((hit) => (
                  <Row key={hit.kin.id} hit={hit} onOpen={onOpen} people={people} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="facts rise" style={rise(savedHits.length ? 5 : 4)}>
            <span className="label">{t.factsLabel}</span>
            <ol className="facts__list">
              {t.facts.map((fact, index) => (
                <li key={fact.title}>
                  <span className="facts__no">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{fact.title}</strong> {fact.body}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}

      {rest.length > 0 ? (
        <section className="block rise" style={rise(3)}>
          <span className="label">{t.askOther}</span>
          <div className="rows">
            {rest.map((hit) => (
              <Row key={hit.kin.id} hit={hit} onOpen={onOpen} people={people} />
            ))}
          </div>
        </section>
      ) : null}

      {hero && !rest.length ? <div className="tail-note">{t.askOne}</div> : null}
    </>
  )
}

function HeroCard({
  hit,
  onOpen,
  people,
  anchor,
}: {
  hit: Hit
  onOpen: (hit: Hit) => void
  people: People
  anchor: React.RefObject<HTMLElement>
}) {
  const { t } = useLang()
  const { kin } = hit
  const spoken = hasSpeech()
  const name = hit.namedAs ?? nameFor(people, kin.id)

  return (
    <article ref={anchor} className="hero rise" style={rise(2)}>
      <div className="hero__core">
        <span className="hero__glow" aria-hidden />
        <div className="hero__top">
          <span className="hero__en">{kin.en}</span>
          <span className="hero__tone">{kin.tone ?? `/${kin.say}/`}</span>
        </div>
        <h2 className="hero__vi">{kin.vi}</h2>
        {name ? (
          <span className="hero__named">
            <TagIcon size={11} /> {name}
          </span>
        ) : null}
        <div className="hero__pair">
          <span className="pair">
            <span className="pair__k">{t.heroYou}</span>
            <span className="pair__v">{kin.you}</span>
          </span>
          <span className="pair__rule" aria-hidden />
          <span className="pair">
            <span className="pair__k">{t.heroThem}</span>
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
            aria-label={`${t.hearIt} — ${kin.vi}`}
            disabled={!spoken}
          >
            <SoundIcon size={14} />
            <span>{t.hearIt}</span>
          </button>
          <button type="button" className="iconpill iconpill--solid" onClick={() => onOpen(hit)}>
            <span>{t.fullPicture}</span>
            <span className="iconpill__nest" aria-hidden>
              <ArrowIcon size={12} />
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

function Row({ hit, onOpen, people }: { hit: Hit; onOpen: (hit: Hit) => void; people: People }) {
  const name = hit.namedAs ?? nameFor(people, hit.kin.id)

  return (
    <button type="button" className="row" onClick={() => onOpen(hit)}>
      <span className="row__main">
        <span className="row__vi">{hit.kin.vi}</span>
        <span className={`row__en${name ? ' row__en--named' : ''}`}>
          {name ? (
            <>
              <TagIcon size={10} /> {name}
            </>
          ) : (
            hit.kin.en
          )}
        </span>
      </span>
      <span className="row__pair">
        {hit.kin.you} <span className="row__arrow">→</span> {hit.kin.them}
      </span>
    </button>
  )
}
