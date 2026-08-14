import { useEffect, useRef, useState } from 'react'
import Mascot, { MASCOT_ASPECT } from './Mascot'
import { collectObstacles, targetXAt, type Obstacle } from '../lib/walkway'

/**
 * Bruno, walking over to wherever you are.
 *
 * He has a destination rather than a direction: the part of the page you are
 * working in. He sets off at a walking pace, steers around anything he would
 * otherwise walk through, arrives, and then stands still until you move
 * somewhere else. He does not orbit you and he does not trudge down the page
 * on a loop — both of which he used to do.
 *
 * "Where you are" is the pointer while you are using it, and the middle of the
 * viewport when you are not, so he also follows you if you are only scrolling.
 * Both are read in viewport coordinates and converted to document coordinates
 * each frame, which is what makes scrolling move his destination with you.
 *
 * The routing lives in lib/walkway.ts. He is positioned in document space, so
 * he stays where he stopped on the page rather than sliding around the screen.
 *
 * Hidden when there is no room to walk — below roughly 900px the content
 * column fills the width and there are no gutters — and whenever reduced
 * motion is requested.
 */

const WIDTH = 46
const HEIGHT = WIDTH * MASCOT_ASPECT

/** Walking pace in px/s. Brisk enough not to feel stuck, slow enough to read. */
const SPEED = 100
/** Close enough to count as arrived. */
const ARRIVE = 10
/** He must be dragged this far off before setting out again — stops jitter. */
const RESTART = 34
/** After this long without pointer movement, he heads for your reading position. */
const POINTER_IDLE_MS = 8000

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
  const [moving, setMoving] = useState(false)

  const holder = useRef<HTMLDivElement | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const obstacles = useRef<Obstacle[]>([])
  const facingRef = useRef<'left' | 'right'>('right')
  const movingRef = useRef(false)
  /**
   * Pointer in viewport coordinates, so scrolling moves the destination.
   * `at` starts at -Infinity, not 0: a zero timestamp reads as a *fresh*
   * pointer at (0,0), which sent him marching into the top-left corner on
   * load instead of toward the reading position.
   */
  const pointer = useRef({ x: 0, y: 0, at: Number.NEGATIVE_INFINITY })

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

    const observer = new MutationObserver((records) => {
      // Ignore his own re-renders, or he would keep waking himself up.
      const outside = records.some((r) => !holder.current?.contains(r.target))
      if (outside) refresh()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', refresh)
    const rescan = window.setInterval(refresh, 1500)

    const onMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, at: performance.now() }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Start off to one side, near the top of what you are looking at.
    pos.current = {
      x: Math.max(EDGE_MARGIN + WIDTH, window.innerWidth * 0.1),
      y: window.scrollY + window.innerHeight * 0.2,
    }
    setVisible(true)

    let frame = 0
    let last = performance.now()

    function tick() {
      // Read the clock rather than trust the rAF timestamp: the two need not
      // share an origin, and mixing them made the opening frame compute a large
      // negative delta, so he lurched backwards before setting off. This also
      // keeps one clock for both movement and pointer freshness. Clamped at
      // both ends so a stalled or rewound clock cannot teleport him.
      const now = performance.now()
      const dt = Math.max(0, Math.min((now - last) / 1000, 0.05))
      last = now

      // clientWidth/scrollHeight can be 0 before layout; falling back keeps the
      // bounds from inverting and pinning him to a corner.
      const viewportW = document.documentElement.clientWidth || window.innerWidth
      const minX = EDGE_MARGIN + WIDTH / 2
      const maxX = Math.max(minX, viewportW - EDGE_MARGIN - WIDTH / 2)
      const docH = Math.max(document.documentElement.scrollHeight, window.innerHeight)

      // --- where you are, in document coordinates ---
      const pointerFresh = now - pointer.current.at < POINTER_IDLE_MS
      const clientX = pointerFresh ? pointer.current.x : window.innerWidth / 2
      const clientY = pointerFresh ? pointer.current.y : window.innerHeight / 2

      const destY = clamp(clientY + window.scrollY - HEIGHT / 2, 0, Math.max(0, docH - HEIGHT))

      // The closest spot to you he can actually stand, at his current height.
      // Obstacles are in document space, so the pointer has to be too.
      const legalX = targetXAt(
        obstacles.current,
        pos.current.y + HEIGHT / 2,
        clientX + window.scrollX,
        WIDTH / 2,
        minX,
        maxX,
      )
      const destX = clamp(legalX ?? pos.current.x, minX, maxX)

      // --- set off, or stay put ---
      const dx = destX - pos.current.x
      const dy = destY - pos.current.y
      const dist = Math.hypot(dx, dy)

      if (movingRef.current ? dist <= ARRIVE : dist > RESTART) {
        movingRef.current = dist > RESTART
        setMoving(movingRef.current)
      }

      if (movingRef.current && dist > 0.01) {
        const step = Math.min(SPEED * dt, dist)
        pos.current.x += (dx / dist) * step
        pos.current.y += (dy / dist) * step
      }

      // Face the way he is going, or toward you once he has stopped.
      const heading = movingRef.current ? dx : destX - pos.current.x
      if (Math.abs(heading) > 1) {
        const next = heading > 0 ? 'right' : 'left'
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
      window.removeEventListener('mousemove', onMove)
      window.clearInterval(rescan)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={holder} className={`companion${visible ? ' visible' : ''}`} aria-hidden="true">
      {/* Steam only once he has stopped — a mug in motion does not sit and steam. */}
      <Mascot mood="happy" size={WIDTH} steam={!moving} walk={moving} facing={facing} />
    </div>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
