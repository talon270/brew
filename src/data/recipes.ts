/**
 * Timed brew recipes.
 *
 * Steps are generated from the dose so the water targets are real numbers you
 * can pour to, not "3x the coffee weight" arithmetic you have to do mid-brew
 * with a kettle in one hand.
 */

import type { BrewMethod } from '../lib/types'

export interface RecipeStep {
  /** Seconds from the start of the brew. */
  at: number
  title: string
  detail?: string
}

export interface Recipe {
  method: BrewMethod
  /** Water per gram of coffee. */
  ratio: number
  defaultDoseG: number
  grind: string
  waterTempC: string
  totalSeconds: number
  buildSteps: (doseG: number, waterMl: number) => RecipeStep[]
}

const round5 = (n: number) => Math.round(n / 5) * 5

export const RECIPES: Record<BrewMethod, Recipe> = {
  pourover: {
    method: 'pourover',
    ratio: 50 / 3, // 1:16.67 — 15g to 250ml
    defaultDoseG: 15,
    grind: 'Medium — coarse sand',
    waterTempC: '94',
    totalSeconds: 195,
    buildSteps: (dose, water) => [
      { at: 0, title: 'Rinse the filter', detail: 'Hot water through the paper, then tip that water out. Washes off papery taste and preheats the brewer.' },
      { at: 0, title: `Add ${dose}g coffee`, detail: 'Level the bed so water flows evenly.' },
      { at: 5, title: `Bloom to ${round5(dose * 3)}ml`, detail: 'Just enough to wet everything. It will bubble and swell — that is trapped CO₂ escaping.' },
      { at: 45, title: `Pour to ${round5(water * 0.6)}ml`, detail: 'Slow circles, keep the bed level. Avoid pouring down the sides.' },
      { at: 90, title: `Pour to ${water}ml`, detail: 'Finish the pour steadily.' },
      { at: 180, title: 'Should be finished draining', detail: 'Much faster than 2:30? Grind finer next time. Stalling past 4:00? Grind coarser.' },
    ],
  },

  french_press: {
    method: 'french_press',
    ratio: 50 / 3, // 1:16.67 — 30g to 500ml
    defaultDoseG: 30,
    grind: 'Coarse — breadcrumbs',
    waterTempC: '95',
    totalSeconds: 260,
    buildSteps: (dose, water) => [
      { at: 0, title: `Add ${dose}g coffee`, detail: 'Straight into the empty press.' },
      { at: 5, title: `Pour all ${water}ml at once`, detail: 'No need to be delicate.' },
      { at: 240, title: 'Break the crust and skim', detail: 'Stir the layer on top, then spoon off the foam and floating grounds.' },
      { at: 255, title: 'Press slowly', detail: 'Just past the surface. Do not ram it to the bottom.' },
      { at: 260, title: 'Pour it all out now', detail: 'Coffee left sitting on the grounds keeps extracting and turns bitter.' },
    ],
  },

  aeropress: {
    method: 'aeropress',
    ratio: 15.3,
    defaultDoseG: 15,
    grind: 'Medium-fine — table salt',
    waterTempC: '92',
    totalSeconds: 120,
    buildSteps: (dose, water) => [
      { at: 0, title: 'Assemble, rinsed filter, on a sturdy mug' },
      { at: 5, title: `Add ${dose}g coffee, pour to ${water}ml` },
      { at: 20, title: 'Stir gently, 3 times', detail: 'Then cap it.' },
      { at: 90, title: 'Press down steadily', detail: 'Take about 30 seconds. Stop the moment you hear hissing.' },
    ],
  },

  moka: {
    method: 'moka',
    ratio: 8,
    defaultDoseG: 18,
    grind: 'Fine — fine sand, not espresso-fine',
    waterTempC: 'Pre-boiled',
    totalSeconds: 300,
    buildSteps: (dose, water) => [
      { at: 0, title: `Fill the base with ${water}ml hot water`, detail: 'Up to just below the safety valve. Starting hot means less time on the heat and far less scorched taste.' },
      { at: 10, title: `Fill the basket with ${dose}g coffee`, detail: 'Level it. Do not tamp — moka pots are not built for that pressure.' },
      { at: 25, title: 'Assemble, medium-low heat, lid open' },
      { at: 150, title: 'Watch the flow', detail: 'Honey-coloured and steady is good.' },
      { at: 280, title: 'Pale and sputtering? Off the heat', detail: 'Run the base under a cold tap. Everything bitter about moka coffee comes from letting it run too long.' },
    ],
  },

  south_indian_filter: {
    method: 'south_indian_filter',
    ratio: 4,
    defaultDoseG: 25,
    grind: 'Fine-medium',
    waterTempC: 'Boiling',
    totalSeconds: 1200,
    buildSteps: (dose, water) => [
      { at: 0, title: `Add ${dose}g coffee to the upper chamber`, detail: 'Traditionally 70–80% coffee to 20–30% chicory. Tamp lightly with the press disc.' },
      { at: 20, title: `Pour ${water}ml boiling water, cover` },
      { at: 60, title: 'Now leave it alone', detail: 'The decoction drips slowly. Rushing it is the only way to fail.' },
      { at: 1080, title: 'Check the decoction', detail: 'Should be dark and syrupy.' },
      { at: 1200, title: 'Mix 1 part decoction to 3–4 parts hot milk', detail: 'Sweeten to taste, then pull between two tumblers to froth and cool it.' },
    ],
  },

  espresso: {
    method: 'espresso',
    ratio: 2,
    defaultDoseG: 18,
    grind: 'Very fine — powdered sugar',
    waterTempC: '93',
    totalSeconds: 35,
    buildSteps: (dose, water) => [
      { at: 0, title: `Dose ${dose}g, distribute and tamp level` },
      { at: 5, title: 'Lock in and start the shot' },
      { at: 10, title: 'First drops should appear', detail: 'Much earlier means grind finer; much later means grind coarser.' },
      { at: 30, title: `Stop at ${water}g in the cup`, detail: 'A 1:2 ratio. Taste, then adjust the grind — not the recipe.' },
    ],
  },
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(Math.abs(totalSeconds) / 60)
  const s = Math.abs(totalSeconds) % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
