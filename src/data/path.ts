/**
 * The guided path.
 *
 * The site has always had the pieces — a guide, a timer, a log, diagrams — but
 * no order. A beginner landing on it sees six chapters and half a dozen tools
 * and has no idea what to do first.
 *
 * This is the order. Every step pairs one short idea with one thing to actually
 * do, because coffee is a motor skill and reading about it does very little.
 * The sequence deliberately changes exactly one variable at a time, which is
 * the same discipline the troubleshooter and the brew log enforce.
 */

export interface PathStep {
  id: string
  day: string
  title: string
  /** The idea, in a sentence or two. */
  idea: string
  /** The thing to actually do. */
  task: string
  /** What you are supposed to notice — the point of the exercise. */
  lookFor: string
  /** Optional route to the tool or chapter this step uses. */
  link?: { to: string; label: string }
}

export const PATH: PathStep[] = [
  {
    id: 'baseline',
    day: 'Day 1',
    title: 'Brew one cup, badly, on purpose',
    idea: 'You cannot improve something you have not measured. Before changing anything, get one brew on record exactly as you currently make it.',
    task: 'Brew however you normally do, but weigh the coffee and the water, and time it. Log it.',
    lookFor:
      'Nothing yet. This is the control, and the only brew in the whole sequence where you are not trying to change an outcome.',
    link: { to: '/brew', label: 'Open the timer' },
  },
  {
    id: 'ratio',
    day: 'Day 2',
    title: 'Fix your ratio',
    idea: 'Strength and extraction are different dials. Ratio sets strength: how much coffee is dissolved in how much water. Most people under-dose without knowing.',
    task: 'Brew again at 1:16 exactly — 15g of coffee to 240g of water. Change nothing else.',
    lookFor:
      'Whether it tastes stronger or just different. If it now tastes strong but still sour, your problem was never the dose.',
    link: { to: '/brew', label: 'Open the timer' },
  },
  {
    id: 'grind-finer',
    day: 'Day 3',
    title: 'Grind one step finer',
    idea: 'Grind is the extraction dial. Finer means more surface area and slower flow, so more of the coffee dissolves.',
    task: 'Same coffee, same ratio, same everything — one step finer on the grinder.',
    lookFor:
      'Sweetness arriving, sourness receding, and the brew taking longer to drain. If it turned bitter, you went past the point.',
    link: { to: '/guide/the-variables', label: 'The four variables' },
  },
  {
    id: 'grind-coarser',
    day: 'Day 4',
    title: 'Now go too far the other way',
    idea: 'Knowing what over- and under-extraction taste like is worth more than any recipe, and the only way to learn it is to taste both deliberately.',
    task: 'Brew two cups: one much finer than yesterday, one much coarser. Taste them side by side.',
    lookFor:
      'Sour and empty on one side, harsh and drying on the other. Once you can name these two, you can diagnose almost any bad cup.',
    link: { to: '/fix', label: 'The troubleshooter' },
  },
  {
    id: 'freshness',
    day: 'Day 5',
    title: 'Find out how old your coffee is',
    idea: 'Coffee does not spoil, it fades — and very fresh coffee brews badly too. The window is roughly 4 to 14 days after roasting for filter.',
    task: 'Find the roast date on your bag and add it to the shelf. If there is only a best-before date, note that.',
    lookFor:
      'Whether the coffee you have been fighting was simply outside its window the whole time.',
    link: { to: '/shelf', label: 'Add to your shelf' },
  },
  {
    id: 'temperature',
    day: 'Day 6',
    title: 'Change only the temperature',
    idea: 'Hotter water extracts faster. It is a smaller dial than grind, and useful once grind is roughly right.',
    task: 'Same grind, same ratio. Brew once with water straight off the boil, once left to cool two minutes.',
    lookFor:
      'A smaller difference than you expected. That is the lesson: temperature is a fine adjustment, not a fix.',
  },
  {
    id: 'taste',
    day: 'Day 8',
    title: 'Put words to it',
    idea: 'You cannot adjust toward a taste you cannot name. Eight families is enough vocabulary to start.',
    task: 'Brew your best cup so far and write down three words for it before reading anyone else\'s notes.',
    lookFor:
      'Whether your words match the bag. They often will not, and the bag is not necessarily right.',
    link: { to: '/tasting', label: 'Tasting trainer' },
  },
  {
    id: 'water',
    day: 'Day 10',
    title: 'Fix your water',
    idea: 'Your cup is 98% water. In Delhi that water is either very hard from the tap or nearly empty from an RO unit, and both make coffee worse.',
    task: 'Work out what you are brewing with, and if you are on RO, mix one batch of remineralised water.',
    lookFor:
      'More sweetness and more body from the same beans and the same grind. This is the last 10%, but it is a real 10%.',
    link: { to: '/water', label: 'Water calculator' },
  },
  {
    id: 'repeat',
    day: 'Day 12',
    title: 'Make the same cup three times',
    idea: 'Consistency is the actual skill. Anyone can produce one good cup by accident.',
    task: 'Brew the same recipe three days running, logging each. Change nothing deliberately.',
    lookFor:
      'How much they differ anyway — and which uncontrolled variable is responsible. That is usually your grinder, or your pour.',
    link: { to: '/log', label: 'Your brew log' },
  },
  {
    id: 'own-recipe',
    day: 'Day 14',
    title: 'Write your own recipe',
    idea: 'The point was never to follow the recipe on this site. It was to be able to write one for a coffee nobody has told you about.',
    task: 'Take a new bag and dial it in from scratch: pick a ratio, guess a grind, taste, adjust once, repeat.',
    lookFor:
      'That you now change one thing at a time without being told to. That is the whole thing.',
  },
]
