import './Pipeline.css'

const STAGES = [
  { no: 1, name: '모은다', desc: '금융감독원 전자공시에서 상장사 사업보고서를 내려받습니다. 오래된 문서의 옛 인코딩까지 처리합니다.', status: '완성' },
  { no: 2, name: '읽는다', desc: '"위험회피 회계를 적용한다 / 하지 않는다"는 결정 문장을 찾아 판정하고, 숫자표의 생김새를 분류합니다.', status: '시범 검증' },
  { no: 3, name: '맞춘다', desc: '회사마다 다른 표 모양과 단위를 하나로 통일합니다. 200건은 사람이 직접 대조해 오류율을 밝힙니다.', status: '예정' },
  { no: 4, name: '공개한다', desc: '회사×연도×계약 종류×금액으로 정리된 표와 이 사이트를 공개합니다.', status: '예정' },
]

export default function Pipeline() {
  return (
    <section className="pl">
      <div className="src-row">
        <span className="src-chip">주기 <b>1년에 한 번 + 새 공시 감시</b></span>
        <span className="src-chip">사람 손 <b>검수 200건뿐</b></span>
        <span className="src-chip">결과물 <b>하나의 표</b></span>
      </div>
      <h2>만드는 과정</h2>
      <div className="pl-grid">
        {STAGES.map((s) => (
          <div key={s.no} className="pl-stage">
            <span className="sec-label">{`걸음 ${s.no}`}</span>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className={s.status === '예정' ? 'pl-chip' : 'pl-chip done'}>{s.status}</span>
          </div>
        ))}
      </div>
      <div className="pl-band">
        <div className="pl-panel">
          <h3>이미 있는 재료</h3>
          <p>앞의 두 걸음은 380개사 기록을 만들 때 검증을 마친 코드로 돌아갑니다. 새로 짓는 것은 표를 맞추는 세 번째 걸음 하나입니다.</p>
          <ul>
            <li><span className="mono">opendart_pipeline.py</span><span>보고서 수집</span></li>
            <li><span className="mono">derivative_parser.py</span><span>주석 찾기·표 분류</span></li>
            <li><span className="mono">notes_probe.py</span><span>결정 문장 판정 시범</span></li>
          </ul>
        </div>
        <div className="pl-panel">
          <h3>AI는 언제 쓰나</h3>
          <p>문장을 읽고 판단하는 일에만 씁니다. 문서마다 한 번, 표를 만들 때뿐입니다.
            이 사이트를 열어 보는 데에는 AI도 서버 계산도 들지 않습니다.</p>
          <ul>
            <li><span className="mono">표 만들 때</span><span>문서당 한 번</span></li>
            <li><span className="mono">새 공시 감시</span><span>목록만 확인 — AI 없음</span></li>
            <li><span className="mono">사이트 열람</span><span>완성된 표를 읽기만 합니다</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
