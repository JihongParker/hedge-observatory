import './Kssb.css'

const STEPS = [
  { yr: 'FY2027', what: '1단계 시행 — 연결자산 10조 이상 코스피 (공시는 2028)' },
  { yr: 'FY2028', what: '2단계 — 5조 이상 확대, 2조 검토' },
  { yr: '2030', what: '제3자 인증 · 면책 종료' },
  { yr: '2030–31', what: '사전 등록된 관측 창 — 코호트별 헤지 반응 측정', hot: true },
]

export default function Kssb() {
  return (
    <section className="ks">
      <h2>KSSB 추적</h2>
      <p className="ks-sub">관측소가 가동 중이면 기후공시 의무의 헤지 반응 검증은 별도 프로젝트가 아니라 조회 한 번이 된다.</p>
      <div className="ks-strip">
        <span className="ks-now mono">지금 · 2026</span>
        {STEPS.map((s) => (
          <div key={s.yr} className={s.hot ? 'ks-box hot' : 'ks-box'} data-tour={s.hot ? 'window' : undefined}>
            <span className="ks-yr mono">{s.yr}</span>
            <span className="ks-what">{s.what}</span>
          </div>
        ))}
      </div>
      <div className="ks-cohorts">
        <h3>코호트 구조 (2026-07-08 최종안)</h3>
        <table>
          <thead><tr><th>시행</th><th>대상</th><th>공시 개시</th><th>비고</th></tr></thead>
          <tbody>
            <tr><td className="mono">FY2027</td><td>연결자산 10조 이상 코스피</td><td className="mono">2028</td><td>약 50–60사 — 가장 얇은 비교집단</td></tr>
            <tr><td className="mono">FY2028</td><td>5조 이상 확대</td><td className="mono">2029</td><td>2조 이상은 검토 단계</td></tr>
            <tr><td className="mono">2030</td><td>제3자 인증 · 면책 종료</td><td className="mono">—</td><td>자본시장법 사업보고서 법정공시</td></tr>
          </tbody>
        </table>
        <p className="ks-note">단계 시행이라 헤지 반응은 2030–31 창에 집중될 것으로 예고되어 있다. 관측소가 가동 중이면 이 창의 측정은 조회 한 번이다.</p>
      </div>
    </section>
  )
}
