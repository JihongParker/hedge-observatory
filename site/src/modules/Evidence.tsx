import { useState } from 'react'
import './Evidence.css'

// 실측 근거 두 장 — P4의 ATT 점-구간(정밀 null)과 파일럿 각주 상태.
// 값은 전부 실측. 호버 툴팁으로 조회.
const ATT = [
  { label: '지배구조 의무 · 헤지회계', est: -0.5, lo: -6.8, hi: 6.0 },
  { label: '지배구조 의무 · 파생사용', est: -5.0, lo: -11.3, hi: 1.3 },
  { label: '환경정보 의무 · 헤지회계', est: 1.0, lo: -4.8, hi: 6.3 },
  { label: '환경정보 의무 · 파생사용', est: -0.9, lo: -6.9, hi: 4.9 },
]
const NOTES = [
  { label: '단일표 · 즉시 정합', n: 1, tip: '1사 — S-Oil, 수작업 대조 완료' },
  { label: '유형·단위 이질', n: 10, tip: '10사 — 2개 이상 표 유형 혼재' },
  { label: '표 미소재', n: 2, tip: '2사 — 각주 내 수치표 없음' },
]
const X = (v: number) => 165 + (v + 12) * 16.5 // -12pp..+8pp -> 165..495

export default function Evidence() {
  const [tip, setTip] = useState<{ x: number; y: number; t: string } | null>(null)
  const show = (e: React.MouseEvent, t: string) => setTip({ x: e.clientX, y: e.clientY, t })
  return (
    <section className="ev">
      <h2>관측소가 답하는 질문 <span className="ev-tag">실측</span></h2>
      <div className="ev-grid">
        <figure className="ev-card" data-tour="att">
          <figcaption>공시의무 효과 (380사 패널 · CS ATT · 95% CI)</figcaption>
          <svg viewBox="0 0 520 190" role="img" aria-label="네 추정치의 점-구간, 전부 0 포함">
            <line x1={X(0)} y1="10" x2={X(0)} y2="158" stroke="var(--line)" strokeWidth="1.4" />
            <text x={X(0)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">0</text>
            <text x={X(-10)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">−10pp</text>
            <text x={X(5)} y="174" textAnchor="middle" fontSize="10" fill="var(--muted)">+5</text>
            {ATT.map((r, i) => {
              const y = 30 + i * 38
              return (
                <g key={r.label}>
                  <text x="8" y={y + 4} fontSize="11" fill="var(--muted)">{r.label}</text>
                  <line className="ev-ci" x1={X(r.lo)} y1={y} x2={X(r.hi)} y2={y} stroke="var(--accent)" strokeWidth="2" style={{ transitionDelay: `${i * 90}ms` }} />
                  <circle cx={X(r.est)} cy={y} r="5" fill="var(--accent)" stroke="var(--panel)" strokeWidth="2"
                    onMouseMove={(e) => show(e, `${r.est > 0 ? '+' : ''}${r.est}pp [${r.lo}, +${r.hi}]`)}
                    onMouseLeave={() => setTip(null)} />
                </g>
              )
            })}
          </svg>
        </figure>
        <figure className="ev-card" data-tour="notes">
          <figcaption>파생 각주 수치표 상태 (파일럿 13사)</figcaption>
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
            <text x="8" y="182" fontSize="10.5" fill="var(--muted)">+ 문서 미수신 1사 · 이 10사를 정합으로 끌어올리는 것이 Stage 3의 과제</text>
          </svg>
        </figure>
      </div>
      <div className="ev-notes">
        <div className="ev-note">
          <span className="ev-note-k mono">+1.3 ~ +6.0pp</span>
          <h3>경쟁 채널의 상한</h3>
          <p>현저성·거버넌스·순응비용 채널이 예측하는 양(+)의 반응을 신뢰구간 상한이 이 범위로 기각한다. null은 공백이 아니라 측정이다.</p>
        </div>
        <div className="ev-note">
          <span className="ev-note-k mono">MDE 9.0–9.2pp</span>
          <h3>검정력을 명시</h3>
          <p>부트스트랩 표준오차 3.2–3.3pp에서 80% 검정력 최소검출효과. 검정력을 암묵에 두지 않고 수치로 보고한다.</p>
        </div>
        <div className="ev-note">
          <span className="ev-note-k mono">비교집단 3규칙</span>
          <h3>규칙에 안 기댄 결과</h3>
          <p>전체 미처리·인접 코호트·문턱 인근 — 세 규칙 모두에서 부호와 크기가 안정. 위약 검정은 실제로 인코딩 버그(가짜 +24pp)를 적발했다.</p>
        </div>
      </div>
      {tip && <div className="ev-tip mono" style={{ left: tip.x + 12, top: tip.y - 32 }}>{tip.t}</div>}
    </section>
  )
}
