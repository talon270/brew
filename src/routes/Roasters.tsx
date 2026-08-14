import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { BUYING_CHECKLIST, ROASTERS } from '../data/roasters'

/**
 * Who to buy from.
 *
 * The bean list answers "what should I try"; this answers the longer-lived
 * question. Sorted so the roasters printing roast dates come first, because
 * that is the single most useful signal on a bag.
 */
export default function Roasters() {
  const sorted = [...ROASTERS].sort(
    (a, b) => Number(b.roastDate) - Number(a.roastDate) || a.name.localeCompare(b.name),
  )

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Indian roasters</h1>
          <p className="lede">
            India grows coffee, which means you can buy it fresher here than almost anywhere
            — if you buy from someone who tells you when they roasted it.
          </p>
        </div>
        <Mascot mood="happy" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>What to check on any bag</h2>
          <div className="rule" />
        </div>
        <div className="grid">
          {BUYING_CHECKLIST.map((c) => (
            <div key={c.check} className="card">
              <strong>{c.check}</strong>
              <p className="meta" style={{ margin: '0.3rem 0 0' }}>
                {c.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Roasters that ship nationally</h2>
          <div className="rule" />
        </div>

        <div className="grid">
          {sorted.map((r) => (
            <div key={r.id} className="card">
              <div className="row-between">
                <strong>{r.name}</strong>
                {r.roastDate && <span className="tag good">roast date</span>}
              </div>
              <div className="meta" style={{ marginBottom: '0.5rem' }}>
                {r.city} · {r.style}
              </div>
              <p style={{ margin: 0, fontSize: '0.93rem' }}>{r.note}</p>
              <div className="chip-row" style={{ marginTop: '0.6rem' }}>
                {r.goodFor.map((g) => (
                  <span key={g} className="tag">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="notice" style={{ marginTop: '1rem' }}>
          Nobody has paid to be listed and there are no affiliate links. This is a starting
          point rather than a ranking — roasters change, and the only real test is a bag on
          your own grinder.
        </div>

        <div className="empty-actions" style={{ marginTop: '1rem' }}>
          <Link to="/beans" className="btn">
            Specific beans to try
          </Link>
          <Link to="/shelf" className="btn secondary">
            Track what you have open
          </Link>
        </div>
      </section>
    </div>
  )
}
