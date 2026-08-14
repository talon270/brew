import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { BUYING_ORDER, GEAR, GEAR_KIND_LABELS, type GearKind } from '../data/gear'
import { rupees } from '../lib/format'

/**
 * Everything that is not a grinder.
 *
 * Ordered by buying priority rather than price, because the useful question is
 * "what should I get next", not "what is cheapest".
 */
export default function Gear() {
  const [kind, setKind] = useState<GearKind | null>(null)

  const items = [...GEAR]
    .filter((g) => !kind || g.kind === kind)
    .sort((a, b) => a.priority - b.priority || a.priceInr - b.priceInr)

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>The rest of the kit</h1>
          <p className="lede">
            The grinder question is answered elsewhere. This is everything after it, in the
            order worth buying — including the things you can skip.
          </p>
        </div>
        <Mascot mood="thinking" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>If you are starting from nothing</h2>
          <div className="rule" />
        </div>
        <ol className="path-list">
          {BUYING_ORDER.map((s) => (
            <li key={s.step} className="card">
              <span className="meta">{s.step}</span>
              <strong style={{ display: 'block', fontSize: '1.02rem' }}>{s.what}</strong>
              <p className="meta" style={{ margin: '0.35rem 0 0' }}>
                {s.why}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="section-head">
          <h2>Everything, ranked</h2>
          <div className="rule" />
        </div>

        <div className="chip-row">
          <button className={`chip${kind === null ? ' on' : ''}`} onClick={() => setKind(null)}>
            All
          </button>
          {(Object.keys(GEAR_KIND_LABELS) as GearKind[]).map((k) => (
            <button key={k} className={`chip${kind === k ? ' on' : ''}`} onClick={() => setKind(k)}>
              {GEAR_KIND_LABELS[k]}
            </button>
          ))}
        </div>

        <div className="grid" style={{ marginTop: '1rem' }}>
          {items.map((g) => (
            <div key={g.id} className="card">
              <div className="row-between">
                <strong>{g.name}</strong>
                <span className="price">{rupees(g.priceInr)}</span>
              </div>
              <div className="meta" style={{ marginBottom: '0.5rem' }}>
                {GEAR_KIND_LABELS[g.kind]} ·{' '}
                {g.priority === 1 ? 'Buy early' : g.priority === 2 ? 'Worth having' : 'Later, if ever'}
              </div>
              <p style={{ margin: 0, fontSize: '0.93rem' }}>{g.verdict}</p>
              {g.skipIf && <div className="caveat">! Skip it if: {g.skipIf}</div>}
            </div>
          ))}
        </div>

        <div className="notice" style={{ marginTop: '1rem' }}>
          Prices are approximate and move constantly — they are here to show tiers, not to be
          quoted. Nothing on this page is an affiliate link and nobody has paid to appear.
        </div>

        <div className="empty-actions" style={{ marginTop: '1rem' }}>
          <Link to="/grinders" className="btn">
            The grinder question
          </Link>
        </div>
      </section>
    </div>
  )
}
