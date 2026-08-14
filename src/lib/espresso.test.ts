import { describe, expect, it } from 'vitest'
import { judgeShot, planShot, SHOT_STYLES } from './espresso'

const classic = SHOT_STYLES.find((s) => s.id === 'classic')!
const lungo = SHOT_STYLES.find((s) => s.id === 'lungo')!

describe('planShot', () => {
  it('turns a dose into a yield at the style ratio', () => {
    expect(planShot(18, classic).yieldG).toBe(36)
    expect(planShot(18, lungo).yieldG).toBe(54)
  })

  it('handles doses that do not divide evenly', () => {
    expect(planShot(17.5, classic).yieldG).toBe(35)
  })
})

describe('judgeShot', () => {
  const plan = planShot(18, classic) // 36g target, 25–32s

  it('accepts a shot on target', () => {
    const v = judgeShot(plan, 36, 28)
    expect(v.outcome).toBe('good')
    expect(v.action).toMatch(/taste/i)
  })

  it('sends a fast shot finer and a slow shot coarser', () => {
    expect(judgeShot(plan, 36, 20).action).toMatch(/finer/i)
    expect(judgeShot(plan, 36, 38).action).toMatch(/coarser/i)
  })

  it('distinguishes a gusher from a merely fast shot', () => {
    // Fast AND far over yield means the puck channelled. Grinding finer there
    // usually makes it worse, so the advice has to differ.
    const gusher = judgeShot(plan, 60, 14)
    expect(gusher.outcome).toBe('gusher')
    expect(gusher.action).toMatch(/distribution|tamp/i)
    expect(gusher.action).not.toMatch(/grind finer/i)

    const merelyFast = judgeShot(plan, 36, 20)
    expect(merelyFast.outcome).toBe('fast')
  })

  it('treats a badly choked shot differently from a slightly slow one', () => {
    expect(judgeShot(plan, 36, 34).outcome).toBe('slow')
    expect(judgeShot(plan, 36, 50).outcome).toBe('choked')
    expect(judgeShot(plan, 36, 50).action).toMatch(/more than one step/i)
  })

  it('uses the style-specific time window', () => {
    // 36s is slow for a classic shot but inside a long shot's window.
    const longPlan = planShot(18, lungo) // 30–40s
    expect(judgeShot(plan, 36, 36).outcome).toBe('slow')
    expect(judgeShot(longPlan, 54, 36).outcome).toBe('good')
  })

  it('always returns a single action', () => {
    for (const seconds of [10, 20, 28, 36, 60]) {
      for (const yieldG of [18, 36, 70]) {
        const v = judgeShot(plan, yieldG, seconds)
        expect(v.action.length).toBeGreaterThan(0)
        expect(v.headline.length).toBeGreaterThan(0)
      }
    }
  })
})
