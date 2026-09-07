import { useEffect, useRef, useState } from 'react'

// 뷰포트 진입 시 0 -> target 카운트업. reduced-motion이면 즉시 target.
export function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) { setV(target); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return }
    let raf = 0
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / ms)
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, ms])
  return { ref, v }
}
