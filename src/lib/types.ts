/**
 * Domain types for Brew.
 *
 * The taste profile is the spine of the app: one profile drives bean
 * recommendations, grinder rankings, and (later) cafe matching.
 */

export type BrewMethod =
  | 'espresso'
  | 'pourover'
  | 'aeropress'
  | 'french_press'
  | 'moka'
  | 'south_indian_filter'

export const BREW_METHODS: BrewMethod[] = [
  'espresso',
  'pourover',
  'aeropress',
  'french_press',
  'moka',
  'south_indian_filter',
]

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  pourover: 'Pourover / V60',
  aeropress: 'AeroPress',
  french_press: 'French press',
  moka: 'Moka pot',
  south_indian_filter: 'South Indian filter',
}

/**
 * Every axis runs 0-100. The low and high ends are named on each field so the
 * matcher never has to guess which direction is which.
 */
export interface TasteProfile {
  /** 0 = light roast, 100 = dark roast */
  roast: number
  /** 0 = always black, 100 = always with milk */
  milk: number
  /** 0 = wants none, 100 = loves bright/fruity acidity */
  acidity: number
  /** 0 = light and tea-like, 100 = heavy and syrupy */
  body: number
  /** 0 = never sweetened, 100 = always sweetened */
  sweetness: number
  /** 0 = wants the classics, 100 = wants the weird stuff */
  adventurousness: number

  /** How they brew at home. Empty means they only drink out. */
  methods: BrewMethod[]
  /** Grinder budget in rupees. */
  budgetInr: number
}

export type BurrType = 'flat' | 'conical' | 'ceramic_conical' | 'blade'

export interface Grinder {
  id: string
  brand: string
  model: string
  priceInr: number
  powered: 'manual' | 'electric'
  burrType: BurrType
  burrSizeMm?: number
  /** Methods this grinder genuinely does well. */
  bestFor: BrewMethod[]
  /**
   * Whether it can hold a fine, consistent espresso grind. Espresso is the
   * hard case: plenty of grinders that are excellent for pourover cannot
   * step finely enough to dial in a shot.
   */
  espressoCapable: boolean
  /** Editorial note, author-written. */
  verdict: string
  sourceUrl?: string
}

export type Process = 'washed' | 'natural' | 'honey' | 'anaerobic' | 'monsooned'

export interface Bean {
  id: string
  roaster: string
  name: string
  origin: string
  process: Process
  /** 0 = light, 100 = dark. Same scale as TasteProfile.roast. */
  roastLevel: number
  /** 0-100, same scale as the profile axes. */
  acidity: number
  body: number
  flavourNotes: string[]
  priceInr: number
  weightG: number
  buyUrl?: string
  /** Methods this bean is a good match for. Empty means it suits anything. */
  goodFor: BrewMethod[]
}

/** A scored recommendation, with the reasons that produced the score. */
export interface Match<T> {
  item: T
  /** 0-1. */
  score: number
  /** Plain-language reasons, shown to the user instead of a bare number. */
  reasons: string[]
  /** Reasons this is a poor fit. Shown as caveats, never hidden. */
  caveats: string[]
}
