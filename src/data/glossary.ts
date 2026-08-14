/**
 * The vocabulary barrier.
 *
 * Almost every guide to coffee assumes you already know what "extraction" or
 * "washed" means. These are the terms that actually block a beginner, defined
 * in the same plain register as the rest of the site — no term is defined using
 * another term you would also have to look up.
 */

export interface GlossaryEntry {
  /** Lowercase key used by <Term>. */
  term: string
  /** Words that should resolve to this entry. */
  aliases?: string[]
  short: string
  /** Optional extra paragraph shown on the glossary page only. */
  more?: string
  group: 'Brewing' | 'Beans' | 'Roasting' | 'Gear' | 'Tasting'
}

export const GLOSSARY: GlossaryEntry[] = [
  // ---------------------------------------------------------------- Brewing
  {
    term: 'extraction',
    aliases: ['extract', 'extracted'],
    short:
      'How much of the ground coffee actually dissolved into the water. Too little tastes sour and thin; too much tastes bitter and drying.',
    more: 'Roughly 18–22% of the bean by weight is soluble in a way you want. Everything you control — grind, time, temperature, ratio — is really just a way of steering this one number.',
    group: 'Brewing',
  },
  {
    term: 'under-extracted',
    aliases: ['underextracted', 'under extraction'],
    short: 'Not enough dissolved. Tastes sour, sharp, empty, and it finishes quickly.',
    more: 'The fix is almost always to grind finer. Longer contact time and hotter water also help.',
    group: 'Brewing',
  },
  {
    term: 'over-extracted',
    aliases: ['overextracted', 'over extraction'],
    short: 'Too much dissolved, including the parts you did not want. Tastes bitter, harsh and drying.',
    more: 'The fix is almost always to grind coarser. Shorter contact time and slightly cooler water also help.',
    group: 'Brewing',
  },
  {
    term: 'ratio',
    aliases: ['brew ratio'],
    short:
      'Grams of coffee to grams of water. 1:16 means 1g of coffee for every 16g of water — 15g of coffee makes 240g of brewed coffee.',
    more: 'Ratio sets strength. Grind sets extraction. They are different dials and it is worth keeping them separate in your head.',
    group: 'Brewing',
  },
  {
    term: 'bloom',
    short:
      'The first small pour that wets the grounds and lets them release trapped carbon dioxide, which you can see as foam.',
    more: 'Skipping it means gas pushes water away from the grounds during the rest of the brew, extracting unevenly. Thirty to forty-five seconds is plenty.',
    group: 'Brewing',
  },
  {
    term: 'immersion',
    short: 'Any brew where the coffee sits fully in the water the whole time, like a French press.',
    group: 'Brewing',
  },
  {
    term: 'percolation',
    aliases: ['pour-over', 'pourover'],
    short: 'Any brew where water passes through a bed of coffee and drains away, like a V60.',
    group: 'Brewing',
  },
  {
    term: 'channelling',
    aliases: ['channeling'],
    short:
      'Water finding one easy path through the coffee bed instead of soaking all of it, so part is over-extracted and part is barely touched.',
    more: 'Usually caused by an uneven bed, uneven grind, or pouring too aggressively in one spot.',
    group: 'Brewing',
  },
  {
    term: 'tds',
    aliases: ['strength'],
    short:
      'Total dissolved solids — the percentage of your cup that is coffee rather than water. Filter coffee is usually around 1.3%.',
    more: 'It measures strength, not quality. A strong cup can still be badly extracted.',
    group: 'Brewing',
  },
  {
    term: 'agitation',
    short:
      'Anything that stirs the coffee and water together — swirling, stirring, or the force of your pour. More agitation means more extraction.',
    group: 'Brewing',
  },

  // ------------------------------------------------------------------ Beans
  {
    term: 'arabica',
    short:
      'The species most specialty coffee comes from. More acidity and aroma, more sensitive to heat and disease, grown higher up.',
    group: 'Beans',
  },
  {
    term: 'robusta',
    short:
      'The hardier species. Roughly double the caffeine, heavier body, much less acidity, and a woody bitterness. The backbone of South Indian filter coffee.',
    more: 'Long dismissed as inferior, and mostly for good reason at commodity grade — but fine robusta from a good estate is a real thing.',
    group: 'Beans',
  },
  {
    term: 'washed',
    aliases: ['washed process'],
    short:
      'The fruit is stripped off the seed before drying. Gives the cleanest, brightest, most transparent cup.',
    group: 'Beans',
  },
  {
    term: 'natural',
    aliases: ['natural process', 'dry process'],
    short:
      'The whole cherry dries with the fruit still on, so the seed absorbs it. Big, jammy, berry-like, heavier bodied.',
    group: 'Beans',
  },
  {
    term: 'honey',
    aliases: ['honey process'],
    short:
      'Between washed and natural: skin removed, sticky layer left on to dry. Named for the texture during processing, not the taste.',
    group: 'Beans',
  },
  {
    term: 'anaerobic',
    short:
      'Cherries fermented in sealed tanks without oxygen, which lets different microbes take over. Intense, unusual and divisive.',
    group: 'Beans',
  },
  {
    term: 'mucilage',
    short: 'The sticky, sugary layer clinging to the coffee seed inside the fruit.',
    group: 'Beans',
  },
  {
    term: 'single origin',
    aliases: ['single-origin'],
    short:
      'Coffee from one place — one farm, or one co-operative — rather than blended. Usually bought to taste where it is from.',
    group: 'Beans',
  },
  {
    term: 'blend',
    short:
      'Coffee from several origins mixed deliberately, usually for consistency or to build a specific flavour that no single coffee gives.',
    group: 'Beans',
  },
  {
    term: 'monsooned malabar',
    short:
      'An Indian speciality: beans exposed to monsoon winds for weeks, which swells them and strips the acidity. Heavy, musty, low-acid, unmistakable.',
    group: 'Beans',
  },

  // --------------------------------------------------------------- Roasting
  {
    term: 'roast level',
    short:
      'How far the beans were taken in the roaster. Light keeps more of where the coffee came from; dark tastes more of the roasting itself.',
    group: 'Roasting',
  },
  {
    term: 'first crack',
    short:
      'An audible pop during roasting as steam bursts the bean open. Coffee is only drinkable after this point.',
    group: 'Roasting',
  },
  {
    term: 'degassing',
    aliases: ['resting', 'rest'],
    short:
      'Freshly roasted coffee releases carbon dioxide for days. Brewed too early it foams and tastes uneven.',
    more: 'Filter coffee is usually good from 4–7 days after roast; espresso often wants 10–14.',
    group: 'Roasting',
  },
  {
    term: 'roast date',
    short:
      'When the coffee was roasted. The only date that matters — an expiry date twelve months out tells you nothing.',
    group: 'Roasting',
  },
  {
    term: 'chaff',
    short: 'The papery skin that flakes off the bean during roasting. The debris in your grinder.',
    group: 'Roasting',
  },

  // ------------------------------------------------------------------- Gear
  {
    term: 'burr',
    aliases: ['burrs', 'burr grinder'],
    short:
      'Two toothed plates that crush coffee to a set size. The alternative — a spinning blade — cannot make an even grind at all.',
    group: 'Gear',
  },
  {
    term: 'conical burr',
    short: 'A cone inside a ring. Common, cheaper to make well, tends toward a slightly more mixed grind.',
    group: 'Gear',
  },
  {
    term: 'flat burr',
    short: 'Two facing rings. Usually a more uniform grind, usually more expensive, usually more retention.',
    group: 'Gear',
  },
  {
    term: 'retention',
    short: 'Coffee left behind inside the grinder, which comes out stale in your next brew.',
    group: 'Gear',
  },
  {
    term: 'gooseneck',
    short:
      'A kettle with a long curved spout, which lets you pour slowly and exactly where you want. The one piece of pourover gear worth buying early.',
    group: 'Gear',
  },
  {
    term: 'tamp',
    short:
      'Compressing espresso grounds into an even puck before brewing. Espresso only — tamping a moka pot or filter is wrong.',
    group: 'Gear',
  },
  {
    term: 'portafilter',
    short: 'The handled basket that holds the coffee in an espresso machine.',
    group: 'Gear',
  },

  // ---------------------------------------------------------------- Tasting
  {
    term: 'acidity',
    short:
      'The bright, sharp, fruit-like quality — think apple or citrus, not sourness. In coffee it is a compliment.',
    more: 'Sourness is a fault, usually under-extraction. Acidity is a characteristic. They taste different once you have compared them side by side.',
    group: 'Tasting',
  },
  {
    term: 'body',
    aliases: ['mouthfeel'],
    short: 'How heavy the coffee feels in your mouth. Skimmed milk versus full cream, rather than a flavour.',
    group: 'Tasting',
  },
  {
    term: 'finish',
    aliases: ['aftertaste'],
    short: 'What is left after you swallow, and for how long. Good coffee stays pleasant; bad coffee turns drying or ashy.',
    group: 'Tasting',
  },
  {
    term: 'cupping',
    short:
      'The standard way of tasting coffees side by side: coarse grind, hot water, no filter, break the crust and slurp from a spoon.',
    more: 'It exists to remove brewing skill from the comparison, so you are judging the coffee rather than your technique.',
    group: 'Tasting',
  },
  {
    term: 'balance',
    short: 'No single quality shouting over the others. Usually the thing separating a good cup from an interesting one.',
    group: 'Tasting',
  },
  {
    term: 'specialty coffee',
    aliases: ['speciality coffee'],
    short:
      'Coffee grown and processed well enough to taste of somewhere in particular, and traded so that someone can tell you where.',
    group: 'Tasting',
  },
]

/** Lookup by term or alias, case-insensitive. */
const INDEX = new Map<string, GlossaryEntry>()
for (const entry of GLOSSARY) {
  INDEX.set(entry.term.toLowerCase(), entry)
  for (const alias of entry.aliases ?? []) INDEX.set(alias.toLowerCase(), entry)
}

export function lookupTerm(word: string): GlossaryEntry | undefined {
  return INDEX.get(word.trim().toLowerCase())
}

export const GLOSSARY_GROUPS = ['Brewing', 'Beans', 'Roasting', 'Gear', 'Tasting'] as const
