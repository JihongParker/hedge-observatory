import './Pipeline.css'

const STAGES = [
  { no: 1, name: '수집', desc: 'corpCode.xml로 모집단을 확정하고 사업보고서 document.xml을 전수 수집합니다. CP949 처리를 포함합니다.', status: '기구축' },
  { no: 2, name: '판별', desc: '지정 여부를 각주 결정문에서 판독합니다. 표 유형 분류기가 수치표 형태를 태깅합니다.', status: '파일럿 검증' },
  { no: 3, name: '정규화·검증', desc: '유형·단위 통일 규칙으로 이질 표를 정합화합니다. 무작위 200건을 수작업 대조합니다.', status: '신규' },
  { no: 4, name: '공개', desc: '패널(기업×연도×상품×명목×지정)과 대시보드, KSSB 추적 모듈을 공개합니다.', status: '신규' },
]

export default function Pipeline() {
  return (
    <section className="pl">
      <div className="src-row">
        <span className="src-chip">재사용 <b>380사 패널 검증 코드</b></span>
        <span className="src-chip">실행 <b>배치 1회 · launchd 감시</b></span>
        <span className="src-chip">산출 <b>panel.json — 정적</b></span>
      </div>
      <h2>배치 파이프라인</h2>
      <div className="pl-grid">
        {STAGES.map((s) => (
          <div key={s.no} className="pl-stage">
            <span className="sec-label">Stage {s.no}</span>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className={s.status === '신규' ? 'pl-chip' : 'pl-chip done'}>{s.status}</span>
          </div>
        ))}
      </div>
      <div className="pl-band">
        <div className="pl-panel">
          <h3>재사용 계보</h3>
          <p>Stage 1·2는 380사 패널을 만든 검증 코드 위에 섭니다. 새로 짓는 것은 정규화 계층 하나입니다.</p>
          <ul>
            <li><span className="mono">opendart_pipeline.py</span><span>수집·재무 구조층</span></li>
            <li><span className="mono">derivative_parser.py</span><span>각주 절 추출·표 태깅</span></li>
            <li><span className="mono">notes_probe.py</span><span>결정문 판독 파일럿</span></li>
          </ul>
        </div>
        <div className="pl-panel">
          <h3>토큰 경계</h3>
          <p>언어 판단이 필요한 곳에만 LLM을 씁니다. 정규식 사전필터가 파생 무관 기업-연도를 걸러내고,
            결정문은 규칙 우선 — LLM은 모호 건의 배치 1회 처리입니다.</p>
          <ul>
            <li><span className="mono">배치 1회</span><span>문서당, 적재 시</span></li>
            <li><span className="mono">일일 감시</span><span>목록 API 폴링 — LLM 0</span></li>
            <li><span className="mono">사이트</span><span>panel.json 읽기 전용 — 로드당 토큰 0</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
