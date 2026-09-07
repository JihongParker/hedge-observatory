import ScanField from '../components/ScanField'
import FlowDiagram from '../components/FlowDiagram'
import Carousel from '../components/Carousel'
import './Overview.css'

// 랜딩 — 장면(밤하늘 스캔) 한 층 위의 서사, 아래는 순수 계기판.
export default function Overview({ go, startTour }: { go: (id: string) => void; startTour: () => void }) {
  return (
    <div className="ov">
      <section className="ov-hero">
        <div className="ov-scene" aria-hidden="true"><ScanField /></div>
        <div className="ov-hero-copy">
          <span className="sec-label ov-cap">Korean corporate hedging observatory</span>
          <h1 className="ov-title">
            상장사 2,391곳의<br />각주를 읽어<br /><em>헤지 패널</em>을 만듭니다
          </h1>
          <p className="ov-lede">
            파생상품 각주를 <b>판별·파싱·정규화</b>해 공개 패널로 만드는 관측소입니다.
            점 하나가 기업 하나, 빔이 <b>배치 파싱</b>입니다 — 파이프라인은 한 번 훑고, 이 사이트는 산출물만 읽습니다.
          </p>
          <div className="ov-cta">
            <button className="ov-btn-primary" onClick={startTour}>둘러보기 시작</button>
            <button className="ov-btn-ghost" onClick={() => go('evidence')}>실측 근거 보기</button>
          </div>
        </div>
        <span className="ov-follow mono" aria-hidden="true">Follow the chain ↓</span>
      </section>

      <section className="ov-sec">
        <span className="sec-label">Pipeline</span>
        <h2>수집에서 관측까지, 한 줄의 사슬</h2>
        <FlowDiagram />
      </section>

      <section className="ov-sec">
        <span className="sec-label">Modules</span>
        <h2>네 개의 화면</h2>
        <div className="ov-cards">
          {[
            { id: 'evidence', name: '실측 근거', desc: '380사 패널의 집단-시점 ATT와 파일럿 각주 상태를 보여 줍니다.', stat: 'ATT −0.5pp [−6.8, +6.0]' },
            { id: 'coverage', name: '커버리지', desc: '모집단·판독률과 기업 화면입니다. 자산 하한으로 걸러 볼 수 있습니다.', stat: '지정 판독 10 / 14' },
            { id: 'pipeline', name: '배치 파이프라인', desc: '수집부터 공개까지 단계별 상태와 토큰 경계를 설명합니다.', stat: '2/4 단계 기구축' },
            { id: 'kssb', name: 'KSSB 추적', desc: '기후공시 코호트 구조와 2030–31 관측 창을 추적합니다.', stat: '1단계 10조 이상' },
          ].map((m) => (
            <button key={m.id} className="ov-card" onClick={() => go(m.id)}>
              <span className="ov-card-name">{m.name}</span>
              <span className="ov-card-desc">{m.desc}</span>
              <span className="ov-card-stat mono">{m.stat}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ov-sec">
        <span className="sec-label">Evidence</span>
        <h2>증명 수치</h2>
        <div className="ov-proof">
          <div className="ov-proof-item"><b className="mono">2,391</b><span>대상 모집단 · 코스피 심사 통과</span></div>
          <div className="ov-proof-item"><b className="mono">3,420</b><span>기존 패널 기업-연도 (380 × 9)</span></div>
          <div className="ov-proof-item"><b className="mono">10 / 14</b><span>파일럿 지정 판독 성공</span></div>
          <div className="ov-proof-item"><b className="mono">1 / 13</b><span>수치표 즉시 정합 — 이 격차가 본론</span></div>
        </div>
      </section>

      <section className="ov-sec">
        <span className="sec-label">Live miniature</span>
        <h2>화면 미리보기</h2>
        <Carousel slides={[
          { key: 'att', title: '정밀 null', body: (
            <svg viewBox="0 0 560 150" role="img" aria-label="네 추정치 점-구간 미니어처">
              <line x1="330" y1="8" x2="330" y2="130" stroke="var(--line)" />
              {[[-0.5,-6.8,6.0],[-5.0,-11.3,1.3],[1.0,-4.8,6.3],[-0.9,-6.9,4.9]].map(([e,l,h],i)=>{
                const X=(v:number)=>330+v*13, y=22+i*30
                return <g key={i}><line x1={X(l)} y1={y} x2={X(h)} y2={y} stroke="var(--accent)" strokeWidth="2"/><circle cx={X(e)} cy={y} r="4.5" fill="var(--accent)"/></g>
              })}
              <text x="330" y="146" textAnchor="middle" fontSize="10" fill="var(--muted)">0</text>
            </svg>
          )},
          { key: 'notes', title: '각주 상태', body: (
            <svg viewBox="0 0 560 150" role="img" aria-label="각주 상태 미니어처">
              {[['즉시 정합',1],['유형·단위 이질',10],['표 미소재',2]].map(([t,n],i)=>(
                <g key={i}><text x="8" y={36+i*40} fontSize="12" fill="var(--muted)">{t}</text>
                <rect x="150" y={22+i*40} width={Number(n)*36} height="20" rx="4" fill="var(--accent)" opacity={1-i*0.3}/>
                <text x={158+Number(n)*36} y={37+i*40} fontSize="12" fill="var(--text)">{n}</text></g>
              ))}
            </svg>
          )},
          { key: 'firm', title: '기업 화면', body: (
            <div className="ov-mini-firm">
              <div><span>S-Oil</span><span className="mono">21.6조</span><span className="ov-chip">비적용 · 결정문</span></div>
              <div><span>POSCO홀딩스</span><span className="mono">101.0조</span><span className="ov-chip mutedc">판독 대기</span></div>
              <div><span>삼성전자</span><span className="mono">456.0조</span><span className="ov-chip mutedc">판독 대기</span></div>
            </div>
          )},
          { key: 'kssb', title: '관측 창', body: (
            <div className="ov-mini-kssb">
              {['FY2027 시행','FY2028 확대','2030 인증','2030–31 관측 창'].map((t,i)=>(
                <div key={t} className={i===3?'on':''}><span className="mono">{t.split(' ')[0]}</span><span>{t.split(' ').slice(1).join(' ')}</span></div>
              ))}
            </div>
          )},
        ]} />
      </section>
    </div>
  )
}
