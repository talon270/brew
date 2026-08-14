import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { PATH } from '../data/path'
import { usePath } from '../lib/path'

/**
 * The two-week path.
 *
 * The one page that gives the rest of the site an order. Steps can be ticked
 * out of sequence — people will skip ahead regardless, and pretending otherwise
 * just makes the page feel broken.
 */
export default function Path() {
  const { done, toggle, reset, next, percent } = usePath()

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Two weeks to decent coffee</h1>
          <p className="lede">
            Fourteen days, one idea each, and something to actually brew every time. Each
            step changes exactly one variable — which is the entire skill, dressed up as a
            schedule.
          </p>
        </div>
        <Mascot mood={percent === 100 ? 'delighted' : 'happy'} size={104} />
      </div>

      <section>
        <div className="row-between">
          <strong>
            {done.length} of {PATH.length} done
          </strong>
          <span className="meta">{percent}%</span>
        </div>
        <div className="progress" style={{ marginTop: '0.4rem' }}>
          <div style={{ width: `${percent}%`, background: 'var(--accent)' }} />
        </div>

        {next && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <span className="meta">Next up — {next.day}</span>
            <strong style={{ display: 'block', fontSize: '1.05rem' }}>{next.title}</strong>
            <p style={{ margin: '0.4rem 0 0' }}>{next.task}</p>
            {next.link && (
              <div style={{ marginTop: '0.8rem' }}>
                <Link to={next.link.to} className="btn">
                  {next.link.label}
                </Link>
              </div>
            )}
          </div>
        )}

        {percent === 100 && (
          <div className="notice" style={{ marginTop: '1rem' }}>
            <strong>That's the sequence.</strong> Everything after this is repetition with
            different beans — which is genuinely all that is left. Keep logging, and the
            trend in your ratings will tell you more than any guide.
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>The whole sequence</h2>
          <div className="rule" />
        </div>

        <ol className="path-list">
          {PATH.map((step) => {
            const complete = done.includes(step.id)
            return (
              <li key={step.id} className={`card path-step${complete ? ' done' : ''}`}>
                <div className="row-between">
                  <span className="meta">{step.day}</span>
                  <label className="path-check">
                    <input
                      type="checkbox"
                      checked={complete}
                      onChange={() => toggle(step.id)}
                    />
                    <span>{complete ? 'Done' : 'Mark done'}</span>
                  </label>
                </div>

                <strong style={{ display: 'block', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                  {step.title}
                </strong>
                <p style={{ margin: '0.45rem 0 0' }}>{step.idea}</p>

                <div className="path-task">
                  <strong>Do this:</strong> {step.task}
                </div>
                <div className="meta" style={{ marginTop: '0.5rem' }}>
                  <strong>What to notice:</strong> {step.lookFor}
                </div>

                {step.link && (
                  <div style={{ marginTop: '0.7rem' }}>
                    <Link to={step.link.to} className="btn secondary">
                      {step.link.label}
                    </Link>
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        {done.length > 0 && (
          <button className="btn secondary" style={{ marginTop: '1rem' }} onClick={reset}>
            Reset progress
          </button>
        )}
      </section>
    </div>
  )
}
