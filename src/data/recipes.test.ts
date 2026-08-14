import { describe, expect, it } from 'vitest'
import { RECIPES, formatClock } from './recipes'
import { BREW_METHODS } from '../lib/types'

describe('recipes', () => {
  it('covers every brew method', () => {
    for (const m of BREW_METHODS) {
      expect(RECIPES[m]).toBeDefined()
      expect(RECIPES[m].method).toBe(m)
    }
  })

  it('builds steps in chronological order', () => {
    for (const m of BREW_METHODS) {
      const r = RECIPES[m]
      const times = r.buildSteps(r.defaultDoseG, r.defaultDoseG * r.ratio).map((s) => s.at)
      expect([...times].sort((a, b) => a - b)).toEqual(times)
    }
  })

  it('scales water with the dose', () => {
    const r = RECIPES.pourover
    expect(Math.round(15 * r.ratio)).toBe(250)
    expect(Math.round(30 * r.ratio)).toBe(500)
  })

  it('puts real water targets in the pourover steps rather than multipliers', () => {
    const r = RECIPES.pourover
    const steps = r.buildSteps(15, 250)
    const text = steps.map((s) => s.title).join(' ')

    expect(text).toContain('45ml') // bloom = 3x dose
    expect(text).toContain('250ml') // final pour
  })

  it('formats the clock', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(45)).toBe('0:45')
    expect(formatClock(195)).toBe('3:15')
    expect(formatClock(1200)).toBe('20:00')
  })
})
