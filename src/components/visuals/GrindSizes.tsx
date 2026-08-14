import { useMemo, useState } from 'react'
import { BREW_METHOD_LABELS, type BrewMethod } from '../../lib/types'

/**
 * Grind size, drawn to scale.
 *
 * "Coarse sand" means nothing until you see it next to "powdered sugar". The
 * particles here are drawn at their real relative sizes, so the espresso patch
 * genuinely is roughly twenty times finer than the French press one.
 */

interface GrindSpec {
  method: BrewMethod
  /** Approximate particle diameter in microns — drives the drawing. */
  microns: number
  label: string
  comparison: string
  note: string
}

const GRINDS: GrindSpec[] = [
  {
    method: 'espresso',
    microns: 250,
    label: 'Very fine',
    comparison: 'powdered sugar',
    note: 'Nine bars of pressure need this much resistance. A grinder that cannot step finely here is simply not an espresso grinder.',
  },
  {
    method: 'moka',
    microns: 400,
    label: 'Fine',
    comparison: 'fine sand',
    note: 'Finer than filter, coarser than espresso. Tamping is wrong here — moka pots do not generate the pressure to push through a compacted puck.',
  },
  {
    method: 'south_indian_filter',
    microns: 500,
    label: 'Fine-medium',
    comparison: 'just past sand',
    note: 'Fine enough for a slow drip over fifteen minutes, coarse enough not to clog the perforated disc.',
  },
  {
    method: 'aeropress',
    microns: 650,
    label: 'Medium-fine',
    comparison: 'table salt',
    note: 'Very forgiving. Short contact time and a paper filter hide a lot of grind inconsistency, which is why it suits a modest grinder.',
  },
  {
    method: 'pourover',
    microns: 850,
    label: 'Medium',
    comparison: 'coarse sand',
    note: 'The reference point for filter coffee. If the brew drains too fast, come finer; if it stalls, go coarser.',
  },
  {
    method: 'french_press',
    microns: 1200,
    label: 'Coarse',
    comparison: 'breadcrumbs',
    note: 'Four minutes of full immersion, and a metal filter that lets fines through. Grind too fine and you get sludge and bitterness.',
  },
]

/** Deterministic PRNG, so the particle layout is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 260
const H = 110

function ParticlePatch({ microns, seed }: { microns: number; seed: number }) {
  const dots = useMemo(() => {
    const rnd = mulberry32(seed)
    // Radius in SVG units, scaled from microns. Particle count falls with the
    // square of size so each patch holds roughly the same volume of coffee.
    const r = (microns / 1200) * 6
    const count = Math.round(2600 / (r * r + 0.6))
    return Array.from({ length: count }, () => ({
      cx: rnd() * (W - 2 * r) + r,
      cy: rnd() * (H - 2 * r) + r,
      // Real grounds are irregular; jitter keeps it from looking like a grid.
      r: r * (0.65 + rnd() * 0.7),
    }))
  }, [microns, seed])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="viz-patch" role="img" aria-hidden="true">
      <rect width={W} height={H} rx="8" fill="var(--surface-alt)" />
      <g fill="var(--mascot-coffee)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>
    </svg>
  )
}

export default function GrindSizes() {
  const [selected, setSelected] = useState<BrewMethod>('pourover')
  const spec = GRINDS.find((g) => g.method === selected)!

  return (
    <div className="stack">
      <div className="chip-row">
        {GRINDS.map((g) => (
          <button
            key={g.method}
            className={`chip${selected === g.method ? ' on' : ''}`}
            onClick={() => setSelected(g.method)}
          >
            {BREW_METHOD_LABELS[g.method]}
          </button>
        ))}
      </div>

      <div className="grind-grid">
        {GRINDS.map((g, i) => (
          <figure
            key={g.method}
            className={`grind-cell${selected === g.method ? ' on' : ''}`}
            onClick={() => setSelected(g.method)}
          >
            <ParticlePatch microns={g.microns} seed={i * 977 + 13} />
            <figcaption>
              <strong>{g.label}</strong>
              <span className="meta">{BREW_METHOD_LABELS[g.method]}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="card">
        <div className="row-between">
          <strong>
            {spec.label} — like {spec.comparison}
          </strong>
          <span className="meta">~{spec.microns} microns</span>
        </div>
        <p style={{ margin: '0.5rem 0 0' }}>{spec.note}</p>
      </div>
    </div>
  )
}
