import { useCallback, useState } from 'react'
import ScanField from './components/ScanField'
import Coverage from './modules/Coverage'
import Evidence from './modules/Evidence'
import Pipeline from './modules/Pipeline'
import Kssb from './modules/Kssb'
import './App.css'

export default function App() {
  const [swept, setSwept] = useState(0)
  const onSwept = useCallback((n: number) => setSwept((prev) => (Math.abs(n - prev) > 15 || n === 0 || n === 2391 ? n : prev)), [])
  return (
    <div className="shell">
      <header className="hero">
        <ScanField onSwept={onSwept} />
        <div className="hero-copy">
          <div className="hero-eyebrow mono">KOREAN CORPORATE HEDGING OBSERVATORY</div>
          <h1>헤지 관측소</h1>
          <p className="hero-scope">
            상장사 2,391곳의 파생상품 각주를 판별·파싱·정규화해 만드는 공개 기업 헤지 패널.
            뒤의 점 하나가 기업 하나이고, 빔이 지나가는 것이 배치 파싱이다 —
            실제 파이프라인도 이렇게 한 번 훑고, 사이트는 그 산출물만 읽는다.
          </p>
          <div className="hero-meters mono" aria-live="off">
            <span><b>{swept.toLocaleString()}</b> / 2,391 스캔</span>
            <span><b>14</b> 파일럿 완료</span>
            <span><b>380 × 9</b> 기존 패널</span>
          </div>
          <div className="hero-links">
            <a href="https://github.com/JihongParker/hedge-observatory">github</a>
            <a href="https://github.com/JihongParker/wti-fx-hedge-program">모태 연구 (P1–P4)</a>
          </div>
        </div>
      </header>
      <Evidence />
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
