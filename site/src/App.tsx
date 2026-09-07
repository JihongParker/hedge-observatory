import Coverage from './modules/Coverage'
import Pipeline from './modules/Pipeline'
import Kssb from './modules/Kssb'
import './App.css'

export default function App() {
  return (
    <div className="shell">
      <header className="hdr">
        <div>
          <div className="hdr-eyebrow mono">KOREAN CORPORATE HEDGING OBSERVATORY</div>
          <h1>헤지 관측소</h1>
          <p className="hdr-scope">
            상장사 파생상품 각주를 판별·파싱·정규화해 만드는 공개 기업 헤지 패널.
            파이프라인은 배치 1회 실행이고, 이 사이트는 정적 산출물만 읽는다.
          </p>
        </div>
        <span className="hdr-build mono">prototype v0</span>
      </header>
      <Coverage />
      <Pipeline />
      <Kssb />
      <footer className="ftr">
        표시된 값은 전부 OpenDART 라이브 파일럿(14사)과 380사 패널에서 나온 실측이다.
        예시 목업 값은 이 화면에 넣지 않는다.
      </footer>
    </div>
  )
}
