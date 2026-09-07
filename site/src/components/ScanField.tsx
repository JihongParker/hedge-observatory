import { useEffect, useRef } from 'react'
import './ScanField.css'

// 히어로 씬: 상장 모집단 2,391사를 점 필드로 깔고, 스캔빔이 좌->우로 훑으며
// 각주를 "파싱"한다. 빔이 지나간 점은 잠깐 밝아졌다 잔광으로 가라앉고,
// 파일럿 14사는 계속 밝게 남는다. reduced-motion이면 정지 화면.
const N = 2391
const PILOT = 14

export default function ScanField({ onSwept }: { onSwept?: (n: number) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0
    // 결정적 의사난수 배치 — 리로드마다 같은 하늘
    let s = 20260907
    const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
    const pts = Array.from({ length: N }, (_, i) => ({
      x: rnd(), y: rnd(), r: 0.6 + rnd() * 1.1, pilot: i % Math.floor(N / PILOT) === 3,
    }))
    const css = () => getComputedStyle(document.body)
    let accent = '#104281', muted = '#9a9aa2'
    const readTheme = () => { const c = css(); accent = c.getPropertyValue('--accent').trim() || accent; muted = c.getPropertyValue('--muted').trim() || muted }
    readTheme()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener?.('change', readTheme)

    const size = () => {
      W = cv.clientWidth; H = cv.clientHeight
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const PERIOD = 11000
    let raf = 0
    const draw = (t: number) => {
      const beam = reduced ? 0.72 : ((t % PERIOD) / PERIOD) // 0..1 스캔 위치
      ctx.clearRect(0, 0, W, H)
      let swept = 0
      for (const p of pts) {
        const x = p.x * W, y = p.y * H
        const d = beam - p.x
        let a = 0.16, r = p.r, col = muted
        if (p.pilot && d > 0) { a = 0.95; r = p.r + 1.2; col = accent }
        else if (d > 0 && d < 0.06) { a = 0.85 - (d / 0.06) * 0.55; r = p.r + 0.8; col = accent }
        else if (d >= 0.06) { a = 0.34; col = accent }
        if (d > 0) swept++
        ctx.globalAlpha = a
        ctx.fillStyle = col
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      }
      // 빔 자체 — 가는 수직선 + 앞쪽 그라디언트
      if (!reduced) {
        const bx = beam * W
        const g = ctx.createLinearGradient(bx - 60, 0, bx, 0)
        g.addColorStop(0, 'rgba(0,0,0,0)')
        const m = accent.startsWith('#') ? accent : '#104281'
        g.addColorStop(1, m + '33')
        ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(bx - 60, 0, 60, H)
        ctx.fillStyle = m; ctx.globalAlpha = 0.8; ctx.fillRect(bx, 0, 1.5, H)
      }
      ctx.globalAlpha = 1
      onSwept?.(Math.round((swept / N) * N))
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mq.removeEventListener?.('change', readTheme) }
  }, [onSwept])

  return <canvas ref={ref} className="scan-field" aria-hidden="true" />
}
