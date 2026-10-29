import { useLang } from '../lib/lang'
import { LANGS } from '../lib/i18n'
import { CheckIcon } from './Icons'

export function LangSwitch({ variant = 'compact' }: { variant?: 'compact' | 'list' }) {
  const { lang, t, setLang } = useLang()

  if (variant === 'list') {
    return (
      <div className="langlist" role="radiogroup" aria-label={t.langLabel}>
        {LANGS.map(({ code, name }) => {
          const active = code === lang
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={active}
              className={`langlist__item${active ? ' is-on' : ''}`}
              onClick={() => setLang(code)}
            >
              <span>{name}</span>
              {active ? <CheckIcon size={15} /> : null}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="lang" role="group" aria-label={t.langLabel}>
      {LANGS.map(({ code, short, name }) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            className={`lang__btn${active ? ' lang__btn--on' : ''}`}
            aria-pressed={active}
            aria-label={name}
            onClick={() => setLang(code)}
          >
            {short}
          </button>
        )
      })}
    </div>
  )
}
