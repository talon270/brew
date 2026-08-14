/**
 * Grinder catalogue — author-controlled editorial content.
 *
 * ⚠️  SEED DATA, NOT YET VERIFIED.
 * Prices are approximate Indian street prices and drift constantly with import
 * duty and availability. Every `priceInr` here must be checked against the
 * source Reddit posts (and current listings) before launch. The specs — burr
 * type, size, espresso capability — are stable and can be trusted.
 *
 * Add `sourceUrl` to each entry once the Reddit posts are imported, so the
 * original threads get credited on the grinder page.
 */

import type { Grinder } from '../lib/types'

export const GRINDERS: Grinder[] = [
  {
    id: 'blade-generic',
    brand: 'Generic',
    model: 'Blade grinder (Agaro, Inalsa, etc.)',
    priceInr: 1800,
    powered: 'electric',
    burrType: 'blade',
    bestFor: [],
    espressoCapable: false,
    verdict:
      "Listed here so you can rule it out. A blade grinder is a propeller in a cup — it smashes beans into a mix of boulders and dust rather than grinding them to one size. The dust over-extracts and turns bitter while the boulders stay sour, in the same cup. If this is your budget, buy a hand grinder instead; you will taste the difference immediately.",
  },
  {
    id: 'hario-mini-mill-slim',
    brand: 'Hario',
    model: 'Mini Mill Slim',
    priceInr: 2800,
    powered: 'manual',
    burrType: 'ceramic_conical',
    bestFor: ['french_press', 'moka', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      "The cheapest grinder worth owning. Ceramic burrs are genuinely consistent at coarse settings, so French press and filter coffee come out well. The catch is the plastic grind adjustment, which drifts as you grind, and a slow crank. A fine starting point that you will outgrow.",
  },
  {
    id: 'hario-skerton-pro',
    brand: 'Hario',
    model: 'Skerton Pro',
    priceInr: 4500,
    powered: 'manual',
    burrType: 'ceramic_conical',
    bestFor: ['french_press', 'pourover', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      'The Skerton Pro fixed the wobbly burr that made the original Skerton frustrating. Stable enough for pourover and very good for coarse grinds. Still ceramic, still slow, still not an espresso grinder — but a real upgrade over anything with a blade.',
  },
  {
    id: 'timemore-c3',
    brand: 'Timemore',
    model: 'Chestnut C3',
    priceInr: 5500,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 38,
    bestFor: ['pourover', 'aeropress', 'french_press', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      'The default recommendation in this price band, and deservedly so. Stainless steel burrs, a solid body, and it grinds a pourover dose in well under a minute. Handles everything from filter to French press cleanly. It can technically go fine, but the steps are too coarse to dial espresso in properly.',
  },
  {
    id: 'timemore-c3-esp',
    brand: 'Timemore',
    model: 'Chestnut C3 ESP Pro',
    priceInr: 8500,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 38,
    bestFor: ['espresso', 'moka', 'aeropress', 'pourover'],
    espressoCapable: true,
    verdict:
      'The C3 with a finer, espresso-oriented burr set and much smaller adjustment steps. This is the cheapest hand grinder that will genuinely let you dial in a shot rather than fight it. Expect real arm work per double shot — that is the price of the ticket at this budget.',
  },
  {
    id: '1zpresso-q2',
    brand: '1Zpresso',
    model: 'Q2 Heptagonal',
    priceInr: 9500,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 38,
    bestFor: ['pourover', 'aeropress', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      'Small, beautifully made, and the one to buy if you travel with your coffee. Grind quality for filter is excellent. The compact body is exactly why it is not an espresso grinder — there is not enough leverage to make fine grinding tolerable.',
  },
  {
    id: '1zpresso-jx-pro',
    brand: '1Zpresso',
    model: 'JX-Pro',
    priceInr: 17000,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 48,
    bestFor: ['espresso', 'pourover', 'aeropress', 'french_press', 'moka', 'south_indian_filter'],
    espressoCapable: true,
    verdict:
      '48mm burrs make this noticeably faster and more even than any 38mm grinder, and the external numbered adjustment is easy to return to a known setting. Comfortably does both filter and espresso. If you only buy one grinder for the next decade, this is a very defensible choice.',
  },
  {
    id: '1zpresso-j-ultra',
    brand: '1Zpresso',
    model: 'J-Ultra',
    priceInr: 21000,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 48,
    bestFor: ['espresso', 'pourover', 'aeropress', 'moka', 'south_indian_filter'],
    espressoCapable: true,
    verdict:
      'The JX-Pro refined — a burr geometry that suits filter and espresso equally, finer adjustment steps, and a magnetic catch cup. Close to the ceiling of what a hand grinder can do. Buy it if you switch between espresso and pourover regularly.',
  },
  {
    id: 'baratza-encore',
    brand: 'Baratza',
    model: 'Encore',
    priceInr: 24000,
    powered: 'electric',
    burrType: 'conical',
    burrSizeMm: 40,
    bestFor: ['pourover', 'french_press', 'aeropress', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      'The classic first electric grinder. Press a button, get consistent filter coffee, and repair it forever — Baratza sell every replacement part. Import duty makes it poor value in India compared to a hand grinder of equal quality, so buy it for the convenience, not the grind. The standard Encore cannot go fine enough for espresso; you want the Encore ESP for that.',
  },
  {
    id: 'baratza-encore-esp',
    brand: 'Baratza',
    model: 'Encore ESP',
    priceInr: 28000,
    powered: 'electric',
    burrType: 'conical',
    burrSizeMm: 40,
    bestFor: ['espresso', 'pourover', 'aeropress', 'moka'],
    espressoCapable: true,
    verdict:
      'An Encore rebuilt around espresso — finer burrs and much tighter adjustment steps at the fine end, while still grinding acceptable filter. The most sensible entry point into electric espresso grinding if you want one machine for both.',
  },
  {
    id: 'comandante-c40',
    brand: 'Comandante',
    model: 'C40 MK4',
    priceInr: 31000,
    powered: 'manual',
    burrType: 'conical',
    burrSizeMm: 39,
    bestFor: ['pourover', 'aeropress', 'french_press', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      'The reference hand grinder for filter coffee, and a genuinely lovely object. The burr set is optimised for clarity in pourover and it shows. Very expensive for what it does, and the stock burrs are not an espresso proposition — this is a specialist, not an all-rounder.',
  },
  {
    id: 'fellow-ode-2',
    brand: 'Fellow',
    model: 'Ode Gen 2',
    priceInr: 34000,
    powered: 'electric',
    burrType: 'flat',
    burrSizeMm: 64,
    bestFor: ['pourover', 'french_press', 'aeropress', 'south_indian_filter'],
    espressoCapable: false,
    verdict:
      '64mm flat burrs in a small, quiet, single-dose body. Grinds a pourover dose in about fifteen seconds with almost nothing retained in the machine, and the flat burrs give a cleaner, more separated cup than a conical. Explicitly brew-only — it does not go to espresso fineness and Fellow do not pretend otherwise.',
  },
  {
    id: 'df64',
    brand: 'DF64',
    model: 'DF64 Gen 2',
    priceInr: 38000,
    powered: 'electric',
    burrType: 'flat',
    burrSizeMm: 64,
    bestFor: ['espresso', 'pourover', 'aeropress', 'moka'],
    espressoCapable: true,
    verdict:
      'The enthusiast value pick. Single-dose, stepless, 64mm flats, and a large aftermarket of alternative burr sets if you want to change its character later. Fit and finish are merely fine and it needs a bit of tinkering out of the box — that is the trade for espresso-capable flat burrs at this price.',
  },
  {
    id: 'eureka-specialita',
    brand: 'Eureka',
    model: 'Mignon Specialita',
    priceInr: 48000,
    powered: 'electric',
    burrType: 'flat',
    burrSizeMm: 55,
    bestFor: ['espresso', 'moka'],
    espressoCapable: true,
    verdict:
      'A quiet, stepless, properly built espresso grinder that you adjust once and then forget about. This is the "stop thinking about grinders" purchase for anyone with a home espresso machine. It is an espresso specialist — usable for filter at a push, but that is not what you are paying for.',
  },
]
