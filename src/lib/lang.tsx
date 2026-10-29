import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { COPY, type Copy, type Lang } from './i18n'

const STORE = 'coi.lang'

type LangValue = {
  lang: Lang
  t: Copy
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangValue>({ lang: 'en', t: COPY.en, setLang: () => undefined })

export const useLang = () => useContext(LangContext)

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORE)
    if (stored === 'vi' || stored === 'en' || stored === 'sv') return stored
  } catch {
    /* storage blocked */
  }
  if (typeof navigator !== 'undefined') {
    const language = navigator.language.toLowerCase()
    if (language.startsWith('vi')) return 'vi'
    if (language.startsWith('sv')) return 'sv'
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORE, lang)
    } catch {
      /* private mode */
    }
    document.documentElement.lang = lang
  }, [lang])

  return <LangContext.Provider value={{ lang, t: COPY[lang], setLang }}>{children}</LangContext.Provider>
}
