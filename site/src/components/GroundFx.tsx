import { img, ready, drawSway, wind, useFxCanvas } from './sceneFx'
import pts from '../data/scene_points.json'

// Ground-level motion: the harbour city's windows flicker and shimmer on the
// water below it, a low fog drifts across the hill, dune grass bends in the
// night wind and a few fireflies wander above it. Geometry mirrors the CSS
// placement of the DOM plates (city strip, grass anchor line).
type Fly = { x: number; y: number; ph: number; sp: number }
const flies: Fly[] = Array.from({ length: 9 }, (_, i) => ({ x: 0.05 + Math.random() * 0.9, y: 0.86 + Math.random() * 0.1, ph: i * 0.7, sp: 0.6 + Math.random() * 0.6 }))
const GRASS = [
  { x: -0.03, w: 0.17, dy: 0.05, ph: 0.2, flip: false },
  { x: 0.08, w: 0.12, dy: 0.06, ph: 2.3, flip: true },
  { x: 0.86, w: 0.16, dy: 0.05, ph: 4.0, flip: false },
  { x: 0.77, w: 0.11, dy: 0.06, ph: 5.4, flip: true },
]

export default function GroundFx() {
  const ref = useFxCanvas((ctx, W, H, t, dpr) => {
    const mobile = W < 760
    // ── city windows: the strip sits at (left 22%, width 60%, bottom of strip at 70% of H)
    const city = img('city')
    if (ready(city)) {
      const cw = mobile ? W * 1.1 : W * 0.6
      const cx = mobile ? -W * 0.05 : W * 0.22
      const ch = (cw * city.naturalHeight) / city.naturalWidth
      const cy = H * 0.7 - ch
      for (let i = 0; i < pts.city_lights.length; i++) {
        const [fx, fy] = pts.city_lights[i]
        const f = 0.5 + 0.5 * Math.sin(t * (1.1 + (i % 7) * 0.37) + i)
        if (f < 0.35) continue
        ctx.fillStyle = `rgba(255,214,150,${0.25 * f})`
        ctx.beginPath()
        ctx.arc(cx + fx * cw, cy + fy * ch, 1.2 + f, 0, 6.283)
        ctx.fill()
      }
      // shimmer on the water below the city: short warm streaks that flicker
      const wy = H * 0.7
      for (let i = 0; i < 70; i++) {
        const [fx] = pts.city_lights[i % pts.city_lights.length]
        const x = cx + fx * cw + Math.sin(t * 1.7 + i) * 3
        const y = wy + 2 + (i % 9) * 3.2 + Math.sin(t * 0.9 + i * 0.5) * 1.5
        const a = 0.12 + 0.12 * Math.sin(t * 2.4 + i * 1.3)
        if (a < 0.14) continue
        ctx.strokeStyle = `rgba(255,205,140,${a})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - 4 - (i % 3) * 2, y)
        ctx.lineTo(x + 4 + (i % 3) * 2, y)
        ctx.stroke()
      }
    }
    // ── low fog drifting over the hill
    for (let i = 0; i < 3; i++) {
      const fy = H * (0.79 + 0.03 * i)
      const fx = ((t * (9 + 4 * i) + i * 500) % (W * 1.6)) - W * 0.3
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, W * 0.28)
      g.addColorStop(0, `rgba(170,185,220,${0.08 + 0.03 * Math.sin(t * 0.3 + i)})`)
      g.addColorStop(1, 'rgba(170,185,220,0)')
      ctx.fillStyle = g
      ctx.fillRect(fx - W * 0.3, fy - 40, W * 0.6, 80)
    }
    // ── grass in the night wind (anchored just below the hill line at 94% of H)
    const gr = img('grass_night')
    if (ready(gr)) {
      const list = mobile ? [GRASS[0], GRASS[2]].map((g) => ({ ...g, w: g.w * 2 })) : GRASS
      for (const c of list) {
        const w = W * c.w
        const h = (w * gr.naturalHeight) / gr.naturalWidth
        drawSway(ctx, dpr, gr, W * c.x, H * (0.94 + c.dy) - h, w, h, (u) => wind(u, t * 0.8, c.ph, 0.075), 36, c.flip)
      }
    }
    // ── fireflies
    for (const f of flies) {
      const x = W * (f.x + 0.02 * Math.sin(t * 0.4 * f.sp + f.ph) + 0.01 * Math.sin(t * 1.3 + f.ph * 2))
      const y = H * (f.y + 0.015 * Math.sin(t * 0.7 * f.sp + f.ph * 1.7))
      const a = Math.max(0, Math.sin(t * 1.5 * f.sp + f.ph)) ** 3
      if (a < 0.05) continue
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6)
      g.addColorStop(0, `rgba(220,255,160,${0.9 * a})`)
      g.addColorStop(0.4, `rgba(200,255,140,${0.35 * a})`)
      g.addColorStop(1, 'rgba(200,255,140,0)')
      ctx.fillStyle = g
      ctx.fillRect(x - 6, y - 6, 12, 12)
    }
  })
  return <canvas ref={ref} className="sc-fx sc-fx-ground" />
}
