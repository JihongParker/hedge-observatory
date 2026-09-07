import { useCallback, useEffect, useState } from 'react'
import Overview from './modules/Overview'
import Coverage from './modules/Coverage'
import Evidence from './modules/Evidence'
import Pipeline from './modules/Pipeline'
import Kssb from './modules/Kssb'
import './App.css'

const GROUPS: { title: string | null; items: { id: string; name: string; desc: string }[] }[] = [
  { title: null, items: [{ id: 'overview', name: '개요', desc: '' }] },
  {
    title: '무엇을 보나',
    items: [
      { id: 'evidence', name: '확인된 사실', desc: '공시 의무가 행동을 바꿨는지 380개사로 확인' },
      { id: 'coverage', name: '읽은 범위', desc: '어디까지 읽었고 무엇을 판정했나' },
    ],
  },
  { title: '어떻게 만드나', items: [{ id: 'pipeline', name: '만드는 과정', desc: '모아서 읽고 맞춰서 공개하는 네 걸음' }] },
  { title: '다음 관측', items: [{ id: 'kssb', name: '기후공시 관측', desc: '2027년 의무화 이후를 지켜봅니다' }] },
]
const ALL = GROUPS.flatMap((g) => g.items)

const TOUR: { module: string; title: string; body: string; target: string }[] = [
  { module: 'overview', title: '점 하나가 회사 하나', body: '뒤에 뜬 점 2,391개가 읽을 대상 회사들입니다. 지나가는 빛줄기는 컴퓨터가 보고서를 "읽는 중"이라는 표시입니다. 실제 작업도 이렇게 한 번 훑고, 이 사이트는 그 결과만 보여 줍니다.', target: '.ov-hero' },
  { module: 'evidence', title: '먼저 확인한 사실', body: '공시 의무가 생기면 회사가 위험 대비를 늘릴까요? 380개사의 9년치를 비교했더니 달라진 것이 없었습니다. 가로 막대가 전부 0을 지나는 것이 그 뜻입니다. 점에 마우스를 올리면 수치가 보입니다.', target: '[data-tour="att"]' },
  { module: 'evidence', title: '왜 이 작업이 필요한가', body: '시범으로 읽은 13곳 중 표를 바로 비교할 수 있는 회사는 1곳뿐이었습니다. 회사마다 표 모양이 달라서입니다. 나머지 10곳을 비교 가능하게 맞추는 것이 이 프로젝트의 본론입니다.', target: '[data-tour="notes"]' },
  { module: 'coverage', title: '문장 하나로 판정', body: 'S-Oil 보고서에는 위험회피라는 말이 12번 나오지만 전부 상투적 문구였고, "적용하지 않는다"는 문장 하나가 결론이었습니다. 단어 개수가 아니라 문장을 읽어야 하는 이유입니다.', target: '[data-tour="firms"]' },
  { module: 'kssb', title: '다음 관측', body: '2027년부터 큰 회사들은 기후 정보를 의무로 공시합니다. 의무가 행동을 바꾸는지는 2030–31년에 이 표를 열어 보면 압니다. 별도 연구가 아니라 조회 한 번입니다.', target: '[data-tour="window"]' },
]

function Tour({ step, setStep, go }: { step: number; setStep: (n: number | null) => void; go: (id: string) => void }) {
  const s = TOUR[step]
  useEffect(() => {
    go(s.module)
    const t = setTimeout(() => {
      document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'))
      const el = document.querySelector(s.target)
      if (el) { el.classList.add('tour-glow'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }) }
    }, 60)
    return () => clearTimeout(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  const end = () => { document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow')); setStep(null) }
  return (
    <div className="tour-card" role="dialog" aria-label="가이드 투어">
      <div className="tour-no mono">{step + 1} / {TOUR.length}</div>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
      <div className="tour-btns">
        <button onClick={end} className="tour-skip">닫기</button>
        {step > 0 && <button onClick={() => setStep(step - 1)}>이전</button>}
        {step < TOUR.length - 1
          ? <button className="tour-next" onClick={() => setStep(step + 1)}>다음</button>
          : <button className="tour-next" onClick={end}>끝</button>}
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('overview')
  const [tour, setTour] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  const go = useCallback((id: string) => {
    setActive(id); setNavOpen(false)
    history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search)
    const fromHash = () => {
      const id = window.location.hash.replace('#', '')
      if (id && ALL.some((m) => m.id === id)) setActive(id)
      else if (!id) setActive('overview')
    }
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const mod = ALL.find((m) => m.id === active)!
  return (
    <div className="app">
      <button className="nav-burger" onClick={() => setNavOpen((v) => !v)} aria-label="메뉴">메뉴 · {mod.name}</button>
      {navOpen && <div className="nav-scrim" onClick={() => setNavOpen(false)} />}
      <nav className={navOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sb-brand" onClick={() => go('overview')} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && go('overview')}>
          <span className="sb-mark" aria-hidden="true" />
          <div><b>헤지 관측소</b><span>corporate hedging observatory</span></div>
        </div>
        <div className="sb-body">
          {GROUPS.map((g, i) => (
            <div key={i} className="sb-group">
              {g.title && <div className="sec-label sb-title">{g.title}</div>}
              {g.items.map((m) => (
                <button key={m.id} className={active === m.id ? 'sb-item on' : 'sb-item'} onClick={() => go(m.id)}>
                  <span className="sb-name">{m.name}</span>
                  {m.desc && <span className="sb-desc">{m.desc}</span>}
                </button>
              ))}
            </div>
          ))}
          <button className="sb-tour" onClick={() => setTour(0)}>둘러보기 시작</button>
        </div>
        <div className="sb-strip">
          <span className="sb-live"><i /> 시범 14곳 읽음</span>
          <span className="mono">panel v0 · 2026-09</span>
        </div>
      </nav>
      <main className="main">
        {active === 'overview' && <Overview startTour={() => setTour(0)} go={go} />}
        {active === 'evidence' && <Evidence />}
        {active === 'coverage' && <Coverage />}
        {active === 'pipeline' && <Pipeline />}
        {active === 'kssb' && <Kssb />}
        {active !== 'overview' && (
          <footer className="ftr">이 화면의 숫자는 전부 실제 공시에서 읽어 낸 값입니다. 지어낸 예시는 없습니다.</footer>
        )}
      </main>
      {tour !== null && <div className="tour-dim" />}
      {tour !== null && <Tour step={tour} setStep={setTour} go={go} />}
    </div>
  )
}
