import { useState } from 'react'
import './Evidence.css'

// 콕핏: 좌 정의 레일, 우 스탯 4열 → 차트 → 해설. 값은 전부 실측입니다.
const ATT = [
  { label: '지배구조 · 헤지회계', est: -0.5, lo: -6.8, hi: 6.0 },
  { label: '지배구조 · 파생사용', est: -5.0, lo: -11.3, hi: 1.3 },
  { label: '환경정보 · 헤지회계', est: 1.0, lo: -4.8, hi: 6.3 },
  { label: '환경정보 · 파생사용', est: -0.9, lo: -6.9, hi: 4.9 },
]
const NOTES = [
  { label: '단일표 · 즉시 정합', n: 1, tip: '1사 — S-Oil, 수작업 대조 완료' },
  { label: '유형·단위 이질', n: 10, tip: '10사 — 2개 이상 표 유형 혼재' },
  { label: '표 미소재', n: 2, tip: '2사 — 각주 내 수치표 없음' },
]
const X = (v: number) => 165 + (v + 12) * 16.5

export default function Evidence() {
  const [tip, setTip] = useState<{ x: number; y: number; t: string } | null>(null)
  const show = (e: React.MouseEvent, t: string) => setTip({ x: e.clientX, y: e.clientY, t })
  return (
    <section className="ev">
      <div className="src-row">
        <span className="src-chip">패널 <b>380 × 9</b> — 배치 파이프라인 산출</span>
        <span className="src-chip">추정량 <b>Callaway–Sant'Anna ATT</b></span>
        <span className="src-chip">비교집단 <b>not-yet-treated</b></span>
      </div>
      <h2>실측 근거</h2>
      <div className="ev-cockpit">
        <aside className="ev-rail">
          <span className="sec-label">Definitions</span>
          <dl>
            <dt><span className="sym">ATT</span></dt><dd>처리집단 평균 처리효과입니다. 단위는 pp입니다.</dd>
            <dt>정밀 null</dt><dd>신뢰구간이 ±6pp 안에서 닫히는 0 효과입니다. 공백이 아니라 측정입니다.</dd>
            <dt>파일럿</dt><dd>OpenDART 라이브 14사, FY2020–2023 각주 파싱입니다.</dd>
          </dl>
          <span className="sec-label">Source</span>
          <dl>
            <dt>표본</dt><dd>코스피 380사, 2016–2024</dd>
            <dt>위약 검정</dt><dd>인코딩 버그(가짜 +24pp)를 실제로 적발했습니다.</dd>
          </dl>
        </aside>
        <div className="ev-body">
          <div className="ev-stats">
            {ATT.map((r) => (
              <div key={r.label} className="ev-stat">
                <span className="ev-stat-label">{r.label}</span>
                <b className="mono">{r.est > 0 ? '+' : ''}{r.est.toFixed(1)}pp</b>
                <span className="ev-stat-chip mono">[{r.lo}, +{r.hi}]</span>
              </div>
            ))}
          </div>
          <div className="ev-grid">
            <figure className="ev-card" data-tour="att">
              <figcaption>공시의무 효과 — 네 추정치 전부 0을 포함합니다 (95% CI)</figcaption>
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
                      <line x1={X(r.lo)} y1={y} x2={X(r.hi)} y2={y} stroke="var(--accent)" strokeWidth="2" />
                      <circle cx={X(r.est)} cy={y} r="5" fill="var(--accent)" stroke="var(--panel)" strokeWidth="2"
                        onMouseMove={(e) => show(e, `${r.est > 0 ? '+' : ''}${r.est}pp [${r.lo}, +${r.hi}]`)}
                        onMouseLeave={() => setTip(null)} />
                    </g>
                  )
                })}
              </svg>
            </figure>
            <figure className="ev-card" data-tour="notes">
              <figcaption>파생 각주 수치표 상태 — 파일럿 13사</figcaption>
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
                <text x="8" y="182" fontSize="10.5" fill="var(--muted)">+ 문서 미수신 1사 · 이 10사를 정합으로 끌어올리는 것이 Stage 3의 과제입니다</text>
              </svg>
            </figure>
          </div>
          <div className="ev-notes">
            <div className="ev-note"><span className="ev-note-k mono">+1.3 ~ +6.0pp</span>
              <h3>경쟁 채널의 상한</h3>
              <p>현저성·거버넌스·순응비용 채널이 예측하는 양(+)의 반응을 신뢰구간 상한이 이 범위로 기각합니다.</p></div>
            <div className="ev-note"><span className="ev-note-k mono">MDE 9.0–9.2pp</span>
              <h3>검정력을 명시</h3>
              <p>부트스트랩 표준오차 3.2–3.3pp에서 80% 검정력 최소검출효과입니다. 검정력을 암묵에 두지 않습니다.</p></div>
            <div className="ev-note"><span className="ev-note-k mono">비교집단 3규칙</span>
              <h3>규칙에 안 기댄 결과</h3>
              <p>전체 미처리·인접 코호트·문턱 인근 — 세 규칙 모두에서 부호와 크기가 안정적입니다.</p></div>
          </div>
        </div>
      </div>
      {tip && <div className="ev-tip mono" style={{ left: tip.x + 12, top: tip.y - 32 }}>{tip.t}</div>}
    </section>
  )
}
