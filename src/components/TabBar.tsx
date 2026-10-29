import { useLang } from '../lib/lang'
import { BookIcon, SearchIcon, TreeIcon } from './Icons'

export type Tab = 'ask' | 'tree' | 'learn'

const TABS: { id: Tab; Icon: typeof SearchIcon }[] = [
  { id: 'ask', Icon: SearchIcon },
  { id: 'tree', Icon: TreeIcon },
  { id: 'learn', Icon: BookIcon },
]

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  const { t } = useLang()
  const index = TABS.findIndex((item) => item.id === tab)

  return (
    <nav className="tabbar" aria-label={t.tabsLabel}>
      <span
        className="tabbar__pill"
        aria-hidden
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {TABS.map(({ id, Icon }) => {
        const active = id === tab
        const label = id === 'ask' ? t.tabAsk : id === 'tree' ? t.tabTree : t.tabLearn
        return (
          <button
            key={id}
            type="button"
            className={`tab${active ? ' tab--on' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(id)}
          >
            <Icon size={id === 'tree' ? 19 : 18} className="tab__icon" />
            <span className="tab__label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
