import { useEffect, useRef, useState } from 'react'
import Mascot, { MASCOT_ASPECT } from './Mascot'
import { collectObstacles, targetXAt, type Obstacle } from '../lib/walkway'

/**
 * Bruno, walking down the page.
 *
 * He descends at a steady pace and steers around anything he would otherwise
 * walk through — cards, tiles, buttons, the hero. The routing lives in
 * lib/walkway.ts; this component owns the animation loop and his pose.
 *
 * He is positioned in document space, so he scrolls with the content. When he
 * walks off the bottom of what you are looking at he loops back above it, so
 * he is always somewhere on the page you are actually reading.
 *
 * He is hidden when there is no room to walk — below roughly 900px the content
 * column fills the width and there are no gutters to stroll down — and whenever
 * reduced motion is requested. Note the gate is viewport width, not pointer
 * type: that mattered when he chased the cursor, but a walking mascot has
 * nothing to do with a mouse.
 */

const WIDTH = 46
const HEIGHT = WIDTH * MASCOT_ASPECT
/** Downward pace, px per second. A stroll, not a commute. */
const SPEED = 26
/** How quickly he corrects sideways toward a clear gap. */
const STEER = 0.05
const EDGE_MARGIN = 6
/** Below this the layout has no gutters for him to walk in. */
const MIN_VIEWPORT = 900

function media(query: string): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches
  )
}

export default function Companion() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [facing, setFacing] = useState<'left' | 'right'>('right')

  const holder = useRef<HTMLDivElement | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const obstacles = useRef<Obstacle[]>([])
  const facingRef = useRef<'left' | 'right'>('right')

  useEffect(() => {
    const check = () =>
      setEnabled(
        window.innerWidth >= MIN_VIEWPORT && !media('(prefers-reduced-motion: reduce)'),
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Obstacles are re-read on layout changes rather than every frame —
    // getBoundingClientRect on every card at 60fps would force constant reflow.
    const refresh = () => {
      obstacles.current = collectObstacles()
    }
    refresh()

    const observer = new MutationObserver(refresh)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', refresh)

    const rescan = window.setInterval(refresh, 1500)

    // Start just above the fold, off to one side.
    pos.current = {
      x: Math.max(EDGE_MARGIN + WIDTH, window.innerWidth * 0.12),
      y: window.scrollY + window.innerHeight * 0.25,
    }
    setVisible(true)

    let frame = 0
    let last = performance.now()

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      pos.current.y += SPEED * dt

      // Loop him back above the viewport once he walks off the bottom, so he
      // stays on the part of the page you are actually looking at.
      const viewTop = window.scrollY
      const viewBottom = viewTop + window.innerHeight
      if (pos.current.y - HEIGHT > viewBottom) pos.current.y = viewTop - HEIGHT
      if (pos.current.y + HEIGHT < viewTop) pos.current.y = viewTop - HEIGHT

      const minX = EDGE_MARGIN + WIDTH / 2
      const maxX = document.documentElement.clientWidth - EDGE_MARGIN - WIDTH / 2

      const target = targetXAt(
        obstacles.current,
        pos.current.y + HEIGHT / 2,
        pos.current.x,
        WIDTH / 2,
        minX,
        maxX,
      )

      const prevX = pos.current.x
      if (target !== null) {
        pos.current.x += (target - pos.current.x) * STEER
      }
      pos.current.x = Math.max(minX, Math.min(maxX, pos.current.x))

      // Only touch state when the direction actually flips — this runs 60
      // times a second and setFacing on every frame would be needless work.
      const dx = pos.current.x - prevX
      if (Math.abs(dx) > 0.08) {
        const next = dx > 0 ? 'right' : 'left'
        if (next !== facingRef.current) {
          facingRef.current = next
          setFacing(next)
        }
      }

      if (holder.current) {
        holder.current.style.transform = `translate3d(${pos.current.x - WIDTH / 2}px, ${pos.current.y}px, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', refresh)
      window.clearInterval(rescan)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={holder} className={`companion${visible ? ' visible' : ''}`} aria-hidden="true">
      <Mascot
        mood="happy"
        size={WIDTH}
        steam={false}
        walk
        facing={facing}
      />
    </div>
  )
}
