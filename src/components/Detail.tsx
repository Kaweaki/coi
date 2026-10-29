import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Hit } from '../lib/search'
import { STEP_EN, STEP_LABEL } from '../data/kinship'
import { useLang } from '../lib/lang'
import { cleanName } from '../lib/people'
import { hasSpeech, speak } from '../lib/speech'
import { CloseIcon, SoundIcon, StarIcon, TagIcon } from './Icons'

type DetailProps = {
  hit: Hit
  saved: boolean
  name: string
  onName: (id: string, name: string) => void
  onToggleSave: () => void
  onClose: () => void
}

export function Detail({ hit, saved, name, onName, onToggleSave, onClose }: DetailProps) {
  const { kin, path } = hit
  const { lang, t } = useLang()
  const labels = lang === 'vi' ? STEP_LABEL : STEP_EN
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [closing, setClosing] = useState(false)
  const [draft, setDraft] = useState(name)
  const startY = useRef(0)
  const spoken = hasSpeech()

  useEffect(() => {
    setDraft(name)
  }, [name, kin.id])

  const requestClose = useCallback(() => {
    setClosing(true)
    window.setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startY.current = event.clientY
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDrag(Math.max(0, event.clientY - startY.current))
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (drag > 96) {
      requestClose()
    } else {
      setDrag(0)
    }
  }

  const canGreet = !kin.you.includes('/') && !kin.self.includes('/')
  const dirty = cleanName(draft) !== name

  const commit = () => {
    if (!dirty) return
    onName(kin.id, draft)
  }

  return (
    <div className={`sheet${closing ? ' sheet--closing' : ''}`}>
      <div className="sheet__scrim" onClick={requestClose} />
      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${kin.vi} — ${kin.en}`}
        style={{
          transform: drag ? `translateY(${drag}px)` : undefined,
          transition: dragging ? 'none' : undefined,
        }}
      >
        <div
          className="sheet__grab"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden
        >
          <span />
        </div>

        <div className="sheet__scroll">
          <div className="sheet__head">
            <span className="label">{kin.en}</span>
            <button
              type="button"
              className="sheet__close"
              onClick={requestClose}
              aria-label={t.detailClose}
            >
              <CloseIcon size={13} />
            </button>
          </div>

          <h2 className="sheet__vi">{kin.vi}</h2>
          <div className="sheet__pron">
            <span>/{kin.say}/</span>
            {kin.tone ? <span className="dot" aria-hidden /> : null}
            {kin.tone ? <span>{kin.tone}</span> : null}
          </div>

          {name ? (
            <p className="sheet__name">
              <TagIcon size={12} /> {name}
            </p>
          ) : null}

          <div className="pathbar" aria-label={t.treeMapLabel}>
            <span className="pathbar__node">bạn</span>
            {path.map((step, index) => (
              <span key={`${step}-${index}`} className="pathbar__step">
                <span className="pathbar__arrow" aria-hidden>
                  →
                </span>
                <span className="pathbar__node">{labels[step]}</span>
              </span>
            ))}
          </div>

          <div className="pairgrid">
            <div className="cell">
              <span className="cell__k">{t.detailYou}</span>
              <span className="cell__v">{kin.you}</span>
            </div>
            <div className="cell cell--alt">
              <span className="cell__k">{t.detailThem}</span>
              <span className="cell__v">{kin.them}</span>
            </div>
          </div>

          <form
            className="namer"
            onSubmit={(event) => {
              event.preventDefault()
              commit()
              ;(event.currentTarget.elements.namedItem('kin-name') as HTMLInputElement | null)?.blur()
            }}
          >
            <label className="label" htmlFor="kin-name">
              {t.nameLabel}
            </label>
            <div className="namer__row">
              <input
                id="kin-name"
                name="kin-name"
                className="namer__input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.namePlaceholder}
                autoComplete="off"
                maxLength={28}
                enterKeyHint="done"
              />
              <button type="submit" className="namer__save" disabled={!dirty}>
                {t.nameSave}
              </button>
            </div>
            <div className="namer__foot">
              <span>{t.nameHint}</span>
              {name ? (
                <button
                  type="button"
                  className="namer__remove"
                  onClick={() => {
                    setDraft('')
                    onName(kin.id, '')
                  }}
                >
                  {t.nameRemove}
                </button>
              ) : null}
            </div>
          </form>

          <p className="sheet__gloss">{kin.gloss}</p>

          {kin.note ? (
            <div className="note">
              <p>{kin.note}</p>
            </div>
          ) : null}

          {canGreet ? (
            <div className="sayit">
              <span className="label">{t.detailSay}</span>
              <p className="sayit__vi">
                Dạ, {kin.self} chào {kin.you} ạ.
              </p>
              <button
                type="button"
                className="sayit__btn"
                onClick={() => speak(`Dạ, ${kin.self} chào ${kin.you} ạ.`)}
              >
                <SoundIcon size={12} />
                <span>{t.detailHear}</span>
              </button>
            </div>
          ) : null}

          <div className="sheet__actions">
            <button
              type="button"
              className="btn btn--dark"
              onClick={() => speak(kin.vi)}
              disabled={!spoken}
            >
              <SoundIcon size={14} />
              <span>{spoken ? t.detailPronounce : t.detailNoVoice}</span>
            </button>
            <button
              type="button"
              className={`btn btn--ghost${saved ? ' is-saved' : ''}`}
              onClick={onToggleSave}
              aria-pressed={saved}
            >
              <StarIcon size={13} />
              <span>{saved ? t.detailSaved : t.detailSave}</span>
            </button>
          </div>

          <p className="sheet__foot">{t.detailFoot}</p>
        </div>
      </div>
    </div>
  )
}
