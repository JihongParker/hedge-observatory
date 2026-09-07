import pilot from '../data/panel_pilot.json'
import { useCountUp } from '../hooks/useCountUp'
import './Coverage.css'

function Kpi({ label, target, text, sub }: { label: string; target?: number; text?: string; sub: string }) {
  const { ref, v } = useCountUp(target ?? 0)
  return (
    <div className="cov-kpi" ref={ref as React.Ref<HTMLDivElement>}>
      <span className="cov-label">{label}</span>
      <span className="cov-value mono">{target != null ? v.toLocaleString() : text}</span>
      <span className="cov-sub">{sub}</span>
    </div>
  )
}

// 파일럿 실측만 표시한다. 목업 값은 이 모듈에 넣지 않는다.
export default function Coverage() {
  const p = pilot.pilot

  return (
    <section className="cov">
      <h2>커버리지 <span className="cov-tag">파일럿 실측 · {pilot.as_of}</span></h2>
      <div className="cov-kpis">
        <Kpi label="대상 모집단" target={pilot.population_kospi} sub="코스피 상장 심사 통과" />
        <Kpi label="기존 패널" text={`${pilot.panel_firms} × ${pilot.panel_years}`} sub="기업 × 연도" />
        <Kpi label="지정 판독률 (파일럿)" text={`${p.designation_resolved} / ${p.firms}`} sub="각주 결정문 판독" />
        <Kpi label="수치표 즉시 정합" text={`${p.tables_comparable} / ${p.tables_located}`} sub="정규화 계층의 과제" />
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
