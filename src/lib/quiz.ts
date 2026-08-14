/**
 * The taste quiz.
 *
 * Rule for every question here: plain language, no jargon. Nobody getting into
 * specialty coffee knows what an extraction yield is, and asking makes the app
 * feel like a test they're failing.
 */

import type { BrewMethod, TasteProfile } from './types'
import { BREW_METHODS, BREW_METHOD_LABELS } from './types'

export type AxisKey = 'roast' | 'milk' | 'acidity' | 'body' | 'sweetness' | 'adventurousness'

export interface QuizChoice {
  label: string
  hint?: string
  /** Axis values this choice sets. */
  sets: Partial<Record<AxisKey, number>>
}

export interface QuizQuestion {
  id: string
  question: string
  choices: QuizChoice[]
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'milk',
    question: 'How do you usually drink your coffee?',
    choices: [
      { label: 'Black', hint: 'Filter, americano, or just black', sets: { milk: 5 } },
      { label: 'A splash of milk', sets: { milk: 40 } },
      { label: 'Milky', hint: 'Latte, cappuccino, flat white', sets: { milk: 85 } },
      { label: 'Depends on my mood', sets: { milk: 50 } },
    ],
  },
  {
    id: 'sweetness',
    question: 'Sugar?',
    choices: [
      { label: 'Never', sets: { sweetness: 5 } },
      { label: 'Sometimes', sets: { sweetness: 45 } },
      { label: 'Always', sets: { sweetness: 90 } },
    ],
  },
  {
    id: 'roast',
    question: 'Which of these sounds most like coffee to you?',
    choices: [
      {
        label: 'Dark chocolate, toasted, a bit smoky',
        hint: 'You probably like darker roasts',
        sets: { roast: 82, body: 72, acidity: 22 },
      },
      {
        label: 'Caramel, nuts, brown sugar',
        hint: 'The comfortable middle',
        sets: { roast: 55, body: 55, acidity: 42 },
      },
      {
        label: 'Berries, citrus, something floral',
        hint: 'You probably like lighter roasts',
        sets: { roast: 22, body: 34, acidity: 80 },
      },
    ],
  },
  {
    id: 'acidity',
    question: 'Some coffees taste tangy or sharp, a bit like fruit juice. Your reaction?',
    choices: [
      { label: "Love it, that's the good stuff", sets: { acidity: 88 } },
      { label: 'Fine in small doses', sets: { acidity: 50 } },
      { label: "Not for me — tastes sour", sets: { acidity: 15 } },
    ],
  },
  {
    id: 'body',
    question: 'Do you want your cup thick or delicate?',
    choices: [
      { label: 'Thick and heavy', hint: 'Coats your mouth', sets: { body: 85 } },
      { label: 'Somewhere in between', sets: { body: 50 } },
      { label: 'Light and clean', hint: 'More like tea', sets: { body: 20 } },
    ],
  },
  {
    id: 'adventurousness',
    question: 'A cafe offers you a coffee that tastes like fermented mango. Do you order it?',
    choices: [
      { label: 'Obviously', sets: { adventurousness: 92 } },
      { label: 'Maybe, if someone vouches for it', sets: { adventurousness: 55 } },
      { label: "I'd rather have something reliable", sets: { adventurousness: 15 } },
    ],
  },
]

export interface MethodQuestion {
  id: 'methods'
  question: string
  options: { value: BrewMethod; label: string }[]
}

export const METHOD_QUESTION: MethodQuestion = {
  id: 'methods',
  question: 'How do you make coffee at home? Pick all that apply.',
  options: BREW_METHODS.map((m) => ({ value: m, label: BREW_METHOD_LABELS[m] })),
}

export const BUDGET_OPTIONS = [
  { label: 'Under ₹3,000', value: 3000 },
  { label: 'Under ₹6,000', value: 6000 },
  { label: 'Under ₹12,000', value: 12000 },
  { label: 'Under ₹25,000', value: 25000 },
  { label: 'Whatever it takes', value: 100000 },
]

/** Sensible middle-of-the-road starting point before anyone answers anything. */
export const DEFAULT_PROFILE: TasteProfile = {
  roast: 50,
  milk: 50,
  acidity: 50,
  body: 50,
  sweetness: 30,
  adventurousness: 50,
  methods: [],
  budgetInr: 6000,
}

/**
 * Fold quiz answers into a profile. Later questions that touch an axis
 * override earlier ones, so the dedicated acidity and body questions win over
 * the values implied by the flavour question.
 */
export function buildProfile(
  answers: Record<string, number>,
  methods: BrewMethod[],
  budgetInr: number,
): TasteProfile {
  const profile: TasteProfile = { ...DEFAULT_PROFILE, methods, budgetInr }

  for (const q of QUIZ) {
    const choiceIndex = answers[q.id]
    if (choiceIndex === undefined) continue
    const choice = q.choices[choiceIndex]
    if (!choice) continue
    Object.assign(profile, choice.sets)
  }

  return profile
}

/** A short human-readable summary of a profile, for the results header. */
export function describeProfile(p: TasteProfile): string {
  const bits: string[] = []

  if (p.roast < 40) bits.push('light roasts')
  else if (p.roast > 65) bits.push('dark roasts')
  else bits.push('medium roasts')

  if (p.acidity > 65) bits.push('bright and fruity')
  else if (p.acidity < 35) bits.push('low acidity')

  if (p.body > 65) bits.push('a heavy body')
  else if (p.body < 35) bits.push('a clean, light body')

  if (p.milk > 65) bits.push('served with milk')
  else if (p.milk < 35) bits.push('taken black')

  return bits.join(', ')
}
