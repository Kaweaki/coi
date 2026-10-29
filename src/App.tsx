import { useEffect, useRef, useState } from 'react'
import { Ask } from './components/Ask'
import { Detail } from './components/Detail'
import { InstallRail } from './components/Install'
import { Learn } from './components/Learn'
import { TabBar, TAB_META, type Tab } from './components/TabBar'
import { Tree } from './components/Tree'
import type { Hit } from './lib/search'
import { readList, writeList } from './lib/storage'

export default function App() {
  const [tab, setTab] = useState<Tab>('ask')
  const [detail, setDetail] = useState<Hit | null>(null)
  const [recent, setRecent] = useState<string[]>(() => readList('coi.recent'))
  const [saved, setSaved] = useState<string[]>(() => readList('coi.saved'))
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [tab])

  useEffect(() => {
    writeList('coi.recent', recent)
  }, [recent])

  useEffect(() => {
    writeList('coi.saved', saved)
  }, [saved])

  const open = (hit: Hit) => {
    setDetail(hit)
    setRecent((previous) => [hit.kin.id, ...previous.filter((id) => id !== hit.kin.id)].slice(0, 8))
  }

  const toggleSave = () => {
    if (!detail) return
    const id = detail.kin.id
    setSaved((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [id, ...previous].slice(0, 24),
    )
  }

  return (
    <div className="stage">
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="wordmark">Cội</span>
            <span className="brand__mark" aria-hidden />
          </div>
          <span className="topbar__meta">{TAB_META[tab]}</span>
        </header>

        <InstallRail />

        <div className="body" ref={bodyRef} key={tab}>
          {tab === 'ask' ? <Ask onOpen={open} recents={recent} saved={saved} /> : null}
          {tab === 'tree' ? <Tree onOpen={open} /> : null}
          {tab === 'learn' ? <Learn /> : null}
        </div>

        <TabBar tab={tab} onChange={setTab} />

        {detail ? (
          <Detail
            hit={detail}
            saved={saved.includes(detail.kin.id)}
            onToggleSave={toggleSave}
            onClose={() => setDetail(null)}
          />
        ) : null}

        <div className="grain" aria-hidden />
      </div>
    </div>
  )
}
