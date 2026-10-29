import { useState } from 'react'
import { useLang } from '../lib/lang'
import { CloseIcon, ShareIcon } from './Icons'

const DISMISSED = 'coi.install.dismissed'

/** iOS Safari is the only place Add to Home Screen exists — offer it there, once. */
function canOffer(): boolean {
  if (typeof window === 'undefined') return false

  const nav = navigator as Navigator & { standalone?: boolean }
  const installed =
    nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches
  if (installed) return false

  const ua = navigator.userAgent
  const ios =
    /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const otherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua)

  try {
    if (localStorage.getItem(DISMISSED) === '1') return false
  } catch {
    /* storage blocked — still worth showing */
  }

  return ios && !otherBrowser
}

export function InstallRail() {
  const { t } = useLang()
  const [shown, setShown] = useState(canOffer)
  if (!shown) return null

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED, '1')
    } catch {
      /* private mode */
    }
    setShown(false)
  }

  return (
    <aside className="install" aria-label={t.installTitle}>
      <span className="install__icon">
        <ShareIcon size={13} />
      </span>
      <span className="install__copy">
        <strong className="install__title">{t.installTitle}</strong>
        <span className="install__hint">{t.installHint}</span>
      </span>
      <button type="button" className="install__close" onClick={dismiss} aria-label={t.installDismiss}>
        <CloseIcon size={11} />
      </button>
    </aside>
  )
}
