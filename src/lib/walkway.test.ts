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
