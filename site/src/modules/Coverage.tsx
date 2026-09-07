import { useState } from 'react'
import pilot from '../data/panel_pilot.json'
import { useCountUp } from '../hooks/useCountUp'
import './Coverage.css'

// 콕핏: 좌 파라미터 레일(자산 하한 슬라이더 — 실제 필터), 우 스탯 → 기업 표.
function Kpi({ label, target, text, sub }: { label: string; target?: number; text?: string; sub: string }) {
  const { ref, v } = useCountUp(target ?? 0)
  return (
    <div className="cov-kpi" ref={ref as React.Ref<HTMLDivElement>}>
      <span className="cov-label">{label}</span>
      <b className="mono">{target != null ? v.toLocaleString() : text}</b>
      <span className="cov-sub">{sub}</span>
    </div>
  )
}

export default function Coverage() {
  const p = pilot.pilot
  const [minAssets, setMinAssets] = useState(0)
  const rows = p.rows.filter((r) => r.assets_tn >= minAssets)
  return (
    <section className="cov">
      <div className="src-row">
        <span className="src-chip">모집단 <b>corpCode.xml</b> — Stage 1 산출</span>
        <span className="src-chip">지정 판독 <b>결정문 규칙</b> — Stage 2</span>
        <span className="src-chip">상태 <b>파일럿 14사 실측</b></span>
      </div>
      <h2>커버리지</h2>
      <div className="cov-cockpit">
        <aside className="cov-rail">
          <span className="sec-label">Filter</span>
          <label className="param-row">
            <span className="param-sym"><span className="sym">A</span><sub>min</sub></span>
            <span className="param-desc">총자산 하한입니다. 표가 즉시 걸러집니다.</span>
            <input type="range" min="0" max="450" step="10" value={minAssets}
              onChange={(e) => setMinAssets(Number(e.target.value))} />
            <span className="param-minmax mono">0 · 450조</span>
            <output className="param-chip mono">{minAssets}조 이상</output>
          </label>
          <button className="param-reset" onClick={() => setMinAssets(0)}>초기화</button>
          <span className="sec-label">Reading rule</span>
          <p className="cov-rule">지정 여부는 각주의 결정문에서 읽습니다. S-Oil 보고서에는 위험회피 용어가
            12회 나오지만 전부 상용구였고, 결정문 한 문장이 비적용을 확정했습니다. 키워드 빈도 분류기는
            이 기업을 오분류합니다.</p>
        </aside>
        <div className="cov-body">
          <div className="cov-kpis">
            <Kpi label="대상 모집단" target={pilot.population_kospi} sub="코스피 상장 심사 통과" />
            <Kpi label="기존 패널" text={`${pilot.panel_firms} × ${pilot.panel_years}`} sub="기업 × 연도" />
            <Kpi label="지정 판독률" text={`${p.designation_resolved} / ${p.firms}`} sub="각주 결정문 판독" />
            <Kpi label="수치표 즉시 정합" text={`${p.tables_comparable} / ${p.tables_located}`} sub="정규화 계층의 과제" />
          </div>
          <div className="cov-tablewrap">
            <table className="cov-table" data-tour="firms">
              <thead><tr><th>기업</th><th>총자산 FY2023</th><th>지정 판독</th><th>수치표</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="num mono">{r.assets_tn.toFixed(1)}조</td>
                    <td>{r.designation === 'not_applied'
                      ? <span className="cov-pill on">비적용 · 결정문</span>
                      : <span className="cov-pill">판독 대기</span>}</td>
                    <td>{r.table}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={4} className="cov-empty">해당 구간의 파일럿 기업이 없습니다.</td></tr>}
              </tbody>
            </table>
            <p className="cov-note">파일럿 3사 표시 중 · 전수 파싱이 끝나면 이 표가 2,391행이 됩니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
