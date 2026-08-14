import { describe, expect, it } from 'vitest'
import { rankBeans, rankGrinders, scoreGrinder } from './matching'
import { GRINDERS } from '../data/grinders'
import { BEANS } from '../data/beans'
import { DEFAULT_PROFILE } from './quiz'
import type { TasteProfile } from './types'

function profile(overrides: Partial<TasteProfile>): TasteProfile {
  return { ...DEFAULT_PROFILE, ...overrides }
}

describe('grinder ranking', () => {
  it('never recommends a blade grinder', () => {
    const p = profile({ methods: ['french_press'], budgetInr: 25000 })
    const ranked = rankGrinders(p, GRINDERS)
    const blade = ranked.findIndex((m) => m.item.burrType === 'blade')

    expect(ranked[0].item.burrType).not.toBe('blade')
    // It should sink to the bottom of the in-budget field, not merely not-win.
    expect(blade).toBeGreaterThan(ranked.length / 2)
  })

  it('does not put an espresso-incapable grinder first for an espresso brewer', () => {
    const p = profile({ methods: ['espresso'], budgetInr: 40000 })
    const ranked = rankGrinders(p, GRINDERS)

    expect(ranked[0].item.espressoCapable).toBe(true)
    // The top three should all actually be able to grind for espresso.
    expect(ranked.slice(0, 3).every((m) => m.item.espressoCapable)).toBe(true)
  })

  it('warns rather than silently down-ranks when a grinder cannot do espresso', () => {
    const p = profile({ methods: ['espresso'], budgetInr: 40000 })
    const encore = GRINDERS.find((g) => g.id === 'baratza-encore')!
    const match = scoreGrinder(p, encore)

    expect(match.caveats.join(' ')).toMatch(/espresso/i)
  })

  it('gives a low-budget French press user a hand grinder, not a boutique electric', () => {
    const p = profile({ methods: ['french_press'], budgetInr: 5000 })
    const ranked = rankGrinders(p, GRINDERS)
    const top = ranked[0]

    expect(top.overBudget).toBe(false)
    expect(top.item.priceInr).toBeLessThanOrEqual(5000)
    expect(top.item.powered).toBe('manual')
  })

  it('ranks every in-budget grinder above every over-budget one', () => {
    const p = profile({ methods: ['pourover'], budgetInr: 10000 })
    const ranked = rankGrinders(p, GRINDERS)
    const firstOver = ranked.findIndex((m) => m.overBudget)

    if (firstOver !== -1) {
      expect(ranked.slice(firstOver).every((m) => m.overBudget)).toBe(true)
    }
  })

  it('changes its shortlist when the brew method changes at a fixed budget', () => {
    // The premise of the finder: same money, different answer. Plenty of good
    // grinders do both well, so the claim is about the shortlist, not the
    // single winner.
    const budgetInr = 40000
    const forEspresso = rankGrinders(profile({ methods: ['espresso'], budgetInr }), GRINDERS)
    const forPourover = rankGrinders(profile({ methods: ['pourover'], budgetInr }), GRINDERS)

    const topEspresso = forEspresso.slice(0, 3).map((m) => m.item.id)
    const topPourover = forPourover.slice(0, 3).map((m) => m.item.id)

    expect(topEspresso).not.toEqual(topPourover)

    // Brew-only grinders must never reach the espresso shortlist, however good
    // they are — the Fellow Ode has excellent burrs and cannot pull a shot.
    expect(topEspresso).not.toContain('fellow-ode-2')
    expect(topPourover).toContain('fellow-ode-2')
  })

  it('explains its top pick', () => {
    const p = profile({ methods: ['pourover'], budgetInr: 12000 })
    const top = rankGrinders(p, GRINDERS)[0]

    expect(top.reasons.length).toBeGreaterThan(0)
  })
})

describe('bean ranking', () => {
  it('does not lead a light-roast, high-acidity drinker with a dark roast', () => {
    const p = profile({ roast: 15, acidity: 90, body: 30, milk: 5 })
    const top = rankBeans(p, BEANS)[0].item

    expect(top.roastLevel).toBeLessThan(45)
  })

  it('does not lead a dark-roast, low-acidity drinker with a bright natural', () => {
    const p = profile({ roast: 85, acidity: 10, body: 85, milk: 20 })
    const top = rankBeans(p, BEANS)[0].item

    expect(top.roastLevel).toBeGreaterThan(60)
    expect(top.acidity).toBeLessThan(40)
  })

  it('gives a milk drinker something that survives milk', () => {
    const p = profile({ milk: 90, roast: 65, body: 75, acidity: 25 })
    const top = rankBeans(p, BEANS)[0]

    expect(top.item.body).toBeGreaterThan(55)
    expect(top.item.roastLevel).toBeGreaterThan(45)
    expect(top.reasons).toContain('Stands up to milk')
  })

  it('flags a delicate bean as a poor milk choice', () => {
    const p = profile({ milk: 90 })
    const ranked = rankBeans(p, BEANS)
    const ethiopian = ranked.find((m) => m.item.id === 'savorworks-ethiopia')!

    expect(ethiopian.caveats.join(' ')).toMatch(/milk/i)
  })

  it('keeps funky anaerobics away from someone who wants the classics', () => {
    const cautious = profile({ adventurousness: 5, roast: 50, acidity: 40 })
    const ranked = rankBeans(cautious, BEANS)
    const anaerobicRank = ranked.findIndex((m) => m.item.process === 'anaerobic')

    expect(anaerobicRank).toBeGreaterThan(2)
  })
})
