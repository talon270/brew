import { describe, expect, it } from 'vitest'
import { daysSince, readFreshness, suggestMethods, type Bag } from './shelf'

const NOW = Date.parse('2026-08-15T12:00:00')

function bagRoastedDaysAgo(days: number): Bag {
  const d = new Date(NOW - days * 86_400_000)
  const iso = d.toISOString().slice(0, 10)
  return { id: 'x', name: 'Test', roaster: 'Test', roastedOn: iso, roastLevel: 50 }
}

describe('daysSince', () => {
  it('counts whole days', () => {
    expect(daysSince(new Date(NOW - 5 * 86_400_000).toISOString().slice(0, 10), NOW)).toBe(5)
  })

  it('returns 0 rather than NaN for a malformed date', () => {
    expect(daysSince('not-a-date', NOW)).toBe(0)
  })
})

describe('readFreshness', () => {
  it('calls very fresh coffee unready rather than good', () => {
    // The counterintuitive one: day-old coffee brews badly.
    const r = readFreshness(bagRoastedDaysAgo(1), NOW)
    expect(r.stage).toBe('too-fresh')
    expect(r.detail).toMatch(/carbon dioxide/i)
  })

  it('puts the peak in the first two weeks', () => {
    expect(readFreshness(bagRoastedDaysAgo(6), NOW).stage).toBe('peak')
    expect(readFreshness(bagRoastedDaysAgo(12), NOW).stage).toBe('peak')
  })

  it('walks through good, fading and stale', () => {
    expect(readFreshness(bagRoastedDaysAgo(20), NOW).stage).toBe('good')
    expect(readFreshness(bagRoastedDaysAgo(40), NOW).stage).toBe('fading')
    expect(readFreshness(bagRoastedDaysAgo(90), NOW).stage).toBe('stale')
  })

  it('shifts every window later for espresso', () => {
    // Pressure makes trapped gas far more disruptive, so espresso rests longer.
    const day7 = bagRoastedDaysAgo(7)
    expect(readFreshness(day7, NOW, false).stage).toBe('peak')
    expect(readFreshness(day7, NOW, true).stage).toBe('too-fresh')

    const day16 = bagRoastedDaysAgo(16)
    expect(readFreshness(day16, NOW, false).stage).toBe('good')
    expect(readFreshness(day16, NOW, true).stage).toBe('peak')
  })

  it('is honest that stale coffee cannot be rescued by technique', () => {
    expect(readFreshness(bagRoastedDaysAgo(120), NOW).detail).toMatch(/no grind adjustment/i)
  })

  it('reports the age it used', () => {
    expect(readFreshness(bagRoastedDaysAgo(9), NOW).daysOld).toBe(9)
  })
})

describe('suggestMethods', () => {
  it('sends light roasts to filter, not espresso', () => {
    const light = suggestMethods(20)
    expect(light).toContain('Pourover / V60')
    expect(light).not.toContain('Espresso')
  })

  it('sends dark roasts to espresso and moka', () => {
    expect(suggestMethods(90)).toContain('Espresso')
  })

  it('always suggests something', () => {
    for (const level of [0, 25, 50, 75, 100]) {
      expect(suggestMethods(level).length).toBeGreaterThan(0)
    }
  })
})
