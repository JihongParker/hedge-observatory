import { useState } from 'react'
import './Evidence.css'

// 콕핏: 좌 정의 레일, 우 스탯 4열 → 차트 → 해설. 값은 전부 실측입니다.
const ATT = [
  { label: '지배구조 보고서 의무 · 위험회피 회계', est: -0.5, lo: -6.8, hi: 6.0 },
  { label: '지배구조 보고서 의무 · 파생상품 사용', est: -5.0, lo: -11.3, hi: 1.3 },
  { label: '환경정보 의무 · 위험회피 회계', est: 1.0, lo: -4.8, hi: 6.3 },
  { label: '환경정보 의무 · 파생상품 사용', est: -0.9, lo: -6.9, hi: 4.9 },
]
const NOTES = [
  { label: '바로 비교 가능', n: 1, tip: '1곳 — S-Oil, 사람이 검산까지 끝냈습니다' },
  { label: '표 모양이 제각각', n: 10, tip: '10곳 — 표 형식이 2가지 이상 섞여 있습니다' },
  { label: '표가 없음', n: 2, tip: '2곳 — 주석에 숫자표가 없습니다' },
]
const X = (v: number) => 165 + (v + 12) * 16.5

export default function Evidence() {
  const [tip, setTip] = useState<{ x: number; y: number; t: string } | null>(null)
  const show = (e: React.MouseEvent, t: string) => setTip({ x: e.clientX, y: e.clientY, t })
  return (
    <section className="ev">
      <div className="src-row">
        <span className="src-chip">자료 <b>380개사 × 9년</b></span>
        <span className="src-chip">방법 <b>의무 도입 시점 차이 비교</b></span>
        <span className="src-chip">결과 <b>변화 없음</b></span>
      </div>
      <h2>확인된 사실</h2>
      <p className="ev-lead">공시 의무가 생기면 회사가 위험 대비를 늘릴 것 같지만, 380개사의 9년치 기록에서는 그런 변화가 보이지 않았습니다. 아래 네 경우 모두에서 그렇습니다.</p>
      <div className="ev-cockpit">
        <aside className="ev-rail">
          <span className="sec-label">How to read</span>
          <dl>
            <dt>질문</dt><dd>공시 의무가 생기면 회사가 환율·유가 위험 대비를 늘릴까요?</dd>
            <dt>재는 법</dt><dd>의무가 먼저 적용된 회사와 아직인 회사를 같은 기간에 비교합니다.</dd>
            <dt>가로 막대</dt><dd>통계적으로 가능한 범위입니다. 막대가 0을 지나면 "늘었다고도 줄었다고도 말할 수 없음"입니다.</dd>
            <dt>왜 의미 있나</dt><dd>"효과 없음"을 정밀하게 재는 것도 발견입니다. 의무의 실효를 묻는 근거가 됩니다.</dd>
          </dl>
        </aside>
        <div className="ev-body">
          <div className="ev-stats">
            {ATT.map((r) => (
              <div key={r.label} className="ev-stat">
                <span className="ev-stat-label">{r.label}</span>
                <b className="mono">{r.est > 0 ? '+' : ''}{r.est.toFixed(1)}%p</b>
                <span className="ev-stat-chip mono">[{r.lo}, +{r.hi}]</span>
              </div>
            ))}
          </div>
          <div className="ev-grid">
            <figure className="ev-card" data-tour="att">
              <figcaption>의무 도입 뒤 달라진 정도 — 네 경우 모두 막대가 0을 지납니다 (%p)</figcaption>
              <svg viewBox="0 0 520 190" role="img" aria-label="네 추정치의 점-구간, 전부 0 포함">
                <line x1={X(0)} y1="10" x2={X(0)} y2="158" stroke="var(--line)" strokeWidth="1.4" />
                <text x={X(0)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">0 = 변화 없음</text>
                <text x={X(-10)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">−10%p</text>
                <text x={X(5)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">+5</text>
                {ATT.map((r, i) => {
                  const y = 30 + i * 38
                  return (
                    <g key={r.label}>
                      <text x="8" y={y + 4} fontSize="11" fill="var(--muted)">{r.label}</text>
                      <line x1={X(r.lo)} y1={y} x2={X(r.hi)} y2={y} stroke="var(--accent)" strokeWidth="2" />
                      <circle cx={X(r.est)} cy={y} r="5" fill="var(--accent)" stroke="var(--panel)" strokeWidth="2"
                        onMouseMove={(e) => show(e, `${r.est > 0 ? '+' : ''}${r.est}%p (가능 범위 ${r.lo} ~ +${r.hi})`)}
                        onMouseLeave={() => setTip(null)} />
                    </g>
                  )
                })}
              </svg>
            </figure>
            <figure className="ev-card" data-tour="notes">
              <figcaption>시범으로 읽은 13곳의 표 상태 — 왜 이 작업이 필요한지 보여 줍니다</figcaption>
              <svg viewBox="0 0 520 190" role="img" aria-label="정합 1, 이질 10, 미소재 2">
                {NOTES.map((r, i) => {
                  const y = 26 + i * 50
                  return (
                    <g key={r.label}>
                      <text x="8" y={y + 16} fontSize="11.5" fill="var(--muted)">{r.label}</text>
                      <rect x="165" y={y} width={r.n * 30} height="22" rx="4" fill="var(--accent)" opacity={1 - i * 0.28}
                        onMouseMove={(e) => show(e, r.tip)} onMouseLeave={() => setTip(null)} />
                      <text x={165 + r.n * 30 + 8} y={y + 16} fontSize="12" fill="var(--text)" className="mono">{r.n}</text>
                    </g>
                  )
                })}
                <line x1="165" y1="18" x2="165" y2="160" stroke="var(--line)" strokeWidth="1.4" />
                <text x="8" y="182" fontSize="10.5" fill="var(--muted)">+ 문서를 못 받은 1곳 · 제각각인 10곳을 비교 가능하게 맞추는 것이 다음 단계입니다</text>
              </svg>
            </figure>
          </div>
          <div className="ev-notes">
            <div className="ev-note"><span className="ev-note-k mono">+6%p가 상한</span>
              <h3>"늘었다"는 주장 배제</h3>
              <p>의무 때문에 대비가 늘었다는 설명이 맞으려면 최소한의 증가가 보여야 하는데, 가능한 범위의 위쪽 끝이 +1.3~+6.0%p에 그칩니다.</p></div>
            <div className="ev-note"><span className="ev-note-k mono">9%p</span>
              <h3>놓쳤을 가능성도 계산</h3>
              <p>이 자료로 확실히 잡아낼 수 있는 변화의 크기는 약 9%p부터입니다. "못 본 것"의 한계까지 수치로 밝혀 둡니다.</p></div>
            <div className="ev-note"><span className="ev-note-k mono">3가지 비교</span>
              <h3>비교 상대를 바꿔도 같음</h3>
              <p>비교 대상 회사를 고르는 방법을 세 가지로 바꿔 봐도 결론이 같습니다. 특정한 비교 방식에 기댄 결과가 아닙니다.</p></div>
          </div>
        </div>
      </div>
      {tip && <div className="ev-tip mono" style={{ left: tip.x + 12, top: tip.y - 32 }}>{tip.t}</div>}
    </section>
  )
}
