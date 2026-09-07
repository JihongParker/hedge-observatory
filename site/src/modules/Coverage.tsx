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
        <span className="src-chip">대상 <b>코스피 상장사 전체</b></span>
        <span className="src-chip">판정 방식 <b>결정 문장 읽기</b></span>
        <span className="src-chip">현재 <b>시범 14곳 완료</b></span>
      </div>
      <h2>읽은 범위</h2>
      <div className="cov-cockpit">
        <aside className="cov-rail">
          <span className="sec-label">Filter</span>
          <label className="param-row">
            <span className="param-sym"><span className="sym">A</span><sub>min</sub></span>
            <span className="param-desc">회사 크기(총자산)의 하한선입니다. 움직이면 아래 표가 바로 걸러집니다.</span>
            <input type="range" min="0" max="450" step="10" value={minAssets}
              onChange={(e) => setMinAssets(Number(e.target.value))} />
            <span className="param-minmax mono">0 · 450조</span>
            <output className="param-chip mono">{minAssets}조 이상</output>
          </label>
          <button className="param-reset" onClick={() => setMinAssets(0)}>초기화</button>
          <span className="sec-label">How we decide</span>
          <p className="cov-rule">회사가 위험회피 회계를 쓰는지는 보고서의 결정 문장 하나로 판정합니다.
            S-Oil 보고서에는 위험회피라는 말이 12번 나오지만 전부 상투적 문구였고,
            "적용하지 않는다"는 한 문장이 결론이었습니다. 단어 개수를 세면 이 회사를 반대로 분류하게 됩니다.</p>
        </aside>
        <div className="cov-body">
          <div className="cov-kpis">
            <Kpi label="읽을 대상 회사" target={pilot.population_kospi} sub="코스피 상장 심사 통과" />
            <Kpi label="이미 읽어 둔 기록" text={`${pilot.panel_firms} × ${pilot.panel_years}`} sub="회사 수 × 연도 수" />
            <Kpi label="판정 성공" text={`${p.designation_resolved} / ${p.firms}`} sub="결정 문장으로 판정" />
            <Kpi label="바로 비교 가능한 표" text={`${p.tables_comparable} / ${p.tables_located}`} sub="나머지를 맞추는 것이 본론" />
          </div>
          <div className="cov-tablewrap">
            <table className="cov-table" data-tour="firms">
              <thead><tr><th>회사</th><th>총자산 (2023)</th><th>위험회피 회계</th><th>숫자표 상태</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="num mono">{r.assets_tn.toFixed(1)}조</td>
                    <td>{r.designation === 'not_applied'
                      ? <span className="cov-pill on">안 씀 · 문장으로 확정</span>
                      : r.designation === 'applied'
                      ? <span className="cov-pill on">씀 · 문장으로 확정</span>
                      : <span className="cov-pill">판정 대기</span>}</td>
                    <td>{r.table === '정합' ? '비교 가능' : r.table === '유형 혼재' ? '모양 제각각' : r.table}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={4} className="cov-empty">이 크기 구간에는 시범 회사가 없습니다.</td></tr>}
              </tbody>
            </table>
            <p className="cov-note">지금은 시범 3곳만 보입니다. 전체 읽기가 끝나면 이 표가 2,391줄이 됩니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
