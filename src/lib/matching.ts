/**
 * Scoring. Pure functions only — no React, no network, no dates.
 *
 * Every scorer returns reasons alongside the number. The UI shows the reasons;
 * an opaque "87% match" tells nobody anything and can't be argued with.
 */

import type { Bean, BrewMethod, Grinder, Match, TasteProfile } from './types'
import { BREW_METHOD_LABELS } from './types'

/** Distance between two 0-100 axis values, expressed as 1 (identical) to 0 (opposite). */
function closeness(a: number, b: number): number {
  return 1 - Math.abs(a - b) / 100
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

// ---------------------------------------------------------------- grinders

/**
 * Burr geometry as a rough quality proxy. This is a real ordering, not an
 * arbitrary one: blades chop coffee into wildly uneven fragments, ceramic
 * conicals are consistent but slow and tend to be entry-level, and steel
 * flat/conical burrs are what anything serious uses.
 */
const BURR_QUALITY: Record<Grinder['burrType'], number> = {
  blade: 0.0,
  ceramic_conical: 0.55,
  conical: 0.8,
  flat: 0.85,
}

function grinderQuality(g: Grinder): number {
  let q = BURR_QUALITY[g.burrType]
  // Bigger burrs cut more evenly and faster. Only meaningful above ~38mm.
  if (g.burrSizeMm) {
    q += clamp01((g.burrSizeMm - 38) / 40) * 0.15
  }
  return clamp01(q)
}

export interface GrinderMatch extends Match<Grinder> {
  /** True when the grinder costs more than the stated budget. */
  overBudget: boolean
}

export function scoreGrinder(profile: TasteProfile, g: Grinder): GrinderMatch {
  const reasons: string[] = []
  const caveats: string[] = []

  const methods = profile.methods
  const overBudget = g.priceInr > profile.budgetInr

  // --- method fit: does it do what this person actually brews?
  let methodFit = 1
  if (methods.length > 0) {
    const covered = methods.filter((m) => g.bestFor.includes(m))
    methodFit = covered.length / methods.length

    if (covered.length > 0) {
      const names = covered.map((m) => BREW_METHOD_LABELS[m].toLowerCase())
      reasons.push(`Good for ${formatList(names)}`)
    }
    const missed = methods.filter((m) => !g.bestFor.includes(m))
    if (missed.length > 0) {
      const names = missed.map((m) => BREW_METHOD_LABELS[m].toLowerCase())
      caveats.push(`Not the right tool for ${formatList(names)}`)
    }
  }

  // --- the espresso cliff. A grinder that can't step finely enough is not
  // "a bit worse" for espresso, it is unusable for it.
  if (methods.includes('espresso')) {
    if (g.espressoCapable) {
      reasons.push('Grinds fine and consistently enough for espresso')
    } else {
      methodFit *= 0.2
      caveats.push('Cannot hold a fine enough grind for espresso')
    }
  }

  const quality = grinderQuality(g)
  if (g.burrType === 'blade') {
    caveats.push('Blade grinder — chops rather than grinds, giving uneven particle size')
  } else if (g.burrSizeMm && g.burrSizeMm >= 60) {
    reasons.push(`Large ${g.burrSizeMm}mm burrs — fast and very even`)
  }

  // --- budget. Within budget, price is deliberately neutral: a grinder is not
  // better for costing more, and burr quality already separates the field.
  // Rewarding spend here made worse-but-pricier grinders outrank better ones.
  let valueFit: number
  if (overBudget) {
    // Degrade smoothly rather than hard-cutting, so a grinder ₹200 over budget
    // still surfaces as a near-miss.
    valueFit = clamp01(1 - (g.priceInr - profile.budgetInr) / profile.budgetInr)
    caveats.push(`₹${g.priceInr.toLocaleString('en-IN')} — over your budget`)
  } else {
    valueFit = 1
  }

  if (g.powered === 'manual' && methods.includes('espresso')) {
    caveats.push('Hand grinder — espresso-fine grinding takes real effort per shot')
  }

  const score = clamp01(0.5 * methodFit + 0.4 * quality + 0.1 * valueFit)

  return { item: g, score, reasons, caveats, overBudget }
}

export function rankGrinders(profile: TasteProfile, grinders: Grinder[]): GrinderMatch[] {
  return grinders
    .map((g) => scoreGrinder(profile, g))
    .sort((a, b) => {
      // In-budget options always rank above over-budget ones, however good.
      if (a.overBudget !== b.overBudget) return a.overBudget ? 1 : -1
      return b.score - a.score
    })
}

// ------------------------------------------------------------------- beans

/**
 * Notes that signal an unusual cup. Someone who ticked "give me the classics"
 * should not be handed a funky anaerobic natural as their first bag.
 */
const ADVENTUROUS_NOTES = [
  'funky',
  'fermented',
  'boozy',
  'wine',
  'tropical',
  'floral',
  'jasmine',
  'bergamot',
  'lychee',
  'passionfruit',
]

const ADVENTUROUS_PROCESSES: Bean['process'][] = ['anaerobic', 'natural']

function beanAdventure(b: Bean): number {
  let a = 0
  if (ADVENTUROUS_PROCESSES.includes(b.process)) a += 0.45
  const exotic = b.flavourNotes.filter((n) =>
    ADVENTUROUS_NOTES.some((x) => n.toLowerCase().includes(x)),
  )
  a += clamp01(exotic.length / 2) * 0.55
  return clamp01(a)
}

export function scoreBean(profile: TasteProfile, b: Bean): Match<Bean> {
  const reasons: string[] = []
  const caveats: string[] = []

  const roastFit = closeness(profile.roast, b.roastLevel)
  const acidityFit = closeness(profile.acidity, b.acidity)
  const bodyFit = closeness(profile.body, b.body)

  const adventure = beanAdventure(b) * 100
  const adventureFit = closeness(profile.adventurousness, adventure)

  if (roastFit > 0.75) {
    reasons.push(b.roastLevel < 40 ? 'Light roast, as you like it' : b.roastLevel > 65 ? 'Dark roast, as you like it' : 'Medium roast, right in your range')
  }
  if (b.acidity > 65 && profile.acidity > 60) {
    reasons.push('Bright and fruity — the acidity you enjoy')
  }
  if (b.acidity > 65 && profile.acidity < 35) {
    caveats.push('Noticeably acidic, which you said you avoid')
  }
  if (b.body > 65 && profile.body > 60) {
    reasons.push('Heavy, syrupy body')
  }

  // Milk drinkers need a cup that survives being diluted. A delicate washed
  // Ethiopian disappears under 150ml of milk; a chocolatey medium-dark does not.
  let milkFit = 1
  if (profile.milk > 65) {
    const cutsThrough = b.body > 55 && b.roastLevel > 45
    milkFit = cutsThrough ? 1 : 0.55
    if (cutsThrough) {
      reasons.push('Stands up to milk')
    } else {
      caveats.push('Delicate — likely to get lost under milk')
    }
  } else if (profile.milk < 35 && b.roastLevel > 75) {
    caveats.push('Roasted dark for milk drinks; can taste harsh black')
    milkFit = 0.7
  }

  if (adventure > 60 && profile.adventurousness > 60) {
    reasons.push(`Unusual cup — ${b.process} process`)
  }

  const score = clamp01(
    0.26 * roastFit +
      0.22 * acidityFit +
      0.18 * bodyFit +
      0.14 * adventureFit +
      0.2 * milkFit,
  )

  return { item: b, score, reasons, caveats }
}

export function rankBeans(profile: TasteProfile, beans: Bean[]): Match<Bean>[] {
  return beans.map((b) => scoreBean(profile, b)).sort((a, b) => b.score - a.score)
}

// ------------------------------------------------------------------ shared

export function formatList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function methodsUsingFineGrind(methods: BrewMethod[]): boolean {
  return methods.includes('espresso') || methods.includes('moka')
}
