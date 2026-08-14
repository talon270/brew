/**
 * Indian specialty roasters that ship nationally.
 *
 * The bean list says what to buy; this says who to buy it from, which matters
 * more over time. The single most useful column is whether they print a roast
 * date — a roaster who does is telling you they expect you to care, and one who
 * prints only a best-before is telling you something too.
 *
 * Details change; treat this as a starting point rather than a specification.
 */

export interface Roaster {
  id: string
  name: string
  city: string
  /** Do they print an actual roast date on the bag? */
  roastDate: boolean
  /** Roughly where their house style sits, 0–100 on the same roast axis. */
  houseRoast: number
  style: string
  goodFor: string[]
  note: string
}

export const ROASTERS: Roaster[] = [
  {
    id: 'blue-tokai',
    name: 'Blue Tokai',
    city: 'Delhi NCR',
    roastDate: true,
    houseRoast: 45,
    style: 'Estate-focused, light to medium',
    goodFor: ['First specialty bag', 'Single estates', 'Filter'],
    note: 'The most widely available specialty roaster in India and the usual entry point. Prints roast dates, names estates, and has cafes across NCR so you can taste before committing to a bag.',
  },
  {
    id: 'kc-roasters',
    name: 'KC Roasters',
    city: 'Mumbai',
    roastDate: true,
    houseRoast: 40,
    style: 'Lighter, more experimental',
    goodFor: ['Light roasts', 'Unusual processing', 'Pourover'],
    note: 'Leans lighter than most Indian roasters and takes more risks with processing. Rewarding if you brew filter carefully; less forgiving if your grinder is modest.',
  },
  {
    id: 'naivo',
    name: 'Naivo Café',
    city: 'Bengaluru',
    roastDate: true,
    houseRoast: 50,
    style: 'Balanced, approachable',
    goodFor: ['Everyday drinking', 'Milk drinks'],
    note: 'Consistent and unfussy. A good default when you want something that works black or with milk without much thought.',
  },
  {
    id: 'corridor-seven',
    name: 'Corridor Seven',
    city: 'Nagpur',
    roastDate: true,
    houseRoast: 42,
    style: 'Clean, filter-oriented',
    goodFor: ['Pourover', 'Single origins'],
    note: 'Small and well regarded, with a clear filter focus. Worth ordering from once you know what you like and can judge a coffee on its own terms.',
  },
  {
    id: 'quick-brown-fox',
    name: 'Quick Brown Fox',
    city: 'Goa',
    roastDate: true,
    houseRoast: 55,
    style: 'Medium, espresso-friendly',
    goodFor: ['Espresso', 'Moka pot', 'Milk drinks'],
    note: 'Roasts a little darker than the filter-focused crowd, which suits espresso and pressure brewing. A sensible choice if you are dialling in a machine.',
  },
  {
    id: 'savorworks',
    name: 'Savorworks',
    city: 'Delhi NCR',
    roastDate: true,
    houseRoast: 48,
    style: 'Range from filter to espresso',
    goodFor: ['Espresso', 'Filter', 'Local pickup'],
    note: 'NCR-based, so shipping is fast and the coffee arrives fresher than anything crossing the country. Roasts across the range rather than committing to one style.',
  },
  {
    id: 'araku',
    name: 'Araku Coffee',
    city: 'Andhra Pradesh / Delhi',
    roastDate: true,
    houseRoast: 44,
    style: 'Single-origin Araku valley',
    goodFor: ['Origin curiosity', 'Organic', 'Filter'],
    note: 'Tribal cooperative-grown from the Araku valley, organic, and unusually clean and floral for Indian coffee. Worth trying purely to taste what Indian arabica can be.',
  },
  {
    id: 'third-wave',
    name: 'Third Wave Coffee Roasters',
    city: 'Bengaluru',
    roastDate: true,
    houseRoast: 58,
    style: 'Approachable, chain-scale',
    goodFor: ['Beginners', 'Milk drinks', 'Availability'],
    note: 'Widely available and consistent, roasting a little darker for a broad audience. Not the most exciting cup, but reliable and easy to find.',
  },
]

/** What to actually check when buying from anyone, including these. */
export const BUYING_CHECKLIST = [
  {
    check: 'Is there a roast date?',
    why: 'Not a best-before. A best-before twelve months out tells you nothing about whether the coffee is drinkable now.',
  },
  {
    check: 'How long ago was it roasted?',
    why: 'You want it to arrive inside two weeks of roasting. Anything over a month old on the shelf is already fading.',
  },
  {
    check: 'Does it say where it is from?',
    why: 'An estate name and a process means someone is accountable for it. "Premium Arabica Blend" means nobody is.',
  },
  {
    check: 'Whole bean or ground?',
    why: 'Buy whole bean. Ground coffee stales in days rather than weeks, which undoes everything else you are paying for.',
  },
  {
    check: 'What size bag?',
    why: 'Buy 250g until you know you like it. A kilo of coffee you are lukewarm about will be stale before you finish it.',
  },
]
