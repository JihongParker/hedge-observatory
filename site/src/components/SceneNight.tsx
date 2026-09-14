import { useEffect, useRef } from 'react'
import SkyFx from './SkyFx'
import GroundFx from './GroundFx'
import { BASE } from './sceneFx'
import './SceneNight.css'

// Hero scene: a hilltop observatory on a summer night above a harbour city.
// Plates are illustrations generated once (scripts/gen_scene.py) and served
// as static files; motion is canvas-driven (stars, meteors, city lights, fog,
// grass, fireflies) plus a few CSS layers (sky pan, clouds, dome glow, moon).
// Three depth groups follow the pointer. Reduced motion: everything holds.
export default function SceneNight() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      el.style.setProperty('--mx', String((e.clientX / window.innerWidth) * 2 - 1))
      el.style.setProperty('--my', String((e.clientY / window.innerHeight) * 2 - 1))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <div className="night" ref={ref} aria-hidden>
      <img className="nt-sky" src={BASE + 'sky_night.webp'} alt="" />
      <div className="nt-plx nt-plx-1">
        <SkyFx />
        <span className="nt-moon" />
        <img className="nt-cloud nt-cloud-a" src={BASE + 'cloud_night_a.webp'} alt="" />
        <img className="nt-cloud nt-cloud-b" src={BASE + 'cloud_night_b.webp'} alt="" />
      </div>
      <div className="nt-plx nt-plx-2">
        <img className="nt-city" src={BASE + 'city.webp'} alt="" />
        <span className="nt-water" />
        <img className="nt-hill" src={BASE + 'hill.webp'} alt="" />
        <div className="nt-dome-wrap">
          <img className="nt-dome" src={BASE + 'dome.webp'} alt="" />
          <span className="nt-slit" />
          <span className="nt-window" />
        </div>
        <img className="nt-pines" src={BASE + 'pines.webp'} alt="" />
      </div>
      <div className="nt-plx nt-plx-3">
        <GroundFx />
      </div>
    </div>
  )
}
