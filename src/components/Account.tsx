import { useMemo } from 'react'
import { useLang } from '../lib/lang'
import { ATTRIBUTION, VERSION } from '../lib/i18n'
import { namedPeople, type People } from '../lib/people'
import { CloseIcon } from './Icons'
import { LangSwitch } from './LangSwitch'

type AccountProps = {
  people: People
  onName: (id: string, name: string) => void
  onClose: () => void
}

export function Account({ people, onName, onClose }: AccountProps) {
  const { t } = useLang()
  const named = useMemo(() => namedPeople(people), [people])

  return (
    <section className="account" aria-label={t.account}>
      <header className="account__bar">
        <span className="label">{t.account}</span>
        <button type="button" className="roundbtn" onClick={onClose} aria-label={t.accountClose}>
          <CloseIcon size={14} />
        </button>
      </header>

      <div className="account__scroll">
        <p className="account__mark">Cội</p>
        <p className="account__intro">{t.accountIntro}</p>

        <section className="account__block">
          <span className="label">{t.accountLanguage}</span>
          <LangSwitch variant="list" />
        </section>

        <section className="account__block">
          <div className="account__head">
            <span className="label">{t.accountNames}</span>
            <span className="block__count">{named.length}</span>
          </div>

          {named.length ? (
            <ul className="namelist">
              {named.map(({ kin, name }) => (
                <li key={kin.id} className="namelist__item">
                  <span className="namelist__main">
                    <span className="namelist__name">{name}</span>
                    <span className="namelist__kin">
                      {kin.vi} · {kin.en}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="namelist__remove"
                    onClick={() => onName(kin.id, '')}
                    aria-label={`${t.nameRemove} — ${name}`}
                  >
                    <CloseIcon size={12} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="account__empty">{t.accountNoNames}</p>
          )}

          <p className="account__note">{t.accountData}</p>
        </section>
      </div>

      <footer className="account__foot">
        <span>
          Cội · {t.accountVersion} {VERSION}
        </span>
        <span className="credit">{ATTRIBUTION}</span>
      </footer>
    </section>
  )
}
