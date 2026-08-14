import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import Term from '../components/Term'
import { judgeShot, planShot, SHOT_STYLES } from '../lib/espresso'

/**
 * Espresso dial-in.
 *
 * The site leans filter, but espresso is where people struggle most and spend
 * most, so it gets a dedicated tool rather than a paragraph.
 */
export default function Espresso() {
  const [dose, setDose] = useState(18)
  const [styleId, setStyleId] = useState('classic')
  const [actualYield, setActualYield] = useState(36)
  const [seconds, setSeconds] = useState(28)

  const style = SHOT_STYLES.find((s) => s.id === styleId)!
  const plan = planShot(dose, style)
  const verdict = judgeShot(plan, actualYield, seconds)

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Espresso</h1>
          <p className="lede">
            Dialling in is a two-number problem: what ratio you pulled, and how long it took.
            Get those in range and everything else is refinement.
          </p>
        </div>
        <Mascot mood="grinding" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>1. Set your target</h2>
          <div className="rule" />
        </div>

        <div className="chip-row">
          {SHOT_STYLES.map((s) => (
            <button
              key={s.id}
              className={`chip${styleId === s.id ? ' on' : ''}`}
              onClick={() => {
                setStyleId(s.id)
                setActualYield(Math.round(dose * s.ratio))
              }}
            >
              {s.label} · 1:{s.ratio}
            </button>
          ))}
        </div>
        <p className="meta" style={{ marginTop: '0.6rem' }}>
          <strong>{style.suits}.</strong> {style.note}
        </p>

        <div className="card" style={{ marginTop: '1rem' }}>
          <label>
            Dose in the basket: <strong>{dose}g</strong>
            <input
              type="range"
              min={14}
              max={22}
              step={0.5}
              value={dose}
              onChange={(e) => {
                const d = Number(e.target.value)
                setDose(d)
                setActualYield(Math.round(d * style.ratio))
              }}
              style={{ width: '100%' }}
            />
          </label>

          <div className="row-between" style={{ marginTop: '0.8rem' }}>
            <div>
              <span className="meta">Aim for</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{plan.yieldG}g out</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="meta">in</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{plan.timeLabel}</div>
            </div>
          </div>
          <p className="meta" style={{ margin: '0.6rem 0 0' }}>
            Weigh what lands in the cup, not what the machine says. A scale under the cup is
            the single most useful thing you can add to an espresso setup.
          </p>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>2. Pull it, then tell it what happened</h2>
          <div className="rule" />
        </div>

        <div className="card">
          <label>
            Actually got: <strong>{actualYield}g</strong>
            <input
              type="range"
              min={5}
              max={80}
              value={actualYield}
              onChange={(e) => setActualYield(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ display: 'block', marginTop: '0.8rem' }}>
            Took: <strong>{seconds}s</strong>
            <input
              type="range"
              min={5}
              max={60}
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div className={`card verdict ${verdict.outcome}`} style={{ marginTop: '1rem' }}>
          <div className="row-between">
            <strong className="verdict-action">{verdict.headline}</strong>
            <span className="tag">{verdict.outcome}</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>{verdict.action}</p>
          <p className="meta" style={{ margin: '0.5rem 0 0' }}>
            {verdict.detail}
          </p>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Before you spend money</h2>
          <div className="rule" />
        </div>
        <div className="tiles">
          <div className="card">
            <strong>The grinder is the machine</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              Espresso needs finer, more precise grinding than any other method. A ₹40,000
              machine with a ₹5,000 grinder makes worse coffee than the reverse. If your budget
              is fixed, weight it toward the grinder.
            </p>
          </div>
          <div className="card">
            <strong>Pressurised baskets are a trap</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              The double-walled basket most home machines ship with fakes crema by forcing
              water through a pinhole. It hides grind problems, which means you cannot learn
              from what you taste. Switch to a single-walled basket.
            </p>
          </div>
          <div className="card">
            <strong>Rest the beans longer</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              Nine bars of pressure make trapped carbon dioxide far more disruptive than it is
              in filter. Espresso usually wants 10–14 days after roasting, where filter is
              happy at 4–7.
            </p>
          </div>
          <div className="card">
            <strong>Fresh <Term word="tamp">tamping</Term> beats hard tamping</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              Level matters far more than force. An angled tamp guarantees{' '}
              <Term word="channelling" />, and no grind adjustment will save it.
            </p>
          </div>
        </div>

        <div className="empty-actions" style={{ marginTop: '1rem' }}>
          <Link to="/grinders" className="btn">
            Grinders that can do espresso
          </Link>
          <Link to="/shelf" className="btn secondary">
            Check your beans have rested
          </Link>
        </div>
      </section>
    </div>
  )
}
