/**
 * Pathfinding for a very small mug.
 *
 * Bruno walks down the page and must not walk through content. Rather than a
 * general collision solver, this exploits the fact that the layout is a single
 * centred column: at any given height, the page is a row of occupied spans and
 * gaps. Find the gaps, pick the one nearest him, aim at it.
 *
 * All coordinates are document-space (page pixels), so they survive scrolling.
 */

export interface Span {
  left: number
  right: number
}

export interface Obstacle extends Span {
  top: number
  bottom: number
}

/** Elements Bruno should walk around rather than over. */
const OBSTACLE_SELECTOR = '.card, .tile, .hero, .chip, .btn, .notice, .pullquote, table'

export function collectObstacles(root: ParentNode = document): Obstacle[] {
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  return Array.from(root.querySelectorAll(OBSTACLE_SELECTOR))
    .map((el) => {
      const r = el.getBoundingClientRect()
      return {
        left: r.left + scrollX,
        right: r.right + scrollX,
        top: r.top + scrollY,
        bottom: r.bottom + scrollY,
      }
    })
    .filter((r) => r.right > r.left && r.bottom > r.top)
}

/** Merge overlapping spans into a minimal sorted set. */
export function mergeSpans(spans: Span[]): Span[] {
  if (spans.length === 0) return []

  const sorted = [...spans].sort((a, b) => a.left - b.left)
  const out: Span[] = [{ ...sorted[0] }]

  for (const s of sorted.slice(1)) {
    const last = out[out.length - 1]
    if (s.left <= last.right) {
      last.right = Math.max(last.right, s.right)
    } else {
      out.push({ ...s })
    }
  }
  return out
}

/**
 * The clear horizontal spans at a given height, within [minX, maxX].
 * `pad` inflates obstacles so he keeps a little clearance.
 */
export function freeSpansAt(
  obstacles: Obstacle[],
  y: number,
  bandHalfHeight: number,
  minX: number,
  maxX: number,
  pad = 8,
): Span[] {
  const blocking = obstacles
    .filter((o) => o.bottom + pad > y - bandHalfHeight && o.top - pad < y + bandHalfHeight)
    .map((o) => ({ left: o.left - pad, right: o.right + pad }))

  const occupied = mergeSpans(blocking)
  const free: Span[] = []
  let cursor = minX

  for (const span of occupied) {
    if (span.left > cursor) free.push({ left: cursor, right: Math.min(span.left, maxX) })
    cursor = Math.max(cursor, span.right)
    if (cursor >= maxX) break
  }
  if (cursor < maxX) free.push({ left: cursor, right: maxX })

  return free.filter((s) => s.right > s.left)
}

/**
 * Where Bruno should aim at this height.
 *
 * Prefers the nearest gap wide enough to hold him. Returns null when the whole
 * row is blocked, which tells the caller to keep his current heading rather
 * than teleport.
 */
export function targetXAt(
  obstacles: Obstacle[],
  y: number,
  currentX: number,
  halfWidth: number,
  minX: number,
  maxX: number,
): number | null {
  const spans = freeSpansAt(obstacles, y, halfWidth, minX, maxX)
  const usable = spans.filter((s) => s.right - s.left >= halfWidth * 2)

  if (usable.length === 0) return null

  // Already standing in a usable gap: stay put rather than drift to its centre,
  // so he walks in a straight line whenever he can.
  const inside = usable.find((s) => currentX >= s.left + halfWidth && currentX <= s.right - halfWidth)
  if (inside) return currentX

  // Otherwise aim at the closest edge he can legally stand at.
  let best = 0
  let bestDist = Infinity
  for (const s of usable) {
    const clamped = Math.max(s.left + halfWidth, Math.min(s.right - halfWidth, currentX))
    const dist = Math.abs(clamped - currentX)
    if (dist < bestDist) {
      bestDist = dist
      best = clamped
    }
  }
  return best
}
