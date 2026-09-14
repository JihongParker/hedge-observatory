import { useRef } from 'react'
import { useFxCanvas } from './sceneFx'

// The night sky: 2,391 stars, one per listed company, wheeling very slowly
// around a pole in the upper left the way a long exposure would show them.
// Each star twinkles on its own phase; the 14 pilot firms already read are
// larger and warmer. Meteors cross now and then. Reduced motion: one frame.
const N = 2391
const PILOT = 14
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number }

export default function SkyFx() {
  const stars = useRef(
    (() => {
      let s = 20260907
      const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
      return Array.from({ length: N }, (_, i) => {
        // polar coordinates about the pole so rotation is a pure angle shift
        const r = 0.08 + Math.pow(rnd(), 0.6) * 1.35
        const a = rnd() * Math.PI * 2
        return { r, a, sz: 0.5 + rnd() * 1.1, ph: rnd() * 6.28, tw: 0.6 + rnd() * 2.2, pilot: i % Math.floor(N / PILOT) === 3 }
      })
    })(),
  )
  const meteors = useRef<Meteor[]>([])

  const ref = useFxCanvas((ctx, W, H, t) => {
    const px = W * 0.18
    const py = H * 0.12
    const rot = t * 0.0035 // radians per second: a full turn in about 30 min
    const R = Math.max(W, H)
    const horizon = H * 0.86 // stars fade out toward the hill line
    for (const s of stars.current) {
      const a = s.a + rot
      const x = px + Math.cos(a) * s.r * R
      const y = py + Math.sin(a) * s.r * R
      if (x < -4 || x > W + 4 || y < -4 || y > horizon) continue
      const tw = 0.55 + 0.45 * Math.sin(t * s.tw + s.ph)
      const fade = Math.min(1, (horizon - y) / (H * 0.18))
      if (s.pilot) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7)
        g.addColorStop(0, `rgba(255,222,160,${0.95 * fade})`)
        g.addColorStop(0.35, `rgba(255,205,130,${0.5 * tw * fade})`)
        g.addColorStop(1, 'rgba(255,205,130,0)')
        ctx.fillStyle = g
        ctx.fillRect(x - 7, y - 7, 14, 14)
        ctx.fillStyle = `rgba(255,240,215,${fade})`
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, 6.283)
        ctx.fill()
      } else {
        ctx.fillStyle = `rgba(214,226,255,${(0.35 + 0.55 * tw) * fade})`
        ctx.beginPath()
        ctx.arc(x, y, s.sz * (0.8 + 0.3 * tw), 0, 6.283)
        ctx.fill()
      }
    }
    // meteors
    const M = meteors.current
    if (M.length < 2 && Math.random() < 0.004) {
      M.push({ x: W * (0.3 + Math.random() * 0.6), y: H * (0.05 + Math.random() * 0.3), vx: -(380 + Math.random() * 260), vy: 160 + Math.random() * 120, life: 0, max: 0.9 + Math.random() * 0.5 })
    }
    ctx.lineCap = 'round'
    for (let i = M.length - 1; i >= 0; i--) {
      const m = M[i]
      m.life += 1 / 60
      m.x += m.vx / 60
      m.y += m.vy / 60
      if (m.life > m.max) { M.splice(i, 1); continue }
      const k = m.life / m.max
      const a = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85
      const len = 90
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx / Math.hypot(m.vx, m.vy) * len, m.y - m.vy / Math.hypot(m.vx, m.vy) * len)
      g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = g
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(m.x - m.vx / Math.hypot(m.vx, m.vy) * len, m.y - m.vy / Math.hypot(m.vx, m.vy) * len)
      ctx.stroke()
    }
  })
  return <canvas ref={ref} className="sc-fx sc-fx-sky" />
}
