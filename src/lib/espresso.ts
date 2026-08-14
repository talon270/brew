/**
 * Espresso dial-in.
 *
 * Espresso is where beginners struggle most and spend most, and it is the one
 * brew method where the feedback loop is genuinely hard: a shot takes 30
 * seconds, and almost every variable interacts with the others.
 *
 * The saving grace is that dialling in is a two-number problem — the ratio you
 * are pulling, and how long it takes. Get those in range and the rest is
 * refinement.
 */

export interface ShotTarget {
  id: string
  label: string
  /** Yield as a multiple of dose. 2 = a 36g shot from 18g. */
  ratio: number
  seconds: [number, number]
  suits: string
  note: string
}

export const SHOT_STYLES: ShotTarget[] = [
  {
    id: 'ristretto',
    label: 'Ristretto',
    ratio: 1.5,
    seconds: [25, 32],
    suits: 'Dark roasts, milk drinks',
    note: 'Short and syrupy. Cuts the shot before the harsher later flavours arrive, so it flatters dark roasts and stands up in milk.',
  },
  {
    id: 'classic',
    label: 'Classic',
    ratio: 2,
    seconds: [25, 32],
    suits: 'Almost everything',
    note: 'The default, and the right place to start with any new coffee. Balanced between strength and clarity.',
  },
  {
    id: 'lungo',
    label: 'Long',
    ratio: 3,
    seconds: [30, 40],
    suits: 'Light roasts',
    note: 'Extracts further, which light roasts need — they are denser and give up their sweetness reluctantly. Weaker but more complex.',
  },
]

export interface ShotPlan {
  doseG: number
  yieldG: number
  style: ShotTarget
  /** Human-readable time target. */
  timeLabel: string
}

export function planShot(doseG: number, style: ShotTarget): ShotPlan {
  return {
    doseG,
    yieldG: Math.round(doseG * style.ratio * 10) / 10,
    style,
    timeLabel: `${style.seconds[0]}–${style.seconds[1]}s`,
  }
}

export type ShotOutcome = 'gusher' | 'fast' | 'good' | 'slow' | 'choked'

export interface ShotVerdict {
  outcome: ShotOutcome
  headline: string
  action: string
  detail: string
}

/**
 * Judge a pulled shot against its plan.
 *
 * Time alone is meaningless without the yield — a 30-second shot that produced
 * 60g and a 30-second shot that produced 20g are opposite problems. Both are
 * needed, which is why a scale under the cup matters more than a timer.
 */
export function judgeShot(plan: ShotPlan, actualYieldG: number, seconds: number): ShotVerdict {
  const [lo, hi] = plan.style.seconds
  const targetYield = plan.yieldG
  const yieldRatio = actualYieldG / targetYield

  // Wildly over target yield in under the minimum time: the puck failed, not
  // the grind. Grinding finer will usually make channelling worse, not better.
  if (seconds < lo - 8 && yieldRatio > 1.2) {
    return {
      outcome: 'gusher',
      headline: 'The puck failed',
      action: 'Fix distribution and tamp before touching the grinder.',
      detail:
        'Water found a channel straight through rather than soaking the whole puck. Level the grounds, break up clumps, and tamp flat. Grinding finer at this point usually makes channelling worse.',
    }
  }

  if (seconds < lo) {
    return {
      outcome: 'fast',
      headline: 'Too fast',
      action: 'Grind finer.',
      detail: `Ran in ${seconds}s against a ${plan.timeLabel} target. Less resistance means less extraction — expect it to taste sour and thin.`,
    }
  }

  if (seconds > hi + 12) {
    return {
      outcome: 'choked',
      headline: 'Choked',
      action: 'Grind coarser — by more than one step.',
      detail:
        'Barely flowing. This far past target you are also risking the machine straining. Back off several steps rather than creeping.',
    }
  }

  if (seconds > hi) {
    return {
      outcome: 'slow',
      headline: 'Too slow',
      action: 'Grind coarser.',
      detail: `Took ${seconds}s against a ${plan.timeLabel} target. Too much resistance means over-extraction — expect bitterness and a drying finish.`,
    }
  }

  return {
    outcome: 'good',
    headline: 'In range',
    action: 'Taste it, then adjust for flavour rather than for the clock.',
    detail:
      'Time and yield are both on target. From here the numbers have done their job — if it still tastes sour go finer, if harsh go coarser, one step at a time.',
  }
}
