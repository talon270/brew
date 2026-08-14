import { describe, expect, it } from 'vitest'
import { diagnose, SYMPTOMS, type Symptom } from './diagnose'
import { BREW_METHODS, type BrewMethod } from './types'

const ALL_METHODS = BREW_METHODS as readonly BrewMethod[]

describe('diagnose', () => {
  it('sends sour brews finer and bitter brews coarser', () => {
    expect(diagnose('sour', 'pourover').action).toMatch(/finer/i)
    expect(diagnose('bitter', 'pourover').action).toMatch(/coarser/i)
  })

  it('treats draining fast as the same problem as sour', () => {
    // They are one cause seen two ways, so the fix must agree.
    expect(diagnose('fast', 'pourover').action).toMatch(/finer/i)
    expect(diagnose('slow', 'pourover').action).toMatch(/coarser/i)
  })

  it('fixes weakness with ratio, not with grind', () => {
    // The most common confusion in brewing: strength is not extraction.
    const d = diagnose('weak', 'pourover')
    expect(d.action).toMatch(/more coffee|ratio/i)
    expect(d.action).not.toMatch(/finer/i)
    expect(d.caveats.join(' ')).toMatch(/different dials/i)
  })

  it('always gives exactly one primary action', () => {
    for (const s of SYMPTOMS) {
      for (const m of ALL_METHODS) {
        const d = diagnose(s.id, m)
        expect(d.action.length).toBeGreaterThan(0)
        // One instruction: no lists smuggled into the headline.
        expect(d.action.split('.').filter(Boolean).length).toBeLessThanOrEqual(2)
      }
    }
  })

  it('covers every symptom for every method without gaps', () => {
    for (const s of SYMPTOMS) {
      for (const m of ALL_METHODS) {
        const d = diagnose(s.id, m)
        expect(d.because.length).toBeGreaterThan(20)
        expect(Array.isArray(d.thenTry)).toBe(true)
      }
    }
  })

  it('warns that espresso moves in much smaller grind steps', () => {
    expect(diagnose('sour', 'espresso').caveats.join(' ')).toMatch(/smallest increment|dramatically/i)
  })

  it('blames channelling rather than grind for a gushing espresso shot', () => {
    expect(diagnose('fast', 'espresso').caveats.join(' ')).toMatch(/channelling/i)
  })

  it('admits when the brewer, not the technique, is the limit', () => {
    // A metal filter will always pass silt; pretending otherwise wastes time.
    expect(diagnose('muddy', 'french_press').caveats.join(' ')).toMatch(/wrong brewer/i)
  })

  it('tells blade grinder owners that consistency is not achievable', () => {
    expect(diagnose('uneven', 'pourover').caveats.join(' ')).toMatch(/blade/i)
  })

  it('adjusts steep time for immersion and pour speed for percolation', () => {
    expect(diagnose('sour', 'french_press').thenTry.join(' ')).toMatch(/steep/i)
    expect(diagnose('sour', 'pourover').thenTry.join(' ')).toMatch(/pour/i)
  })

  it('offers a distinct diagnosis per symptom', () => {
    const actions = new Set(SYMPTOMS.map((s) => diagnose(s.id as Symptom, 'pourover').action))
    // 'sour'/'fast' and 'bitter'/'slow' legitimately share a fix; the rest differ.
    expect(actions.size).toBeGreaterThanOrEqual(5)
  })
})
