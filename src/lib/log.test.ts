import { describe, expect, it } from 'vitest'
import { computeStats, nextStepAdvice, type BrewEntry } from './log'

const NOW = Date.parse('2026-08-14T12:00:00Z')

function entry(overrides: Partial<BrewEntry> = {}): BrewEntry {
  return {
    id: Math.random().toString(36),
    at: new Date(NOW).toISOString(),
    method: 'pourover',
    doseG: 15,
    waterMl: 250,
    rating: 3,
    ...overrides,
  }
}

describe('nextStepAdvice', () => {
  it('sends sour brews finer and bitter brews coarser', () => {
    expect(nextStepAdvice('sour')).toMatch(/finer/)
    expect(nextStepAdvice('bitter')).toMatch(/coarser/)
  })

  it('tells a balanced brew to change nothing', () => {
    expect(nextStepAdvice('balanced')).toMatch(/change nothing/i)
  })

  it('says nothing when taste was not recorded', () => {
    expect(nextStepAdvice(undefined)).toBeNull()
  })

  it('only ever suggests one change', () => {
    // Changing several variables at once is how people learn nothing from a
    // brew, so the advice must stay singular.
    for (const taste of ['sour', 'bitter'] as const) {
      const advice = nextStepAdvice(taste)!
      expect(advice.toLowerCase()).toContain('nothing else')
    }
  })
})

describe('computeStats', () => {
  it('handles an empty log', () => {
    const s = computeStats([], NOW)
    expect(s.total).toBe(0)
    expect(s.averageRating).toBeNull()
    expect(s.favouriteMethod).toBeNull()
    expect(s.trend).toBeNull()
  })

  it('counts only the last 7 days in the weekly figure', () => {
    const entries = [
      entry(),
      entry({ at: new Date(NOW - 3 * 86_400_000).toISOString() }),
      entry({ at: new Date(NOW - 30 * 86_400_000).toISOString() }),
    ]
    const s = computeStats(entries, NOW)
    expect(s.total).toBe(3)
    expect(s.last7Days).toBe(2)
  })

  it('averages ratings', () => {
    const s = computeStats([entry({ rating: 5 }), entry({ rating: 2 })], NOW)
    expect(s.averageRating).toBe(3.5)
  })

  it('picks the most-brewed method', () => {
    const s = computeStats(
      [
        entry({ method: 'espresso' }),
        entry({ method: 'espresso' }),
        entry({ method: 'pourover' }),
      ],
      NOW,
    )
    expect(s.favouriteMethod).toBe('espresso')
  })

  it('reports an improving trend when recent brews score higher', () => {
    // Newest first, so the first five are the recent ones.
    const entries = [
      ...Array.from({ length: 5 }, () => entry({ rating: 5 })),
      ...Array.from({ length: 5 }, () => entry({ rating: 2 })),
    ]
    const s = computeStats(entries, NOW)
    expect(s.trend).toBe(3)
  })

  it('withholds a trend until there is enough history', () => {
    const entries = Array.from({ length: 5 }, () => entry())
    expect(computeStats(entries, NOW).trend).toBeNull()
  })
})
