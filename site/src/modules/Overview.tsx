import ScanField from '../components/ScanField'
import FlowDiagram from '../components/FlowDiagram'
import Carousel from '../components/Carousel'
import './Overview.css'

// 랜딩 — 비전공 독자가 첫 문장에서 이해하도록 쉬운 말 우선. 값은 전부 실측.
export default function Overview({ go, startTour }: { go: (id: string) => void; startTour: () => void }) {
  return (
    <div className="ov">
      <section className="ov-hero">
        <div className="ov-scene" aria-hidden="true"><ScanField /></div>
        <div className="ov-hero-copy">
          <span className="sec-label ov-cap">Korean corporate hedging observatory</span>
          <h1 className="ov-title">
            회사들이 환율과 유가에<br />어떻게 대비하는지,<br />공시로 <em>읽어냅니다</em>
          </h1>
          <p className="ov-lede">
            상장사 사업보고서에는 회사가 위험에 대비해 맺은 금융계약을 적는 <b>파생상품 주석</b>이 있습니다.
            이 관측소는 2,391곳의 그 글을 컴퓨터로 읽어 <b>누구나 볼 수 있는 하나의 표</b>로 만듭니다.
            뒤의 점 하나가 회사 하나, 지나가는 빛줄기가 "읽는 중"이라는 뜻입니다.
          </p>
          <div className="ov-cta">
            <button className="ov-btn-primary" onClick={startTour}>둘러보기 시작</button>
            <button className="ov-btn-ghost" onClick={() => go('evidence')}>확인된 사실 보기</button>
          </div>
        </div>
        <span className="ov-follow mono" aria-hidden="true">Follow the chain ↓</span>
      </section>

      <section className="ov-sec">
        <span className="sec-label">Process</span>
        <h2>이 표가 만들어지는 다섯 걸음</h2>
        <FlowDiagram />
      </section>

      <section className="ov-sec">
        <span className="sec-label">Screens</span>
        <h2>네 개의 화면</h2>
        <div className="ov-cards">
          {[
            { id: 'evidence', name: '확인된 사실', desc: '공시 의무가 생기면 회사가 위험 대비를 늘릴까요? 380개사의 9년치를 비교했더니, 달라진 것이 없었습니다.', stat: '변화 ±6%p 안 — 정밀한 무변화' },
            { id: 'coverage', name: '읽은 범위', desc: '지금까지 14곳을 시범으로 읽었습니다. 위험회피 회계를 쓰는지는 문서의 결정 문장 하나로 판정합니다.', stat: '판정 성공 10 / 14' },
            { id: 'pipeline', name: '만드는 과정', desc: '1년에 한 번 보고서를 읽어 표를 갱신합니다. 사람 손은 검수에만 듭니다.', stat: '4단계 중 2단계 완성' },
            { id: 'kssb', name: '기후공시 관측', desc: '2027년부터 큰 회사들은 기후 정보를 의무로 공시합니다. 그때 행동이 정말 바뀌는지 이 표로 지켜봅니다.', stat: '관측 시점 2030–31' },
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
        <span className="sec-label">Numbers</span>
        <h2>지금까지의 숫자</h2>
        <div className="ov-proof">
          <div className="ov-proof-item"><b className="mono">2,391</b><span>읽을 대상 회사 (코스피 상장 심사 통과)</span></div>
          <div className="ov-proof-item"><b className="mono">3,420</b><span>이미 읽어 둔 기록 (380개사 × 9년)</span></div>
          <div className="ov-proof-item"><b className="mono">10 / 14</b><span>시범 판정 성공</span></div>
          <div className="ov-proof-item"><b className="mono">1 / 13</b><span>표끼리 바로 비교되는 회사 — 그래서 이 작업이 필요합니다</span></div>
        </div>
      </section>

      <section className="ov-sec">
        <span className="sec-label">Live miniature</span>
        <h2>화면 미리보기</h2>
        <Carousel slides={[
          { key: 'att', title: '변화 없음', body: (
            <svg viewBox="0 0 560 150" role="img" aria-label="네 추정치 점-구간 미니어처, 전부 0을 포함">
              <line x1="330" y1="8" x2="330" y2="130" stroke="var(--line)" />
              {[[-0.5,-6.8,6.0],[-5.0,-11.3,1.3],[1.0,-4.8,6.3],[-0.9,-6.9,4.9]].map(([e,l,h],i)=>{
                const X=(v:number)=>330+v*13, y=22+i*30
                return <g key={i}><line x1={X(l)} y1={y} x2={X(h)} y2={y} stroke="var(--accent)" strokeWidth="2"/><circle cx={X(e)} cy={y} r="4.5" fill="var(--accent)"/></g>
              })}
              <text x="330" y="146" textAnchor="middle" fontSize="10" fill="var(--muted)">0 = 변화 없음</text>
            </svg>
          )},
          { key: 'notes', title: '표 상태', body: (
            <svg viewBox="0 0 560 150" role="img" aria-label="시범 13곳의 표 상태 미니어처">
              {[['바로 비교 가능',1],['모양이 제각각',10],['표가 없음',2]].map(([t,n],i)=>(
                <g key={i}><text x="8" y={36+i*40} fontSize="12" fill="var(--muted)">{t}</text>
                <rect x="150" y={22+i*40} width={Number(n)*36} height="20" rx="4" fill="var(--accent)" opacity={1-i*0.3}/>
                <text x={158+Number(n)*36} y={37+i*40} fontSize="12" fill="var(--text)">{n}</text></g>
              ))}
            </svg>
          )},
          { key: 'firm', title: '회사 화면', body: (
            <div className="ov-mini-firm">
              <div><span>S-Oil</span><span className="mono">21.6조</span><span className="ov-chip">위험회피 회계 안 씀</span></div>
              <div><span>POSCO홀딩스</span><span className="mono">101.0조</span><span className="ov-chip mutedc">판정 대기</span></div>
              <div><span>삼성전자</span><span className="mono">456.0조</span><span className="ov-chip mutedc">판정 대기</span></div>
            </div>
          )},
          { key: 'kssb', title: '관측 창', body: (
            <div className="ov-mini-kssb">
              {[['FY2027','의무 시작'],['FY2028','대상 확대'],['2030','검증 의무'],['2030–31','변화 관측']].map((t,i)=>(
                <div key={t[0]} className={i===3?'on':''}><span className="mono">{t[0]}</span><span>{t[1]}</span></div>
              ))}
            </div>
          )},
        ]} />
      </section>
    </div>
  )
}
