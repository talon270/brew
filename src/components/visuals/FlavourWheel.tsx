import { useState } from 'react'

/**
 * A simplified flavour wheel.
 *
 * The full SCA wheel has around a hundred descriptors and is overwhelming as a
 * first encounter. Eight families is enough to give someone the vocabulary to
 * say what they taste, which is the actual goal.
 */

interface Family {
  name: string
  colour: string
  examples: string[]
  where: string
}

const FAMILIES: Family[] = [
  {
    name: 'Fruity',
    colour: '#c8433f',
    examples: ['berry', 'stone fruit', 'apple', 'tropical'],
    where: 'Light roasts, and especially natural-process coffees where the fruit dries on the bean.',
  },
  {
    name: 'Floral',
    colour: '#c26a9c',
    examples: ['jasmine', 'rose', 'chamomile', 'tea-like'],
    where: 'Delicate and easy to lose. Ethiopian washed lots at a light roast are the classic source.',
  },
  {
    name: 'Sweet',
    colour: '#d99b3c',
    examples: ['honey', 'caramel', 'brown sugar', 'vanilla'],
    where: 'Medium roasts. Sweetness is mostly a sign of good extraction, not just the bean.',
  },
  {
    name: 'Nutty / cocoa',
    colour: '#9a6b3f',
    examples: ['almond', 'hazelnut', 'milk chocolate', 'malt'],
    where: 'Medium to medium-dark. The backbone of most Indian washed coffees and espresso blends.',
  },
  {
    name: 'Spice',
    colour: '#a8553c',
    examples: ['cinnamon', 'clove', 'pepper', 'cardamom'],
    where: 'Often in monsooned and Indonesian coffees, and in darker Indian roasts.',
  },
  {
    name: 'Roasted',
    colour: '#5c3a24',
    examples: ['dark chocolate', 'smoke', 'toast', 'tobacco'],
    where: 'Dark roasts. This is roast character rather than origin character.',
  },
  {
    name: 'Green / vegetal',
    colour: '#5f7f4a',
    examples: ['grassy', 'peapod', 'herbal', 'raw'],
    where: 'Usually a defect — under-developed roasting or under-ripe cherries.',
  },
  {
    name: 'Fermented',
    colour: '#7b4a86',
    examples: ['wine', 'boozy', 'funky', 'overripe'],
    where: 'Anaerobic and extended-ferment processing. Deliberate and prized when controlled, a fault when not.',
  },
]

const CX = 150
const CY = 150
const R_INNER = 52
const R_OUTER = 132

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function segmentPath(start: number, end: number, rIn: number, rOut: number): string {
  const p1 = polar(CX, CY, rOut, start)
  const p2 = polar(CX, CY, rOut, end)
  const p3 = polar(CX, CY, rIn, end)
  const p4 = polar(CX, CY, rIn, start)
  const large = end - start > 180 ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

export default function FlavourWheel() {
  const [selected, setSelected] = useState(0)
  const family = FAMILIES[selected]
  const step = 360 / FAMILIES.length

  return (
    <div className="wheel-layout">
      <svg viewBox="0 0 300 300" className="wheel" role="img" aria-label="Coffee flavour wheel">
        {FAMILIES.map((f, i) => {
          const start = i * step + 1
          const end = (i + 1) * step - 1
          const on = i === selected
          const mid = polar(CX, CY, (R_INNER + R_OUTER) / 2, (start + end) / 2)
          return (
            <g
              key={f.name}
              onClick={() => setSelected(i)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={f.name}
            >
              <path
                d={segmentPath(start, end, R_INNER, on ? R_OUTER + 8 : R_OUTER)}
                fill={f.colour}
                opacity={on ? 1 : 0.68}
                stroke="var(--surface)"
                strokeWidth="2"
              />
              <text
                x={mid.x}
                y={mid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10.5"
                fontWeight="600"
                fill="#fff"
                style={{ pointerEvents: 'none' }}
              >
                {f.name.split(' / ')[0]}
              </text>
            </g>
          )
        })}

        <circle cx={CX} cy={CY} r={R_INNER - 4} fill="var(--surface)" stroke="var(--border)" />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="var(--text)"
        >
          Flavour
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="12" fill="var(--text-muted)">
          families
        </text>
      </svg>

      <div className="card" style={{ flex: '1 1 260px' }}>
        <strong style={{ color: family.colour }}>{family.name}</strong>
        <div className="chip-row" style={{ margin: '0.6rem 0' }}>
          {family.examples.map((e) => (
            <span key={e} className="tag">
              {e}
            </span>
          ))}
        </div>
        <p className="meta" style={{ margin: 0 }}>
          {family.where}
        </p>
      </div>
    </div>
  )
}
