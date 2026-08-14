import { describe, expect, it } from 'vitest'
import { freeSpansAt, mergeSpans, targetXAt, type Obstacle } from './walkway'

function box(left: number, right: number, top = 0, bottom = 100): Obstacle {
  return { left, right, top, bottom }
}

describe('mergeSpans', () => {
  it('merges overlapping spans', () => {
    expect(mergeSpans([{ left: 0, right: 50 }, { left: 40, right: 90 }])).toEqual([
      { left: 0, right: 90 },
    ])
  })

  it('merges spans that merely touch', () => {
    expect(mergeSpans([{ left: 0, right: 50 }, { left: 50, right: 80 }])).toEqual([
      { left: 0, right: 80 },
    ])
  })

  it('keeps disjoint spans apart and sorted', () => {
    expect(mergeSpans([{ left: 60, right: 90 }, { left: 0, right: 20 }])).toEqual([
      { left: 0, right: 20 },
      { left: 60, right: 90 },
    ])
  })

  it('handles an empty list', () => {
    expect(mergeSpans([])).toEqual([])
  })
})

describe('freeSpansAt', () => {
  it('reports the whole width when nothing is in the way', () => {
    expect(freeSpansAt([], 50, 10, 0, 1000)).toEqual([{ left: 0, right: 1000 }])
  })

  it('finds the gutters either side of a centred column', () => {
    const spans = freeSpansAt([box(300, 700)], 50, 10, 0, 1000, 0)
    expect(spans).toEqual([
      { left: 0, right: 300 },
      { left: 700, right: 1000 },
    ])
  })

  it('ignores obstacles at other heights', () => {
    const spans = freeSpansAt([box(300, 700, 500, 600)], 50, 10, 0, 1000, 0)
    expect(spans).toEqual([{ left: 0, right: 1000 }])
  })

  it('leaves clearance around obstacles', () => {
    const spans = freeSpansAt([box(300, 700)], 50, 10, 0, 1000, 20)
    expect(spans[0].right).toBe(280)
    expect(spans[1].left).toBe(720)
  })

  it('returns nothing when the full width is blocked', () => {
    expect(freeSpansAt([box(-10, 1010)], 50, 10, 0, 1000, 0)).toEqual([])
  })
})

describe('targetXAt', () => {
  const halfWidth = 25

  it('walks straight on when already in open space', () => {
    expect(targetXAt([], 50, 400, halfWidth, 0, 1000)).toBe(400)
  })

  it('holds its line inside a gutter rather than drifting to the centre', () => {
    // Standing at x=150 in a 0..300 gutter: no reason to move.
    expect(targetXAt([box(300, 700)], 50, 150, halfWidth, 0, 1000)).toBe(150)
  })

  it('steers out of an obstacle it is standing in', () => {
    const target = targetXAt([box(300, 700)], 50, 500, halfWidth, 0, 1000)
    expect(target).not.toBeNull()
    // Must end up clear of the obstacle plus its padding, on one side or other.
    expect(target! <= 300 - 8 - halfWidth || target! >= 700 + 8 + halfWidth).toBe(true)
  })

  it('picks the nearer side when caught inside an obstacle', () => {
    // At x=350 the left edge is much closer than the right.
    const target = targetXAt([box(300, 900)], 50, 350, halfWidth, 0, 1000)!
    expect(target).toBeLessThan(350)
  })

  it('ignores gaps too narrow to stand in', () => {
    // A 20px gap between two blocks cannot fit a 50px-wide mug.
    const obstacles = [box(0, 400), box(420, 1000)]
    expect(targetXAt(obstacles, 50, 410, halfWidth, 0, 1000)).toBeNull()
  })

  it('returns null when the row is completely blocked, so the caller holds course', () => {
    expect(targetXAt([box(-50, 1050)], 50, 400, halfWidth, 0, 1000)).toBeNull()
  })
})

/**
 * The behaviour that actually matters: re-clamping every frame is what keeps
 * him out of the content. Aiming at a clear destination says nothing about the
 * path taken to reach it, and a diagonal walk cuts straight through whatever
 * lies between.
 */
describe('containment while walking', () => {
  const halfWidth = 25
  const band = 13
  const minX = 0
  const maxX = 1000

  // A centred column of two cards with a 50px gap between them.
  const column: Obstacle[] = [box(300, 700, 0, 400), box(300, 700, 450, 800)]

  const insideACard = (x: number, y: number) =>
    column.some(
      (o) =>
        x + halfWidth > o.left &&
        x - halfWidth < o.right &&
        y + band > o.top &&
        y - band < o.bottom,
    )

  /** Walk from a start point toward a destination, clamping each step. */
  function walk(from: { x: number; y: number }, to: { x: number; y: number }) {
    const pos = { ...from }
    const seen: Array<{ x: number; y: number }> = []

    for (let i = 0; i < 600; i++) {
      const dx = to.x - pos.x
      const dy = to.y - pos.y
      const dist = Math.hypot(dx, dy)
      if (dist > 0.01) {
        const step = Math.min(4, dist)
        pos.x += (dx / dist) * step
        pos.y += (dy / dist) * step
      }
      const safe = targetXAt(column, pos.y, pos.x, halfWidth, minX, maxX, band)
      if (safe !== null) pos.x = safe
      seen.push({ ...pos })
    }
    return seen
  }

  it('never walks through a card on a diagonal crossing', () => {
    const path = walk({ x: 100, y: 50 }, { x: 900, y: 700 })
    const trespass = path.filter((p) => insideACard(p.x, p.y))
    expect(trespass).toEqual([])
  })

  it('crosses when the route is actually clear', () => {
    // Straight across through the gap between the two cards: containment must
    // not block a legitimate crossing.
    const path = walk({ x: 100, y: 425 }, { x: 900, y: 425 })
    expect(path[path.length - 1].x).toBeGreaterThan(700)
    expect(path.every((p) => !insideACard(p.x, p.y))).toBe(true)
  })

  it('stays on its own side rather than barging through to reach you', () => {
    // Aiming diagonally across a tall column: the gap is too short to get all
    // the way through while still descending, so he keeps to the near gutter.
    // Standing on the wrong side is the right trade against walking over content.
    const path = walk({ x: 100, y: 50 }, { x: 900, y: 700 })
    expect(path.every((p) => !insideACard(p.x, p.y))).toBe(true)
    expect(path[path.length - 1].y).toBeGreaterThan(600)
  })

  it('slides along an edge instead of stopping dead when blocked', () => {
    // Aiming straight at a card from the left: he should still make vertical
    // progress while being held out horizontally.
    const path = walk({ x: 100, y: 100 }, { x: 500, y: 380 })
    expect(path[path.length - 1].y).toBeGreaterThan(300)
    expect(path.every((p) => !insideACard(p.x, p.y))).toBe(true)
  })
})
