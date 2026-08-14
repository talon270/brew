/**
 * Water.
 *
 * Brewed coffee is about 98.6% water, which makes it the largest ingredient by
 * a distance and the one nobody thinks about. Two numbers matter:
 *
 * - **Hardness** (mostly magnesium and calcium) does the actual extracting.
 *   Too little and the cup is hollow and sour however well you brew it.
 * - **Alkalinity** (bicarbonate) buffers acidity. Too much and everything
 *   tastes flat and chalky; too little and bright coffees turn aggressive.
 *
 * This matters more in Delhi NCR than in most places. Municipal supply here is
 * hard enough to scale a kettle in weeks, and the usual answer — an RO unit —
 * strips the water almost bare, which is just as bad in the other direction.
 * The fix is to start from RO and add a measured amount back.
 *
 * Targets follow the SCA's brewing water standard: ~68 mg/L hardness (as
 * CaCO₃) and ~40 mg/L alkalinity, with the useful range being broad.
 */

export interface WaterProfile {
  id: string
  label: string
  /** Total hardness as mg/L CaCO₃. */
  hardness: number
  /** Alkalinity as mg/L CaCO₃. */
  alkalinity: number
  note: string
}

/** Where Delhi NCR brewers actually get their water. */
export const WATER_SOURCES: WaterProfile[] = [
  {
    id: 'ro',
    label: 'RO / purifier water',
    hardness: 10,
    alkalinity: 8,
    note: 'What most Delhi homes drink. Reverse osmosis removes nearly all the minerals — safe, and close to empty as a brewing water.',
  },
  {
    id: 'tap',
    label: 'Delhi NCR tap water',
    hardness: 250,
    alkalinity: 180,
    note: 'Hard and highly alkaline, varying a lot by area and season. Flattens acidity and scales a kettle quickly. Approximate — supply here is not consistent.',
  },
  {
    id: 'bisleri',
    label: 'Packaged mineral water',
    hardness: 90,
    alkalinity: 60,
    note: 'Varies by brand and batch, but usually far closer to workable than either RO or tap. A reasonable no-effort option.',
  },
  {
    id: 'distilled',
    label: 'Distilled / lab water',
    hardness: 0,
    alkalinity: 0,
    note: 'Completely empty, and the cleanest starting point if you want to build water exactly.',
  },
]

export const TARGET = { hardness: 68, alkalinity: 40 } as const

/**
 * Two concentrates, the standard home approach. Each is one salt dissolved in
 * a litre of distilled or RO water, then dosed by the millilitre.
 *
 * - Epsom salt (magnesium sulfate) contributes hardness and nothing else.
 * - Baking soda (sodium bicarbonate) contributes alkalinity and nothing else.
 *
 * Keeping them separate is the whole point: it lets you move one number
 * without disturbing the other.
 */
export const CONCENTRATES = {
  epsom: {
    label: 'Epsom salt (magnesium sulfate)',
    /** g of salt per litre of concentrate. */
    gramsPerLitre: 10,
    /** mg/L CaCO₃ of hardness added per mL of concentrate per litre of water. */
    hardnessPerMl: 4.06,
  },
  soda: {
    label: 'Baking soda (sodium bicarbonate)',
    gramsPerLitre: 10,
    /** mg/L CaCO₃ of alkalinity added per mL of concentrate per litre of water. */
    alkalinityPerMl: 5.95,
  },
} as const

export interface WaterAdvice {
  /** mL of Epsom concentrate to add. */
  epsomMl: number
  /** mL of baking soda concentrate to add. */
  sodaMl: number
  resulting: { hardness: number; alkalinity: number }
  verdict: 'good' | 'workable' | 'poor'
  reasons: string[]
  caveats: string[]
}

function round(n: number, dp = 1): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

/**
 * What to add to a given volume of a given source water.
 *
 * Only ever suggests *adding*, because you cannot remove hardness at the
 * kitchen counter. Water that is already too hard gets told to dilute or
 * switch source rather than given a recipe that cannot work.
 */
export function buildWater(source: WaterProfile, litres: number): WaterAdvice {
  const reasons: string[] = []
  const caveats: string[] = []

  const hardnessGap = TARGET.hardness - source.hardness
  const alkalinityGap = TARGET.alkalinity - source.alkalinity

  const epsomMl = hardnessGap > 0 ? round((hardnessGap / CONCENTRATES.epsom.hardnessPerMl) * litres) : 0
  const sodaMl =
    alkalinityGap > 0 ? round((alkalinityGap / CONCENTRATES.soda.alkalinityPerMl) * litres) : 0

  const resulting = {
    hardness: round(source.hardness + (epsomMl / litres) * CONCENTRATES.epsom.hardnessPerMl, 0),
    alkalinity: round(source.alkalinity + (sodaMl / litres) * CONCENTRATES.soda.alkalinityPerMl, 0),
  }

  if (hardnessGap > 0) {
    reasons.push(
      `Adds the magnesium that does the extracting — without it the cup tastes hollow no matter how well you brew.`,
    )
  }
  if (alkalinityGap > 0) {
    reasons.push(`Adds just enough buffer to stop bright coffees turning sharp.`)
  }

  if (source.hardness > 150) {
    caveats.push(
      'This water is already far harder than the target. You cannot remove hardness at home — dilute it with RO or distilled water, or start from those instead.',
    )
  }
  if (source.alkalinity > 100) {
    caveats.push(
      'High alkalinity is what flattens acidity, and nothing you add will bring it down. This is the main reason Delhi tap water makes dull coffee.',
    )
  }
  if (source.hardness < 20 && source.alkalinity < 20) {
    // Reassurance, not a warning — empty water is the easy starting point.
    reasons.push(
      'Starting from nearly empty water is an advantage: you are building up to a known target rather than fighting whatever is already dissolved.',
    )
  }
  if (epsomMl === 0 && sodaMl === 0) {
    reasons.push('Already in range. Brew with it as it is.')
  }

  const hardnessOff = Math.abs(resulting.hardness - TARGET.hardness)
  const alkalinityOff = Math.abs(resulting.alkalinity - TARGET.alkalinity)
  const verdict: WaterAdvice['verdict'] =
    hardnessOff <= 25 && alkalinityOff <= 25
      ? 'good'
      : hardnessOff <= 70 && alkalinityOff <= 70
        ? 'workable'
        : 'poor'

  return { epsomMl, sodaMl, resulting, verdict, reasons, caveats }
}

/** Plain-language read on a water, independent of any recipe. */
export function describeWater(w: { hardness: number; alkalinity: number }): string {
  if (w.hardness < 25) return 'Too soft — coffee will taste thin, sour and hollow.'
  if (w.hardness > 175) return 'Very hard — muted, chalky coffee, and scale in your kettle.'
  if (w.alkalinity > 100) return 'Very alkaline — acidity gets buffered away and everything tastes flat.'
  if (w.alkalinity < 15) return 'Almost no buffer — bright coffees may taste aggressive or sharp.'
  return 'In a good range for brewing.'
}
