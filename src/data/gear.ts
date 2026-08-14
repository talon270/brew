/**
 * Gear that is not a grinder.
 *
 * The grinder page answers the biggest question; this answers the rest, in the
 * same register — what it does, when it is worth buying, and when it is not.
 *
 * Prices are approximate Indian street prices as of 2026 and move constantly.
 * They are here to give a sense of tier, not to be quoted.
 */

export type GearKind = 'brewer' | 'kettle' | 'scale' | 'accessory'

export interface GearItem {
  id: string
  name: string
  kind: GearKind
  priceInr: number
  /** Ranked buying order: 1 = buy this before almost anything else. */
  priority: 1 | 2 | 3
  verdict: string
  /** Honest reason not to buy it. */
  skipIf?: string
}

export const GEAR: GearItem[] = [
  // --------------------------------------------------------------- brewers
  {
    id: 'v60-plastic',
    name: 'Hario V60 (plastic, size 02)',
    kind: 'brewer',
    priceInr: 700,
    priority: 1,
    verdict:
      'The default pourover cone, and the plastic one is genuinely the best version — it holds heat better than glass or ceramic and survives being dropped. Almost every filter recipe online assumes this shape.',
    skipIf: 'You only ever drink milk coffee, where the clarity it gives is wasted.',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    kind: 'brewer',
    priceInr: 4200,
    priority: 1,
    verdict:
      'The most forgiving brewer there is. Short contact time and a paper filter hide a lot of grind inconsistency, which makes it the right first brewer if your grinder is modest. Nearly indestructible, and the obvious travel choice.',
  },
  {
    id: 'french-press',
    name: 'French press (350ml)',
    kind: 'brewer',
    priceInr: 900,
    priority: 2,
    verdict:
      'Cheap, no paper filters to buy, and it teaches immersion cleanly. The metal mesh lets oils and fines through, so expect a heavier, cloudier cup — that is the brewer working as designed, not a fault.',
    skipIf: 'You want clarity above all. No technique makes a press taste like paper-filtered coffee.',
  },
  {
    id: 'moka',
    name: 'Moka pot (3-cup)',
    kind: 'brewer',
    priceInr: 1800,
    priority: 3,
    verdict:
      'Makes something strong and espresso-adjacent on a gas hob, for very little money. Not actually espresso — around 1.5 bar against espresso\'s nine — but excellent with a dark roast and milk.',
    skipIf: 'You expect it to replace an espresso machine. It will not, and chasing that leads to disappointment.',
  },
  {
    id: 'south-indian-filter',
    name: 'South Indian filter (stainless, 200ml)',
    kind: 'brewer',
    priceInr: 600,
    priority: 2,
    verdict:
      'Cheap, local, and makes a genuinely distinct drink — a slow, thick decoction that is nothing like pourover. Worth owning in India whatever else you brew with, if only because the ingredient is on every shelf.',
  },

  // --------------------------------------------------------------- kettles
  {
    id: 'gooseneck-stovetop',
    name: 'Gooseneck kettle (stovetop)',
    kind: 'kettle',
    priceInr: 1800,
    priority: 1,
    verdict:
      'The one pourover accessory worth buying early. A normal kettle dumps water in a wide unpredictable stream, which floods the bed and channels; a gooseneck lets you place a thin stream exactly where you want it.',
    skipIf: 'You only brew immersion — a French press does not care how you pour.',
  },
  {
    id: 'gooseneck-variable',
    name: 'Variable-temperature electric gooseneck',
    kind: 'kettle',
    priceInr: 7500,
    priority: 3,
    verdict:
      'Convenience rather than capability. Being able to set 93°C and hold it removes one variable permanently, which matters most if you brew light roasts and chase small differences.',
    skipIf:
      'Your grind is not yet consistent. Temperature is a fine adjustment and this is a lot of money to spend on the smallest dial.',
  },

  // ---------------------------------------------------------------- scales
  {
    id: 'scale-0-1',
    name: '0.1g scale with timer',
    kind: 'scale',
    priceInr: 1200,
    priority: 1,
    verdict:
      'Buy this before any brewer. Weighing is the difference between repeatable coffee and guessing, and 0.1g resolution matters for espresso doses. A built-in timer saves juggling a phone with a kettle in your hand.',
  },
  {
    id: 'scale-1g',
    name: 'Kitchen scale (1g)',
    kind: 'scale',
    priceInr: 500,
    priority: 2,
    verdict:
      'Fine for filter, where a gram either way is not decisive. Not enough for espresso, where 0.5g changes the shot noticeably.',
    skipIf: 'You are heading toward espresso — you will replace it within months.',
  },

  // ------------------------------------------------------------ accessories
  {
    id: 'filters',
    name: 'Paper filters (V60 02, 100pk)',
    kind: 'accessory',
    priceInr: 450,
    priority: 1,
    verdict:
      'Rinse them before brewing: it washes off the papery taste and preheats the cone at the same time. Bleached (white) filters taste cleaner than unbleached; the environmental difference is negligible either way.',
  },
  {
    id: 'thermometer',
    name: 'Instant-read thermometer',
    kind: 'accessory',
    priceInr: 600,
    priority: 3,
    verdict:
      'Useful for a week, to learn what your kettle actually does and how fast water cools in your climate. After that most people stop measuring and just count seconds off the boil.',
    skipIf: 'You have a variable-temperature kettle, which makes it redundant.',
  },
  {
    id: 'storage',
    name: 'Airtight opaque container with valve',
    kind: 'accessory',
    priceInr: 1400,
    priority: 2,
    verdict:
      'Oxygen, light, heat and moisture are what stale coffee. A sealed opaque jar handles three of them. In Delhi summers this matters more than in most places.',
    skipIf:
      'You buy 250g at a time and finish it in two weeks — the bag it came in, rolled down and clipped, is genuinely fine.',
  },
  {
    id: 'distributor',
    name: 'Espresso distribution tool',
    kind: 'accessory',
    priceInr: 2500,
    priority: 3,
    verdict:
      'Levels the grounds before tamping, which reduces channelling. A real improvement for espresso consistency, and completely pointless for anything else.',
    skipIf: 'You do not pull espresso. Nothing else in coffee needs this.',
  },
]

export const GEAR_KIND_LABELS: Record<GearKind, string> = {
  brewer: 'Brewers',
  kettle: 'Kettles',
  scale: 'Scales',
  accessory: 'Accessories',
}

/** The honest order to buy things in, for someone starting from nothing. */
export const BUYING_ORDER = [
  {
    step: 'First',
    what: 'A burr grinder and a 0.1g scale',
    why: 'Nothing else you buy can compensate for an uneven grind or an unmeasured dose. Together these are the floor.',
  },
  {
    step: 'Second',
    what: 'One brewer — V60 or AeroPress',
    why: 'Pick by your grinder: AeroPress if it is modest, V60 if it is good. Owning several brewers before you can use one well is the most common way people waste money here.',
  },
  {
    step: 'Third',
    what: 'A gooseneck kettle, if you chose the V60',
    why: 'Pour control is the second-largest variable in pourover after grind. Skip entirely if you brew immersion.',
  },
  {
    step: 'Then',
    what: 'Better beans, more often',
    why: 'At this point equipment stops being the limit. Fresh coffee from a roaster who prints a roast date will improve your cup more than anything on this page.',
  },
]
