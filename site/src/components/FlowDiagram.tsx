import './FlowDiagram.css'

// 풀폭 5단계 플로우 — 간선에 상태변수 라벨, 마지막은 회귀 점선(관측 창 → 다음 배치).
const NODES = [
  { t: '수집', d: 'corpCode · document.xml' },
  { t: '판별', d: '결정문 판독 · 표 태깅' },
  { t: '정규화', d: '단위 통일 · 200건 대조' },
  { t: '공개', d: 'panel.json · 대시보드' },
  { t: '관측', d: 'KSSB 2030–31 창' },
]
const EDGES = ['rcept_no', '각주 절', '정규화 행', '패널 조회']

export default function FlowDiagram() {
  return (
    <div className="flow" role="img" aria-label="수집부터 관측까지 5단계 흐름">
      {NODES.map((n, i) => (
        <div className="flow-seg" key={n.t}>
          <div className="flow-node">
            <span className="flow-t">{n.t}</span>
            <span className="flow-d">{n.d}</span>
          </div>
          {i < EDGES.length && (
            <div className="flow-edge">
              <span className="flow-var mono">{EDGES[i]}</span>
              <svg viewBox="0 0 60 10" aria-hidden="true"><path d="M0 5 H52 M52 5 l-6 -3.4 M52 5 l-6 3.4" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>
            </div>
          )}
        </div>
      ))}
      <svg className="flow-return" viewBox="0 0 1000 34" preserveAspectRatio="none" aria-hidden="true">
        <path d="M960 2 v18 a8 8 0 0 1 -8 8 H48 a8 8 0 0 1 -8 -8 V2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 5"/>
      </svg>
      <span className="flow-return-label mono">다음 연차 배치</span>
    </div>
  )
}
