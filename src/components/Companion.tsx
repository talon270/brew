import { useEffect, useRef, useState } from 'react'
import Mascot, { type Look } from './Mascot'

/**
 * Bruno as a cursor companion.
 *
 * He orbits the pointer while lagging behind it, so he reads as chasing the
 * cursor rather than being glued to it. Position is `fixed`, so he stays with
 * you as the page scrolls.
 *
 * Deliberately absent when he would be useless or unwelcome: no fine pointer
 * (touch), or the visitor has asked for reduced motion.
 */

/** How hard he pulls toward the target each frame. Lower = lazier chase. */
const EASE = 0.055
/** Orbit radius in px, and how fast he circles. */
const ORBIT_R = 44
const ORBIT_SPEED = 1.7
/** Vertical squash of the orbit, so it reads as a circle in perspective. */
const ORBIT_FLATTEN = 0.55
const SIZE = 62

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function hasFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches
  )
}

export default function Companion() {
  const [enabled, setEnabled] = useState(false)
  const [look, setLook] = useState<Look>({ x: 0, y: 0 })
  const [awake, setAwake] = useState(false)
  // Refs don't re-render, and the fade-in needs one.
  const [visible, setVisible] = useState(false)

  const holder = useRef<HTMLDivElement | null>(null)
  const cursor = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const seen = useRef(false)
  const idleTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setEnabled(hasFinePointer() && !prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!enabled) return

    function onMove(e: MouseEvent) {
      cursor.current = { x: e.clientX, y: e.clientY }
      if (!seen.current) {
        // Start where the cursor is rather than sliding in from the corner.
        seen.current = true
        pos.current = { x: e.clientX, y: e.clientY }
        setVisible(true)
        setAwake(true)
      }
      // He dozes off if the pointer stops moving for a while.
      window.clearTimeout(idleTimer.current)
      setAwake(true)
      idleTimer.current = window.setTimeout(() => setAwake(false), 4000)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    let frame = 0
    let lastLookUpdate = 0

    function tick(now: number) {
      const t = now / 1000
      const angle = t * ORBIT_SPEED

      // Orbit the cursor rather than sit on it — this is what makes it read
      // as a chase instead of a laggy cursor replacement.
      const targetX = cursor.current.x + Math.cos(angle) * ORBIT_R
      const targetY = cursor.current.y + Math.sin(angle) * ORBIT_R * ORBIT_FLATTEN

      const prevX = pos.current.x
      pos.current.x += (targetX - pos.current.x) * EASE
      pos.current.y += (targetY - pos.current.y) * EASE

      // Lean into the direction of travel.
      const vx = pos.current.x - prevX
      const tilt = Math.max(-15, Math.min(15, vx * 2.2))

      if (holder.current && seen.current) {
        holder.current.style.transform =
          `translate3d(${pos.current.x - SIZE / 2}px, ${pos.current.y - SIZE / 2}px, 0) rotate(${tilt}deg)`
      }

      // Eye direction changes far more slowly than position, and updating
      // React state every frame would be wasteful.
      if (now - lastLookUpdate > 90) {
        lastLookUpdate = now
        const dx = cursor.current.x - pos.current.x
        const dy = cursor.current.y - pos.current.y
        const dist = Math.hypot(dx, dy) || 1
        setLook({ x: dx / dist, y: dy / dist })
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
      window.clearTimeout(idleTimer.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={holder}
      className={`companion${visible ? ' visible' : ''}`}
      aria-hidden="true"
    >
      <Mascot mood={awake ? 'happy' : 'sleepy'} size={SIZE} steam={false} look={look} />
    </div>
  )
}
