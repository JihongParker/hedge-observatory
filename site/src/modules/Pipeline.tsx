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
    </section>
  )
}
