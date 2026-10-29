import { useLang } from '../lib/lang'
import type { Lang } from '../lib/i18n'

const LANGS: Lang[] = ['en', 'vi']

export function LangToggle() {
  const { lang, t, setLang } = useLang()

  return (
    <div className="lang" role="group" aria-label={t.langLabel}>
      {LANGS.map((code) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            className={`lang__btn${active ? ' lang__btn--on' : ''}`}
            aria-pressed={active}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
