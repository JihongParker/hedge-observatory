import './Pipeline.css'

const STAGES = [
  { no: 1, name: '수집', desc: 'corpCode.xml 모집단 확정, 사업보고서 document.xml 전수 수집. CP949 처리 포함.', status: '기구축' },
  { no: 2, name: '판별', desc: '지정 여부는 각주 결정문에서 판독. 표 유형 분류기가 수치표 형태를 태깅.', status: '파일럿 검증' },
  { no: 3, name: '정규화·검증', desc: '유형·단위 통일 규칙으로 이질 표를 정합화. 무작위 200건 수작업 대조.', status: '신규' },
  { no: 4, name: '공개', desc: '패널 공개(기업×연도×상품×명목×지정), 대시보드, KSSB 추적 모듈.', status: '신규' },
]

// 배치 1회 실행 구조: LLM 파싱은 적재 시에만, 이 사이트는 정적 panel.json을 읽는다.
export default function Pipeline() {
  return (
    <section className="pl">
      <h2>파이프라인</h2>
      <div className="pl-grid">
        {STAGES.map((s) => (
          <div key={s.no} className="pl-stage">
            <span className="pl-no mono">STAGE {s.no}</span>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className={s.status === '신규' ? 'pl-chip new' : 'pl-chip done'}>{s.status}</span>
          </div>
        ))}
      </div>
      <div className="pl-band">
        <div className="pl-panel">
          <h3>재사용 계보</h3>
          <p>Stage 1·2는 380사 패널을 만든 검증 코드 위에 선다 — 수집·목록 폴링, 각주 절 추출과 결정문 판독, 2021년 이전 문서의 CP949 인코딩 처리까지. 새로 짓는 것은 정규화 계층 하나다.</p>
          <ul className="mono">
            <li>opendart_pipeline.py <span>수집·재무 구조층</span></li>
            <li>derivative_parser.py <span>각주 절 추출·표 태깅</span></li>
            <li>notes_probe.py <span>결정문 판독 파일럿</span></li>
          </ul>
        </div>
        <div className="pl-panel">
          <h3>토큰 경계</h3>
          <p>언어 판단이 필요한 곳에만 LLM을 쓴다. 정규식 사전필터가 파생 무관 기업-연도를 걸러내고, 결정문은 규칙 우선 — LLM은 모호 건의 배치 1회 처리다. 산출물은 정적 패널이라 사이트 로드당 토큰과 API 호출은 0.</p>
          <ul className="mono">
            <li>배치 1회 <span>문서당, 적재 시</span></li>
            <li>일일 감시 <span>목록 API 폴링 — LLM 0</span></li>
            <li>사이트 <span>panel.json 읽기 전용</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
