import { BookIcon, SearchIcon, TreeIcon } from './Icons'

export type Tab = 'ask' | 'tree' | 'learn'

const TABS: { id: Tab; label: string; Icon: typeof SearchIcon }[] = [
  { id: 'ask', label: 'Ask', Icon: SearchIcon },
  { id: 'tree', label: 'Tree', Icon: TreeIcon },
  { id: 'learn', label: 'Learn', Icon: BookIcon },
]

export const TAB_META: Record<Tab, string> = {
  ask: 'xưng hô · pronouns',
  tree: 'gia đình · family',
  learn: 'bài học · lessons',
}

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  const index = TABS.findIndex((item) => item.id === tab)

  return (
    <nav className="tabbar" aria-label="Sections">
      <span
        className="tabbar__pill"
        aria-hidden
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {TABS.map(({ id, label, Icon }) => {
        const active = id === tab
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
