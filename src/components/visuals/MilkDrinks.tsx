/**
 * What is actually in the cup.
 *
 * Every cafe menu assumes you know the difference between a flat white and a
 * latte. Almost nobody does, and the honest answer is just proportions — so
 * draw the proportions, to scale, side by side.
 */

interface Drink {
  name: string
  /** Millilitres. */
  espresso: number
  milk: number
  foam: number
  chocolate?: number
  note: string
}

const DRINKS: Drink[] = [
  {
    name: 'Espresso',
    espresso: 30,
    milk: 0,
    foam: 0,
    note: 'The base for everything else. About 30ml from 18g of coffee, in 25–30 seconds.',
  },
  {
    name: 'Macchiato',
    espresso: 30,
    milk: 0,
    foam: 15,
    note: '"Stained" — an espresso with a spoon of foam on top. Not the caramel dessert of the same name.',
  },
  {
    name: 'Cortado',
    espresso: 30,
    milk: 30,
    foam: 5,
    note: 'Equal parts espresso and warm milk, barely any foam. The move if a latte tastes too milky to you.',
  },
  {
    name: 'Flat white',
    espresso: 60,
    milk: 110,
    foam: 10,
    note: 'Double shot, steamed milk, a thin layer of microfoam. Stronger and less foamy than a latte — the coffee still leads.',
  },
  {
    name: 'Cappuccino',
    espresso: 30,
    milk: 60,
    foam: 60,
    note: 'Classically equal thirds: espresso, milk, foam. Much foamier and drier than a latte.',
  },
  {
    name: 'Latte',
    espresso: 30,
    milk: 190,
    foam: 20,
    note: 'The mildest of the milk drinks. If your coffee tastes weak here, the fix is a second shot, not a different bean.',
  },
  {
    name: 'Mocha',
    espresso: 30,
    milk: 150,
    foam: 20,
    chocolate: 30,
    note: 'A latte with chocolate. Genuinely good with a dark roast, where the bittersweetness lines up.',
  },
  {
    name: 'Filter coffee',
    espresso: 0,
    milk: 0,
    foam: 0,
    note: 'For scale: a mug of filter coffee is around 250ml of brewed coffee, no milk, no espresso involved at all.',
  },
]

const MAX_ML = 250
const CUP_H = 118
const CUP_W = 74

function Cup({ drink }: { drink: Drink }) {
  const brewed = drink.espresso === 0 && drink.milk === 0 ? 250 : 0
  const total = drink.espresso + drink.milk + drink.foam + (drink.chocolate ?? 0) + brewed
  const scale = CUP_H / MAX_ML

  // Stack from the bottom up, in the order they sit in a real cup.
  const layers = [
    { ml: drink.chocolate ?? 0, fill: '#4a2c18' },
    { ml: drink.espresso, fill: '#5b3218' },
    { ml: brewed, fill: '#6b3d1f' },
    { ml: drink.milk, fill: '#f2e4d2' },
    { ml: drink.foam, fill: '#fdf6ec' },
  ].filter((l) => l.ml > 0)

  let y = CUP_H
  const rects = layers.map((l, i) => {
    const h = l.ml * scale
    y -= h
    return <rect key={i} x="0" y={y} width={CUP_W} height={h} fill={l.fill} />
  })

  return (
    <figure className="drink-cell">
      <svg viewBox={`0 0 ${CUP_W + 22} ${CUP_H + 16}`} role="img" aria-label={drink.name}>
        <defs>
          <clipPath id={`cup-${drink.name.replace(/\s/g, '')}`}>
            <path d={`M0 0 h${CUP_W} v${CUP_H - 16} q0 16 -16 16 h-${CUP_W - 32} q-16 0 -16 -16 z`} />
          </clipPath>
        </defs>

        {/* handle */}
        <path
          d={`M${CUP_W + 2} 22 q18 0 18 22 t-18 22`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
        />

        <g clipPath={`url(#cup-${drink.name.replace(/\s/g, '')})`}>
          {/* Deliberately a cool neutral, not a theme surface colour: a warm
              brown "empty" reads as a cup already full of espresso. */}
          <rect width={CUP_W} height={CUP_H} fill="var(--cup-empty)" />
          {rects}
        </g>

        <path
          d={`M0 0 h${CUP_W} v${CUP_H - 16} q0 16 -16 16 h-${CUP_W - 32} q-16 0 -16 -16 z`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
      </svg>

      <figcaption>
        <strong>{drink.name}</strong>
        <span className="meta">{total}ml</span>
      </figcaption>
    </figure>
  )
}

export default function MilkDrinks() {
  return (
    <div className="stack">
      <div className="drink-grid">
        {DRINKS.map((d) => (
          <Cup key={d.name} drink={d} />
        ))}
      </div>

      <div className="legend">
        <span>
          <i style={{ background: '#5b3218' }} /> espresso
        </span>
        <span>
          <i style={{ background: '#6b3d1f' }} /> brewed coffee
        </span>
        <span>
          <i style={{ background: '#f2e4d2' }} /> steamed milk
        </span>
        <span>
          <i style={{ background: '#fdf6ec' }} /> foam
        </span>
        <span>
          <i style={{ background: '#4a2c18' }} /> chocolate
        </span>
      </div>

      <div className="grid">
        {DRINKS.map((d) => (
          <div key={d.name} className="card">
            <strong>{d.name}</strong>
            <p className="meta" style={{ margin: '0.25rem 0 0' }}>
              {d.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
