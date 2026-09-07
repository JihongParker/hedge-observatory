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
    title: '관측 층',
    items: [
      { id: 'evidence', name: '실측 근거', desc: '380사 패널 ATT · 파일럿 각주 상태' },
      { id: 'coverage', name: '커버리지', desc: '모집단 · 판독률 · 기업 화면' },
    ],
  },
  { title: '파이프라인 층', items: [{ id: 'pipeline', name: '배치 파이프라인', desc: '수집→판별→정규화→공개' }] },
  { title: '전방 관측', items: [{ id: 'kssb', name: 'KSSB 추적', desc: 'FY2027 시행 → 2030–31 관측 창' }] },
]
const ALL = GROUPS.flatMap((g) => g.items)

const TOUR: { module: string; title: string; body: string; target: string }[] = [
  { module: 'overview', title: '점 하나가 기업 하나', body: '뒤의 점 2,391개가 코스피 심사 모집단입니다. 빔이 지나가는 것이 배치 파싱입니다 — 실제 파이프라인도 이렇게 한 번 훑고, 사이트는 산출물만 읽습니다.', target: '.ov-hero' },
  { module: 'evidence', title: '먼저 답한 질문', body: '공시의무가 헤지를 움직였는지 380사 패널로 물었습니다. 네 추정치 전부 0을 포함하는 정밀 null입니다. 점 위에 마우스를 올리면 신뢰구간이 나옵니다.', target: '[data-tour="att"]' },
  { module: 'evidence', title: '왜 관측소가 필요한가', body: '파일럿 13사 중 즉시 정합되는 수치표는 1개뿐입니다. 나머지 10개의 이질 표를 정합으로 끌어올리는 것이 이 프로젝트의 본론입니다.', target: '[data-tour="notes"]' },
  { module: 'coverage', title: '결정문 판독', body: 'S-Oil 사례입니다. 위험회피 용어 12회는 전부 상용구였고, 결정문 한 문장이 비적용을 확정했습니다. 키워드 빈도가 아니라 문장을 읽어야 합니다.', target: '[data-tour="firms"]' },
  { module: 'kssb', title: '관측 창', body: '2027년 기후공시가 시행되면 코호트별 헤지 반응 측정은 별도 연구가 아니라 이 패널의 조회 한 번이 됩니다. 창은 2030–31입니다.', target: '[data-tour="window"]' },
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
          <span className="sb-live"><i /> 파일럿 14사 적재</span>
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
          <footer className="ftr">표시된 값은 전부 OpenDART 라이브 파일럿(14사)과 380사 패널 실측입니다. 예시 목업 값은 넣지 않습니다.</footer>
        )}
      </main>
      {tour !== null && <div className="tour-dim" />}
      {tour !== null && <Tour step={tour} setStep={setTour} go={go} />}
    </div>
  )
}
