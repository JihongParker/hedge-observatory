import { useEffect, useRef, useState, type ReactNode } from 'react'
import './Carousel.css'

// 라이브 미니어처 캐러셀 — hover 정지 금지, 조작 후 8s hold, 간격 2.7s.
export default function Carousel({ slides }: { slides: { key: string; title: string; body: ReactNode }[] }) {
  const [i, setI] = useState(0)
  const hold = useRef(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (Date.now() < hold.current) return
      setI((v) => (v + 1) % slides.length)
    }, 2700)
    return () => clearInterval(id)
  }, [slides.length])
  const pick = (n: number) => { hold.current = Date.now() + 8000; setI(n) }
  return (
    <div className="car">
      <div className="car-stage">
        {slides.map((s, n) => (
          <div key={s.key} className={n === i ? 'car-slide on' : 'car-slide'} aria-hidden={n !== i}>
            {s.body}
          </div>
        ))}
      </div>
      <div className="car-tabs" role="tablist">
        {slides.map((s, n) => (
          <button key={s.key} role="tab" aria-selected={n === i}
            className={n === i ? 'car-tab on' : 'car-tab'} onClick={() => pick(n)}>{s.title}</button>
        ))}
      </div>
    </div>
  )
}
