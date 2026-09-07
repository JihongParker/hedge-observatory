import './FlowDiagram.css'

// 풀폭 5단계 흐름 — 쉬운 말 우선, 좁은 화면에서는 가로 스크롤로 형태를 지킵니다.
const NODES = [
  { t: '모은다', d: '전자공시에서 사업보고서를 내려받습니다' },
  { t: '읽는다', d: '주석의 결정 문장을 찾아 판정합니다' },
  { t: '맞춘다', d: '표 모양과 단위를 하나로 통일합니다' },
  { t: '공개한다', d: '누구나 보는 하나의 표로 만듭니다' },
  { t: '지켜본다', d: '기후공시 이후의 변화를 관측합니다' },
]
const EDGES = ['보고서', '주석 문장', '정리된 숫자', '완성된 표']

export default function FlowDiagram() {
  return (
    <div className="flow-scroll">
      <div className="flow" role="img" aria-label="모으고 읽고 맞추고 공개하고 지켜보는 5단계 흐름">
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
        <span className="flow-return-label mono">해마다 반복</span>
      </div>
    </div>
  )
}
