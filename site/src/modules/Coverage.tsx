import { useMemo, useState } from 'react'
import panel from '../data/panel.json'
import { useCountUp } from '../hooks/useCountUp'
import './Coverage.css'

// 콕핏: 좌 필터 레일(자산 하한 + 이름 검색), 우 집계 → 380행 실데이터 표.
const TSTAT: Record<string, string> = {
  comparable: '비교 가능', single_unit_check: '단위 확인 필요', hetero: '모양 제각각',
  no_table: '표 없음', missing_doc: '문서 못 받음',
}

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
  const [minAssets, setMinAssets] = useState(0)
  const [q, setQ] = useState('')
  const rows = useMemo(() =>
    panel.rows.filter((r) => r.assets_tn >= minAssets && (!q || r.name.includes(q))),
    [minAssets, q])
  const resolved = panel.agg.applied + panel.agg.not_applied
  const SHOW = 40
  return (
    <section className="cov">
      <div className="src-row">
        <span className="src-chip">자료 <b>{panel.source}</b></span>
        <span className="src-chip">판정 방식 <b>결정 문장 읽기</b></span>
        <span className="src-chip">갱신 <b>{panel.as_of}</b></span>
      </div>
      <h2>읽은 범위</h2>
      <p className="cov-lead">380개 상장사의 최신 사업보고서를 읽어 위험회피 회계 사용 여부를 판정한 결과입니다.
        아래 표의 한 줄이 회사 하나입니다.</p>
      <div className="cov-cockpit">
        <aside className="cov-rail">
          <span className="sec-label">Filter</span>
          <label className="param-row">
            <span className="param-sym"><span className="sym">A</span><sub>min</sub></span>
            <span className="param-desc">회사 크기(총자산)의 하한선입니다. 움직이면 표가 바로 걸러집니다.</span>
            <input type="range" min="0" max="450" step="10" value={minAssets}
              onChange={(e) => setMinAssets(Number(e.target.value))} />
            <span className="param-minmax mono">0 · 450조</span>
            <output className="param-chip mono">{minAssets}조 이상</output>
          </label>
          <input className="cov-search" type="search" placeholder="회사 이름 검색"
            value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="param-reset" onClick={() => { setMinAssets(0); setQ('') }}>초기화</button>
          <span className="sec-label">How we decide</span>
          <p className="cov-rule">보고서의 결정 문장 하나로 판정합니다. S-Oil 보고서에는 위험회피라는 말이
            12번 나오지만 전부 상투적 문구였고, "적용하지 않는다"는 한 문장이 결론이었습니다.
            단어 개수를 세면 이 회사를 반대로 분류하게 됩니다.</p>
        </aside>
        <div className="cov-body">
          <div className="cov-kpis">
            <Kpi label="읽은 회사" target={panel.n} sub={`대상 2,391곳 중 1차 코호트`} />
            <Kpi label="판정 성공" text={`${resolved} / ${panel.n}`} sub="결정 문장으로 확정" />
            <Kpi label="위험회피 회계 씀" target={panel.agg.applied} sub={`안 씀 ${panel.agg.not_applied}곳 · 미판정 ${panel.agg.unresolved}곳`} />
            <Kpi label="바로 비교 가능한 표" target={panel.tables.comparable} sub="나머지를 맞추는 것이 다음 걸음" />
          </div>
          <div className="cov-tablewrap">
            <table className="cov-table" data-tour="firms">
              <thead><tr><th>회사</th><th>총자산 (2024)</th><th>위험회피 회계</th><th>숫자표 상태</th></tr></thead>
              <tbody>
                {rows.slice(0, SHOW).map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="num mono">{r.assets_tn ? `${r.assets_tn.toFixed(1)}조` : '—'}</td>
                    <td>{r.applied === true ? <span className="cov-pill on">씀</span>
                      : r.applied === false ? <span className="cov-pill on">안 씀</span>
                      : <span className="cov-pill">미판정</span>}</td>
                    <td>{TSTAT[r.table] ?? r.table}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={4} className="cov-empty">조건에 맞는 회사가 없습니다.</td></tr>}
              </tbody>
            </table>
            <p className="cov-note">{rows.length.toLocaleString()}곳 일치
              {rows.length > SHOW ? ` · 자산 상위 ${SHOW}곳 표시` : ''} · 전체 대상은 2,391곳으로 확대 예정입니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
