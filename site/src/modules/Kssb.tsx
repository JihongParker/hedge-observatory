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
          <div key={s.yr} className={s.hot ? 'ks-box hot' : 'ks-box'}>
            <span className="ks-yr mono">{s.yr}</span>
            <span className="ks-what">{s.what}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
