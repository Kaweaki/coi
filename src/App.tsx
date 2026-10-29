import { useEffect, useRef, useState } from 'react'
import { Account } from './components/Account'
import { Ask } from './components/Ask'
import { Detail } from './components/Detail'
import { InstallRail } from './components/Install'
import { LangSwitch } from './components/LangSwitch'
import { Learn } from './components/Learn'
import { TabBar, type Tab } from './components/TabBar'
import { Tree } from './components/Tree'
import { PersonIcon } from './components/Icons'
import { LangProvider, useLang } from './lib/lang'
import type { Hit } from './lib/search'
import { nameFor, readPeople, withName, withoutName, writePeople, type People } from './lib/people'
import { readList, writeList } from './lib/storage'

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  )
}

function Shell() {
  const { t } = useLang()
  const [tab, setTab] = useState<Tab>('ask')
  const [detail, setDetail] = useState<Hit | null>(null)
  const [account, setAccount] = useState(false)
  const [recent, setRecent] = useState<string[]>(() => readList('coi.recent'))
  const [saved, setSaved] = useState<string[]>(() => readList('coi.saved'))
  const [people, setPeople] = useState<People>(readPeople)
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

  useEffect(() => {
    writePeople(people)
  }, [people])

  const open = (hit: Hit) => {
    setDetail(hit)
    setRecent((previous) => [hit.kin.id, ...previous.filter((id) => id !== hit.kin.id)].slice(0, 8))
  }

  const rename = (id: string, raw: string) => {
    setPeople((previous) => (raw.trim() ? withName(previous, id, raw) : withoutName(previous, id)))
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
          <div className="topbar__tools">
            <LangSwitch />
            <button
              type="button"
              className="accountbtn"
              onClick={() => setAccount(true)}
              aria-label={t.account}
            >
              <PersonIcon size={17} />
            </button>
          </div>
        </header>

        <InstallRail />

        <div className="body" ref={bodyRef} key={tab}>
          {tab === 'ask' ? <Ask onOpen={open} recents={recent} saved={saved} people={people} /> : null}
          {tab === 'tree' ? <Tree onOpen={open} people={people} /> : null}
          {tab === 'learn' ? <Learn /> : null}
        </div>

        <TabBar tab={tab} onChange={setTab} />

        {detail ? (
          <Detail
            hit={detail}
            saved={saved.includes(detail.kin.id)}
            name={nameFor(people, detail.kin.id)}
            onName={rename}
            onToggleSave={toggleSave}
            onClose={() => setDetail(null)}
          />
        ) : null}

        {account ? (
          <Account people={people} onName={rename} onClose={() => setAccount(false)} />
        ) : null}

        <div className="grain" aria-hidden />
      </div>
    </div>
  )
}
