import type { Match } from '../lib/types'
import type { GrinderMatch } from '../lib/matching'
import type { Bean } from '../lib/types'
import { BREW_METHOD_LABELS } from '../lib/types'

function rupees(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`
}

function Reasons({ reasons, caveats }: { reasons: string[]; caveats: string[] }) {
  if (reasons.length === 0 && caveats.length === 0) return null
  return (
    <>
      {reasons.length > 0 && (
        <ul className="reasons">
          {reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      {caveats.length > 0 && (
        <ul className="caveats">
          {caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export function GrinderCard({ match }: { match: GrinderMatch }) {
  const g = match.item
  return (
    <article className="card">
      <div className="row-between">
        <div>
          <strong>
            {g.brand} {g.model}
          </strong>
          <div className="meta">
            {g.powered === 'manual' ? 'Hand grinder' : 'Electric'} ·{' '}
            {g.burrType === 'blade'
              ? 'blade'
              : `${g.burrSizeMm ? `${g.burrSizeMm}mm ` : ''}${g.burrType.replace('_', ' ')} burrs`}
          </div>
        </div>
        <span className="price">{rupees(g.priceInr)}</span>
      </div>

      <p style={{ marginBottom: 0 }}>{g.verdict}</p>

      <Reasons reasons={match.reasons} caveats={match.caveats} />

      {g.sourceUrl && (
        <p className="meta" style={{ marginTop: '0.6rem' }}>
          <a href={g.sourceUrl} target="_blank" rel="noreferrer noopener">
            Source
          </a>
        </p>
      )}
    </article>
  )
}

export function BeanCard({ match }: { match: Match<Bean> }) {
  const b = match.item
  return (
    <article className="card">
      <div className="row-between">
        <div>
          <strong>
            {b.roaster} — {b.name}
          </strong>
          <div className="meta">
            {b.origin} · {b.process} · {b.weightG}g
          </div>
        </div>
        <span className="price">{rupees(b.priceInr)}</span>
      </div>

      <div className="chip-row" style={{ marginTop: '0.6rem' }}>
        {b.flavourNotes.map((n) => (
          <span key={n} className="tag">
            {n}
          </span>
        ))}
      </div>

      <Reasons reasons={match.reasons} caveats={match.caveats} />

      {b.goodFor.length > 0 && (
        <p className="meta" style={{ marginTop: '0.6rem', marginBottom: 0 }}>
          Best brewed as {b.goodFor.map((m) => BREW_METHOD_LABELS[m].toLowerCase()).join(', ')}
        </p>
      )}
    </article>
  )
}
