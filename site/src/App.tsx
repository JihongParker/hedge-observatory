import { useCallback, useEffect, useState } from 'react'
import ScanField from './components/ScanField'
import Coverage from './modules/Coverage'
import Evidence from './modules/Evidence'
import Pipeline from './modules/Pipeline'
import Kssb from './modules/Kssb'
import './App.css'

// Hong_ERP와 같은 앱 셸: 좌측 모듈 내비 + 해시 라우팅 + 가이드 투어.
const GROUPS: { title: string | null; items: { id: string; name: string; desc: string }[] }[] = [
  { title: null, items: [{ id: 'overview', name: '개요', desc: '' }] },
  {
    title: '관측 층',
    items: [
      { id: 'evidence', name: '실측 근거', desc: '380사 패널 ATT · 파일럿 각주 상태' },
      { id: 'coverage', name: '커버리지', desc: '모집단 · 판독률 · 기업 화면' },
    ],
  },
  {
    title: '파이프라인 층',
    items: [{ id: 'pipeline', name: '배치 파이프라인', desc: '수집→판별→정규화→공개, 단계별 상태' }],
  },
  {
    title: '전방 관측',
    items: [{ id: 'kssb', name: 'KSSB 추적', desc: 'FY2027 시행 → 2030–31 관측 창' }],
  },
]
const ALL = GROUPS.flatMap((g) => g.items)

// 가이드 투어 — 다섯 걸음. 각 걸음이 모듈로 이동해 하나만 짚는다.
const TOUR: { module: string; title: string; body: string; target: string }[] = [
  { module: 'overview', title: '점 하나가 기업 하나', body: '뒤의 점 2,391개가 코스피 심사 모집단이다. 빔이 지나가는 것이 배치 파싱 — 실제 파이프라인도 이렇게 한 번 훑고, 사이트는 산출물만 읽는다.', target: '[data-tour="scan"]' },
  { module: 'evidence', title: '먼저 답한 질문', body: '공시의무가 헤지를 움직였는가 — 380사 패널의 네 추정치 전부 0을 포함하는 정밀 null. 점 위에 마우스를 올리면 신뢰구간이 나온다.', target: '[data-tour="att"]' },
  { module: 'evidence', title: '왜 관측소가 필요한가', body: '파일럿 13사 중 즉시 정합되는 수치표는 1개. 나머지 10개의 이질 표를 정합으로 끌어올리는 것이 이 프로젝트의 본론이다.', target: '[data-tour="notes"]' },
  { module: 'coverage', title: '결정문 판독', body: 'S-Oil 사례: 위험회피 용어 12회는 전부 상용구, 결정문 한 문장이 비적용을 확정한다. 키워드 빈도가 아니라 문장을 읽어야 하는 이유.', target: '[data-tour="firms"]' },
  { module: 'kssb', title: '관측 창', body: '2027년 기후공시가 시행되면, 코호트별 헤지 반응 측정은 별도 연구가 아니라 이 패널의 조회 한 번이 된다. 창은 2030–31.', target: '[data-tour="window"]' },
]

function Tour({ step, setStep, go }: { step: number; setStep: (n: number | null) => void; go: (id: string) => void }) {
  const s = TOUR[step]
  useEffect(() => {
    go(s.module)
    const t = setTimeout(() => {
      document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'))
      const el = document.querySelector(s.target)
      if (el) {
        el.classList.add('tour-glow')
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }, 60)
    return () => clearTimeout(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  const end = () => {
    document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'))
    setStep(null)
  }
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

function Overview({ startTour, go }: { startTour: () => void; go: (id: string) => void }) {
  const [swept, setSwept] = useState(0)
  const onSwept = useCallback((n: number) => setSwept((p) => (Math.abs(n - p) > 15 || n === 0 || n === 2391 ? n : p)), [])
  return (
    <div>
      <header className="hero" data-tour="scan">
        <ScanField onSwept={onSwept} />
        <div className="hero-copy">
          <div className="hero-eyebrow mono">KOREAN CORPORATE HEDGING OBSERVATORY</div>
          <h1>헤지 관측소</h1>
          <p className="hero-scope">
            상장사 2,391곳의 파생상품 각주를 판별·파싱·정규화해 만드는 공개 기업 헤지 패널.
            점 하나가 기업 하나, 빔이 배치 파싱이다.
          </p>
          <div className="hero-meters mono"><span><b>{swept.toLocaleString()}</b> / 2,391 스캔</span>
            <span><b>14</b> 파일럿 완료</span><span><b>380 × 9</b> 기존 패널</span></div>
          <div className="hero-cta">
            <button className="cta-primary" onClick={startTour}>둘러보기 시작</button>
            <button className="cta-ghost" onClick={() => go('evidence')}>실측 근거 보기</button>
          </div>
        </div>
      </header>
      <div className="ov-strip">
        <div className="ov-kpi"><b>2,391</b><span>대상 모집단 · 코스피 심사 통과</span><em>실측</em></div>
        <div className="ov-kpi"><b>3,420</b><span>기존 패널 기업-연도 (380 × 9)</span><em>실측</em></div>
        <div className="ov-kpi"><b>10 / 14</b><span>파일럿 지정 판독 성공</span><em>실측</em></div>
        <div className="ov-kpi"><b>1 / 13</b><span>수치표 즉시 정합 — 이 격차가 본론</span><em>실측</em></div>
      </div>
      <div className="ov-cards">
        {[
          { id: 'evidence', stat: 'ATT −0.5pp [−6.8, +6.0] · 정밀 null' },
          { id: 'coverage', stat: 'S-Oil 결정문 판독 · 수작업 대조' },
          { id: 'pipeline', stat: '2/4 단계 기구축 · 배치 1회 파싱' },
          { id: 'kssb', stat: '관측 창 2030–31 · 1단계 10조+' },
        ].map(({ id, stat }) => {
          const m = ALL.find((x) => x.id === id)!
          return (
            <button key={m.id} className="ov-card" onClick={() => go(m.id)}>
              <span className="ov-name">{m.name}</span>
              <span className="ov-desc">{m.desc}</span>
              <span className="ov-stat">{stat}</span>
              <span className="ov-go mono">열기 →</span>
            </button>
          )
        })}
      </div>
      <div className="ov-band">
        <div className="ov-log">
          <h3>관측 일지</h3>
          <ol>
            <li><time>2026-09-07</time><p><b>관측소 v0 공개.</b> 파이프라인 골격과 파일럿 실측 화면을 배포했다.</p></li>
            <li><time>2026-09-04</time><p><b>보안 정비.</b> 수집 키를 코드 밖으로 옮기고 리포 히스토리를 정리했다.</p></li>
            <li><time>2026-09-02</time><p><b>모태 연구 전체 재검증.</b> 380사 패널 추정과 4편 엔진을 소스에서 재실행해 전 수치 재현을 확인했다.</p></li>
            <li><time>2026-08-24</time><p><b>파일럿 14사 판독.</b> 지정 10/14 판독, 수치표 즉시 정합 1/13 — 정규화 계층의 과제를 실측으로 확정했다.</p></li>
          </ol>
        </div>
        <div className="ov-kin">
          <h3>계보</h3>
          <a href="https://github.com/JihongParker/wti-fx-hedge-program">모태 연구 P1–P4 <span>WTI × USD/KRW 4편</span></a>
          <a href="https://jihongparker.github.io/hong-erp/">Hong ERP <span>의사결정-층 프로토타입</span></a>
          <a href="https://github.com/JihongParker/hedge-observatory">이 사이트의 소스 <span>github</span></a>
          <div className="ov-kin-note">파이프라인은 배치 1회 실행 — 이 사이트는 정적 산출물만 읽는다 (로드당 토큰 0).</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('overview')
  const [tour, setTour] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  const go = useCallback((id: string) => {
    setActive(id)
    setNavOpen(false)
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
      <button className="nav-burger mono" onClick={() => setNavOpen((v) => !v)} aria-label="메뉴">☰ {mod.name}</button>
      <nav className={navOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sb-brand" onClick={() => go('overview')} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && go('overview')}>
          <span className="sb-logo mono">◉</span> 헤지 관측소
        </div>
        {GROUPS.map((g, i) => (
          <div key={i} className="sb-group">
            {g.title && <div className="sb-title mono">{g.title}</div>}
            {g.items.map((m) => (
              <button key={m.id} className={active === m.id ? 'sb-item on' : 'sb-item'} onClick={() => go(m.id)}>
                <span className="sb-name">{m.name}</span>
                {m.desc && <span className="sb-desc">{m.desc}</span>}
              </button>
            ))}
          </div>
        ))}
        <button className="sb-tour" onClick={() => { setTour(0) }}>둘러보기 시작</button>
        <div className="sb-foot mono">배치 1회 파싱 · 정적 서빙<br/>로드당 토큰 0</div>
      </nav>
      <main className="main">
        {active === 'overview' && <Overview startTour={() => setTour(0)} go={go} />}
        {active === 'evidence' && <Evidence />}
        {active === 'coverage' && <Coverage />}
        {active === 'pipeline' && <Pipeline />}
        {active === 'kssb' && <Kssb />}
        {active !== 'overview' && (
          <footer className="ftr">표시된 값은 전부 OpenDART 라이브 파일럿(14사)과 380사 패널 실측이다. 예시 목업 값은 넣지 않는다.</footer>
        )}
      </main>
      {tour !== null && <div className="tour-dim" />}
      {tour !== null && <Tour step={tour} setStep={setTour} go={go} />}
    </div>
  )
}
