import pilot from '../data/panel_pilot.json'
import './Coverage.css'

// 파일럿 실측만 표시한다. 목업 값은 이 모듈에 넣지 않는다.
export default function Coverage() {
  const p = pilot.pilot
  const kpis = [
    { label: '대상 모집단', value: pilot.population_kospi.toLocaleString(), sub: '코스피 상장 심사 통과' },
    { label: '기존 패널', value: `${pilot.panel_firms} × ${pilot.panel_years}`, sub: '기업 × 연도' },
    { label: '지정 판독률 (파일럿)', value: `${p.designation_resolved} / ${p.firms}`, sub: '각주 결정문 판독' },
    { label: '수치표 즉시 정합', value: `${p.tables_comparable} / ${p.tables_located}`, sub: '정규화 계층의 과제' },
  ]
  return (
    <section className="cov">
      <h2>커버리지 <span className="cov-tag">파일럿 실측 · {pilot.as_of}</span></h2>
      <div className="cov-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="cov-kpi">
            <span className="cov-label">{k.label}</span>
            <span className="cov-value mono">{k.value}</span>
            <span className="cov-sub">{k.sub}</span>
          </div>
        ))}
      </div>
      <table className="cov-table">
        <thead><tr><th>기업</th><th>총자산(조)</th><th>지정</th><th>수치표</th></tr></thead>
        <tbody>
          {p.rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td className="mono num">{r.assets_tn.toFixed(1)}</td>
              <td>{r.designation === 'not_applied' ? '비적용' : r.designation === 'applied' ? '적용' : '판독 대기'}
                <span className="cov-basis"> · {r.designation_basis}</span></td>
              <td>{r.table}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
