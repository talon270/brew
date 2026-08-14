import { useState } from 'react'

/**
 * What a coffee bean actually is.
 *
 * Worth a diagram because the answer is genuinely surprising: it is a seed,
 * from a fruit, and almost every processing decision is about how you get the
 * fruit off the seed.
 */

interface Layer {
  id: string
  name: string
  r: number
  colour: string
  text: string
}

// Outermost first, so they render back-to-front.
const LAYERS: Layer[] = [
  {
    id: 'skin',
    name: 'Skin (exocarp)',
    r: 96,
    colour: '#b3352f',
    text: 'The outer skin. Deep red when ripe — pickers judge ripeness by colour, and unripe cherries are where a lot of grassy, vegetal off-flavour comes from.',
  },
  {
    id: 'pulp',
    name: 'Pulp (mesocarp)',
    r: 80,
    colour: '#d4635a',
    text: 'Sweet fruit flesh. You can eat it — it tastes faintly of lychee. In natural processing this is left on to dry, which is what drives those big fermented-fruit flavours.',
  },
  {
    id: 'mucilage',
    name: 'Mucilage',
    r: 66,
    colour: '#e8a76a',
    text: 'A sticky sugar-rich layer clinging to the seed. How much of it you leave on is precisely what separates washed, honey and natural processing.',
  },
  {
    id: 'parchment',
    name: 'Parchment (endocarp)',
    r: 54,
    colour: '#e9dcc3',
    text: 'A papery shell. Coffee is usually stored and shipped in parchment, then hulled shortly before export to keep the seed protected.',
  },
  {
    id: 'silverskin',
    name: 'Silverskin',
    r: 45,
    colour: '#cfc3ad',
    text: 'A thin membrane on the seed itself. It flakes off during roasting as chaff — the papery debris in your grinder.',
  },
  {
    id: 'bean',
    name: 'The seed',
    r: 38,
    colour: '#8faa62',
    text: 'The bean. Green and grassy before roasting, with almost none of the aroma you associate with coffee — all of that is created by the roast.',
  },
]

export default function CherryAnatomy() {
  const [selected, setSelected] = useState('bean')
  const layer = LAYERS.find((l) => l.id === selected)!

  return (
    <div className="wheel-layout">
      <svg viewBox="0 0 220 220" className="wheel" role="img" aria-label="Coffee cherry cross-section">
        {LAYERS.map((l) => (
          <circle
            key={l.id}
            cx="110"
            cy="110"
            r={l.r}
            fill={l.colour}
            stroke={selected === l.id ? 'var(--text)' : 'var(--surface)'}
            strokeWidth={selected === l.id ? 3 : 1.5}
            onClick={() => setSelected(l.id)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* the centre crease that makes a coffee seed recognisable */}
        <path
          d="M110 74 q-9 36 0 72"
          stroke="#6f8848"
          strokeWidth="4"
          fill="none"
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      <div style={{ flex: '1 1 260px' }}>
        <div className="chip-row" style={{ marginBottom: '0.7rem' }}>
          {LAYERS.map((l) => (
            <button
              key={l.id}
              className={`chip${selected === l.id ? ' on' : ''}`}
              onClick={() => setSelected(l.id)}
            >
              {l.name.split(' (')[0]}
            </button>
          ))}
        </div>
        <div className="card">
          <strong>{layer.name}</strong>
          <p style={{ margin: '0.4rem 0 0' }}>{layer.text}</p>
        </div>
      </div>
    </div>
  )
}
