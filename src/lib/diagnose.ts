import type { BrewMethod } from './types'

/**
 * Diagnosis.
 *
 * Prose is the worst possible format for troubleshooting — you have a bad cup
 * in your hand and you need one instruction, not six paragraphs. This maps a
 * symptom to a single change, with the reasoning attached so you learn the
 * model rather than memorising fixes.
 *
 * The hard rule, same as the brew log: change one thing at a time. Every fix
 * returns exactly one primary action. Anything else is context.
 */

export type Symptom =
  | 'sour'
  | 'bitter'
  | 'weak'
  | 'harsh'
  | 'muddy'
  | 'fast'
  | 'slow'
  | 'uneven'

export interface SymptomOption {
  id: Symptom
  label: string
  hint: string
}

export const SYMPTOMS: SymptomOption[] = [
  { id: 'sour', label: 'Sour or sharp', hint: 'Makes your jaw tingle. Empty, finishes fast.' },
  { id: 'bitter', label: 'Bitter', hint: 'Harsh, dry, lingers unpleasantly.' },
  { id: 'weak', label: 'Weak or watery', hint: 'Tastes of almost nothing. Thin.' },
  { id: 'harsh', label: 'Astringent', hint: 'Dries your mouth out, like strong tea.' },
  { id: 'muddy', label: 'Muddy or silty', hint: 'Grit in the cup, cloudy, heavy.' },
  { id: 'fast', label: 'Drains too fast', hint: 'Finished well before the target time.' },
  { id: 'slow', label: 'Stalls or drips forever', hint: 'Still dripping long after the target.' },
  { id: 'uneven', label: 'Different every time', hint: 'Same recipe, unpredictable results.' },
]

export interface Diagnosis {
  /** The one thing to change. */
  action: string
  /** Why this is the cause, in plain language. */
  because: string
  /** Things to check only if the primary fix does not work. */
  thenTry: string[]
  /** Warnings, mismatches, or honesty about limits. */
  caveats: string[]
}

const IMMERSION: BrewMethod[] = ['french_press', 'aeropress']

/**
 * Sour and bitter are the two ends of extraction and account for most bad
 * cups, so they are answered first and most directly.
 */
export function diagnose(symptom: Symptom, method: BrewMethod): Diagnosis {
  const isImmersion = IMMERSION.includes(method)
  const isEspresso = method === 'espresso'
  const isFilterDrip = method === 'pourover' || method === 'south_indian_filter'

  switch (symptom) {
    case 'sour':
      return {
        action: 'Grind one step finer.',
        because:
          'Sour means under-extracted — the water left before it dissolved enough. A finer grind exposes more surface area and slows the water down.',
        thenTry: [
          'Use water straight off the boil, rested about 30 seconds.',
          isImmersion ? 'Add 30 seconds of steep time.' : 'Pour more slowly, so the bed stays submerged longer.',
          'Check the roast date — very fresh coffee, under 4 days, often tastes sour regardless.',
        ],
        caveats: isEspresso
          ? ['On espresso, one step finer can change the shot dramatically. Move in the smallest increment your grinder allows.']
          : [],
      }

    case 'bitter':
      return {
        action: 'Grind one step coarser.',
        because:
          'Bitterness means over-extracted — the water kept dissolving past the good part. A coarser grind pulls less out in the same time.',
        thenTry: [
          isImmersion ? 'Cut the steep time by 30 seconds.' : 'Speed up the pour, or stop it earlier.',
          'Drop the water temperature by a few degrees, to about 92°C.',
          'Check the coffee is not simply roasted very dark — that bitterness is baked in and no grind fixes it.',
        ],
        caveats: [],
      }

    case 'weak':
      return {
        action: 'Use more coffee — move the ratio from 1:16 toward 1:15.',
        because:
          'Weak is a strength problem, not an extraction one. Grinding finer would make it stronger but also risks bitterness; adding coffee is the direct fix.',
        thenTry: [
          'Confirm you are weighing rather than using scoops. A "tablespoon" varies enormously.',
          'If it is weak *and* sour, ignore this and grind finer instead — that is under-extraction.',
        ],
        caveats: [
          'Strength and extraction are different dials. Getting them confused is the single most common reason people go round in circles.',
        ],
      }

    case 'harsh':
      return {
        action: 'Grind one step coarser and drop the temperature to about 92°C.',
        because:
          'That mouth-drying feeling is astringency, which comes from pulling too hard at the very end of the brew.',
        thenTry: [
          'Stop the brew slightly earlier, before the bed runs completely dry.',
          isFilterDrip ? 'Avoid stirring the bed late in the pour.' : 'Press more gently and stop before the plunger hits the grounds.',
        ],
        caveats: [],
      }

    case 'muddy':
      return {
        action: 'Grind coarser, and stop pouring the last of the cup.',
        because:
          'Silt is fine particles passing the filter. A coarser grind makes fewer of them, and the finest sit at the bottom of the pot.',
        thenTry: [
          method === 'french_press'
            ? 'Let it settle for 2 minutes after pressing, and decant rather than pouring to the last drop.'
            : 'Check the filter is seated properly with no gap at the edge.',
          'A grinder that produces a lot of fines will always do this to some degree — it is a hardware limit, not technique.',
        ],
        caveats:
          method === 'french_press'
            ? ['Some silt is inherent to a metal filter. If you want a clean cup, this is the wrong brewer, not the wrong technique.']
            : [],
      }

    case 'fast':
      return {
        action: 'Grind finer.',
        because:
          'The water is finding too little resistance, so it passes through before it has dissolved much. Draining fast and tasting sour are the same problem seen two ways.',
        thenTry: [
          'Level the coffee bed before brewing so water cannot find an easy edge.',
          'Pour in the centre and spiral outward rather than dumping water in.',
        ],
        caveats: isEspresso
          ? ['A shot gushing in under 15 seconds usually means channelling through the puck rather than a grind problem. Check your distribution and tamp first.']
          : [],
      }

    case 'slow':
      return {
        action: 'Grind coarser.',
        because:
          'Too much resistance — usually too fine, and too many fine particles clogging the filter.',
        thenTry: [
          'Rinse the paper filter before brewing, which also removes papery taste.',
          'Stir less. Agitation drives fines down into the filter and blocks it.',
        ],
        caveats: isEspresso
          ? ['On espresso a slow shot is normal-ish; under 20 seconds to first drops is the real warning sign.']
          : [],
      }

    case 'uneven':
      return {
        action: 'Weigh everything — coffee, water, and time — for the next five brews.',
        because:
          'Inconsistency is almost never the coffee. It is one variable moving without you noticing, and you cannot see which until they are all pinned down.',
        thenTry: [
          'Keep the same beans and the same grind for a week. Change nothing else.',
          'Log each brew, so "what did I change" has an answer.',
          'Check your grinder is not clogged — retained old grounds vary the dose invisibly.',
        ],
        caveats: [
          'If your grinder is a blade model, consistency is not achievable. That is the hardware, not you.',
        ],
      }
  }
}
