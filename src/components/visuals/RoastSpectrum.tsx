import { useState } from 'react'

/**
 * The roast spectrum, as a thing you can click rather than a paragraph.
 *
 * The single most useful mental model for a beginner: roast level trades
 * origin character for roast character, and the two move in opposite
 * directions along one axis.
 */

interface Roast {
  name: string
  bean: string
  temp: string
  /** 0-100 bars. */
  acidity: number
  body: number
  origin: number
  notes: string[]
  blurb: string
}

const ROASTS: Roast[] = [
  {
    name: 'Light',
    bean: '#c08a4e',
    temp: 'Dropped just after first crack, ~196°C',
    acidity: 92,
    body: 25,
    origin: 95,
    notes: ['floral', 'citrus', 'berry', 'tea-like'],
    blurb:
      'Maximum origin character. You taste the farm, the altitude and the processing. Also the least forgiving to brew — under-extract it and it reads as sour rather than bright.',
  },
  {
    name: 'Medium-light',
    bean: '#a86b35',
    temp: '~200°C',
    acidity: 75,
    body: 40,
    origin: 80,
    notes: ['stone fruit', 'honey', 'orange'],
    blurb:
      'Where most specialty filter coffee sits. Keeps the fruit but adds enough sweetness and body that a slightly imperfect brew still tastes good.',
  },
  {
    name: 'Medium',
    bean: '#8b5527',
    temp: '~205°C',
    acidity: 52,
    body: 58,
    origin: 58,
    notes: ['caramel', 'almond', 'brown sugar'],
    blurb:
      'The comfortable middle, and the safest place to start if you are coming from commodity coffee. Balanced enough to work black or with a little milk.',
  },
  {
    name: 'Medium-dark',
    bean: '#663c1e',
    temp: 'Into second crack, ~215°C',
    acidity: 30,
    body: 78,
    origin: 30,
    notes: ['dark chocolate', 'toffee', 'walnut'],
    blurb:
      'Roast character starts to dominate. Oils appear on the bean surface. This is where espresso blends built for milk usually land.',
  },
  {
    name: 'Dark',
    bean: '#3d2415',
    temp: '~225°C and beyond',
    acidity: 12,
    body: 92,
    origin: 8,
    notes: ['smoke', 'bittersweet', 'charred'],
    blurb:
      'Origin is essentially gone — a dark-roast Ethiopian and a dark-roast Brazilian taste much the same, which is exactly why commodity roasters go here. Heavy, low acid, and it cuts through milk and sugar.',
  },
]

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div className="row-between" style={{ marginBottom: '0.2rem' }}>
        <span className="meta">{label}</span>
        <span className="meta">{value}</span>
      </div>
      <div className="progress">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function RoastSpectrum() {
  const [selected, setSelected] = useState(2)
  const roast = ROASTS[selected]

  return (
    <div className="stack">
      <svg viewBox="0 0 500 96" className="viz" role="img" aria-label="Roast level spectrum">
        <defs>
          <linearGradient id="roast-grad" x1="0" x2="1">
            {ROASTS.map((r, i) => (
              <stop key={r.name} offset={i / (ROASTS.length - 1)} stopColor={r.bean} />
            ))}
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="480" height="30" rx="15" fill="url(#roast-grad)" />

        {ROASTS.map((r, i) => {
          const x = 10 + (480 / ROASTS.length) * (i + 0.5)
          const on = i === selected
          return (
            <g
              key={r.name}
              onClick={() => setSelected(i)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${r.name} roast`}
            >
              {/* generous invisible hit area */}
              <rect x={x - 48} y="0" width="96" height="96" fill="transparent" />
              {/* The bar is always brown, in either theme, so a light ring
                  keeps the dark-roast marker from disappearing into it. */}
              <circle
                cx={x}
                cy="25"
                r={on ? 13 : 9}
                fill={r.bean}
                stroke={on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)'}
                strokeWidth={on ? 3 : 2}
              />
              <text
                x={x}
                y="66"
                textAnchor="middle"
                fontSize="12"
                fontWeight={on ? 700 : 400}
                fill={on ? 'var(--text)' : 'var(--text-muted)'}
              >
                {r.name}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="card">
        <div className="row-between">
          <strong>{roast.name} roast</strong>
          <span className="meta">{roast.temp}</span>
        </div>
        <p style={{ margin: '0.5rem 0 0' }}>{roast.blurb}</p>

        <div className="chip-row" style={{ margin: '0.7rem 0' }}>
          {roast.notes.map((n) => (
            <span key={n} className="tag">
              {n}
            </span>
          ))}
        </div>

        <Bar label="Acidity" value={roast.acidity} />
        <Bar label="Body" value={roast.body} />
        <Bar label="Origin character" value={roast.origin} />
      </div>
    </div>
  )
}
