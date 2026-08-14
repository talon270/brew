import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { diagnose, SYMPTOMS, type Symptom } from '../lib/diagnose'
import { BREW_METHODS, BREW_METHOD_LABELS, type BrewMethod } from '../lib/types'

/**
 * The troubleshooter.
 *
 * You have a bad cup in your hand and you want one instruction. Two taps to a
 * single answer, with the reasoning underneath so the model sticks.
 */
export default function Fix() {
  const [method, setMethod] = useState<BrewMethod | null>(null)
  const [symptom, setSymptom] = useState<Symptom | null>(null)

  const result = method && symptom ? diagnose(symptom, method) : null

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Something's wrong</h1>
          <p className="lede">
            Tell it what you brewed and what it tasted like. You will get one change to make
            — not a list, because changing three things at once teaches you nothing.
          </p>
        </div>
        <Mascot mood={result ? 'thinking' : 'worried'} size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>1. How did you brew it?</h2>
          <div className="rule" />
        </div>
        <div className="chip-row">
          {BREW_METHODS.map((m) => (
            <button
              key={m}
              className={`chip${method === m ? ' on' : ''}`}
              onClick={() => setMethod(m)}
            >
              {BREW_METHOD_LABELS[m]}
            </button>
          ))}
        </div>
      </section>

      {method && (
        <section>
          <div className="section-head">
            <h2>2. What is wrong with it?</h2>
            <div className="rule" />
          </div>
          <div className="grid">
            {SYMPTOMS.map((s) => (
              <button
                key={s.id}
                className={`card symptom${symptom === s.id ? ' on' : ''}`}
                onClick={() => setSymptom(s.id)}
              >
                <strong>{s.label}</strong>
                <span className="meta">{s.hint}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {result && (
        <section>
          <div className="section-head">
            <h2>Change this</h2>
            <div className="rule" />
          </div>

          <div className="card verdict">
            <strong className="verdict-action">{result.action}</strong>
            <p style={{ margin: '0.6rem 0 0' }}>{result.because}</p>
          </div>

          {result.caveats.map((c) => (
            <div key={c} className="caveat" style={{ marginTop: '0.6rem' }}>
              ! {c}
            </div>
          ))}

          <div className="card" style={{ marginTop: '1rem' }}>
            <strong>Only if that does not work</strong>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
              {result.thenTry.map((t) => (
                <li key={t} style={{ marginBottom: '0.3rem' }}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="meta" style={{ margin: '0.7rem 0 0' }}>
              Work down this list one item at a time, brewing in between. If you change two
              things and it improves, you have learned nothing about which one did it.
            </p>
          </div>

          <div className="empty-actions" style={{ marginTop: '1rem' }}>
            <Link to={`/log?method=${method}`} className="btn">
              Log the next brew
            </Link>
            <Link to="/guide/troubleshooting" className="btn secondary">
              Read the full chapter
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
