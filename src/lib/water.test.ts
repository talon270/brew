import { describe, expect, it } from 'vitest'
import { buildWater, describeWater, TARGET, WATER_SOURCES, type WaterProfile } from './water'

const source = (hardness: number, alkalinity: number): WaterProfile => ({
  id: 'test',
  label: 'test',
  hardness,
  alkalinity,
  note: '',
})

describe('buildWater', () => {
  it('brings empty water up to the target', () => {
    const advice = buildWater(source(0, 0), 1)
    expect(advice.epsomMl).toBeGreaterThan(0)
    expect(advice.sodaMl).toBeGreaterThan(0)
    expect(advice.resulting.hardness).toBeCloseTo(TARGET.hardness, -1)
    expect(advice.resulting.alkalinity).toBeCloseTo(TARGET.alkalinity, -1)
    expect(advice.verdict).toBe('good')
  })

  it('scales the dose with the volume', () => {
    const one = buildWater(source(0, 0), 1)
    const two = buildWater(source(0, 0), 2)
    // Not exactly double: each result is rounded to 0.1 mL, which is the finest
    // thing anyone can measure with a kitchen syringe. Doubling a rounded value
    // and rounding a doubled one legitimately differ by that last decimal.
    expect(two.epsomMl).toBeGreaterThan(one.epsomMl * 1.95)
    expect(two.epsomMl).toBeLessThan(one.epsomMl * 2.05)
    expect(two.sodaMl).toBeGreaterThan(one.sodaMl * 1.95)
    expect(two.sodaMl).toBeLessThan(one.sodaMl * 2.05)
  })

  it('never suggests adding to water that is already too hard', () => {
    // You cannot take hardness out at a kitchen counter, so the only honest
    // answer is to dilute or start elsewhere.
    const advice = buildWater(source(300, 200), 1)
    expect(advice.epsomMl).toBe(0)
    expect(advice.sodaMl).toBe(0)
    expect(advice.caveats.join(' ')).toMatch(/cannot remove hardness/i)
  })

  it('flags high alkalinity as the thing that flattens coffee', () => {
    const advice = buildWater(source(60, 180), 1)
    expect(advice.caveats.join(' ')).toMatch(/flattens acidity/i)
  })

  it('leaves water that is already in range alone', () => {
    const advice = buildWater(source(TARGET.hardness, TARGET.alkalinity), 1)
    expect(advice.epsomMl).toBe(0)
    expect(advice.sodaMl).toBe(0)
    expect(advice.reasons.join(' ')).toMatch(/already in range/i)
  })

  it('adjusts the two axes independently', () => {
    // Enough hardness but no buffer: only baking soda should be suggested.
    const advice = buildWater(source(TARGET.hardness, 0), 1)
    expect(advice.epsomMl).toBe(0)
    expect(advice.sodaMl).toBeGreaterThan(0)
  })

  it('gives RO water a workable recipe, since that is what most people have', () => {
    const ro = WATER_SOURCES.find((w) => w.id === 'ro')!
    const advice = buildWater(ro, 1)
    expect(advice.verdict).toBe('good')
    expect(advice.epsomMl).toBeGreaterThan(0)
  })
})

describe('describeWater', () => {
  it('calls out water that is too soft', () => {
    expect(describeWater({ hardness: 5, alkalinity: 5 })).toMatch(/thin|hollow/i)
  })

  it('calls out water that is too hard', () => {
    expect(describeWater({ hardness: 250, alkalinity: 60 })).toMatch(/hard/i)
  })

  it('approves water in range', () => {
    expect(describeWater(TARGET)).toMatch(/good range/i)
  })
})
