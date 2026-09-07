import './Kssb.css'

const STEPS = [
  { yr: 'FY2027', what: '의무 시작 — 자산 10조 원 이상 (첫 공시는 2028년)' },
  { yr: 'FY2028', what: '대상 확대 — 5조 원 이상' },
  { yr: '2030', what: '외부 검증 의무화 · 면책 종료' },
  { yr: '2030–31', what: '변화를 재는 창 — 이때 이 표를 열어 봅니다', hot: true },
]

export default function Kssb() {
  return (
    <section className="ks">
      <div className="src-row">
        <span className="src-chip">근거 <b>2026년 7월 확정된 제도</b></span>
        <span className="src-chip">형식 <b>사업보고서 법정 공시</b></span>
      </div>
      <h2>기후공시 관측</h2>
      <p className="ks-sub">2027년부터 자산 10조 원이 넘는 상장사는 기후 관련 정보를 의무로 공시해야 합니다. 의무가 생기면 회사 행동이 정말 바뀌는지 — 이 표가 돌고 있으면 조회 한 번으로 확인할 수 있습니다.</p>
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
        <h3>누가 언제 대상이 되나</h3>
        <table>
          <thead><tr><th>시행</th><th>대상</th><th>공시 개시</th><th>비고</th></tr></thead>
          <tbody>
            <tr><td className="mono">FY2027</td><td>자산 10조 원 이상 상장사</td><td className="mono">2028</td><td>약 50–60곳 — 수가 적어 비교가 가장 어렵습니다</td></tr>
            <tr><td className="mono">FY2028</td><td>5조 원 이상으로 확대</td><td className="mono">2029</td><td>2조 원 이상은 검토 중입니다</td></tr>
            <tr><td className="mono">2030</td><td>외부 검증 의무화</td><td className="mono">—</td><td>어기면 책임을 지는 법정 공시가 됩니다</td></tr>
          </tbody>
        </table>
        <p className="ks-note">의무가 단계적으로 퍼지기 때문에, 행동 변화가 있다면 2030–31년에 집중적으로 나타날 것으로 예상됩니다. 그 시점에 이 표를 열어 보는 것이 관측입니다.</p>
      </div>
    </section>
  )
}
