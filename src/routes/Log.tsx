import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { BEANS } from '../data/beans'
import { RECIPES, formatClock } from '../data/recipes'
import { computeStats, nextStepAdvice, useBrewLog, type Taste } from '../lib/log'
import { BREW_METHODS, BREW_METHOD_LABELS, type BrewMethod } from '../lib/types'

const TASTES: { value: Taste; label: string; hint: string }[] = [
  { value: 'sour', label: 'Sour / sharp', hint: 'under-extracted' },
  { value: 'balanced', label: 'Balanced', hint: 'nailed it' },
  { value: 'bitter', label: 'Bitter / harsh', hint: 'over-extracted' },
]

export default function Log() {
  const { entries, add, remove, loaded } = useBrewLog()
  const [params] = useSearchParams()

  // The timer links here with the brew it just finished.
  const seededMethod = (params.get('method') as BrewMethod | null) ?? 'pourover'
  const seededDose = Number(params.get('dose')) || RECIPES[seededMethod].defaultDoseG
  const seededSeconds = Number(params.get('seconds')) || undefined

  const [open, setOpen] = useState(params.has('method'))
  const [method, setMethod] = useState<BrewMethod>(seededMethod)
  const [doseG, setDoseG] = useState(seededDose)
  const [beanKey, setBeanKey] = useState('')
  const [grindSetting, setGrindSetting] = useState('')
  const [rating, setRating] = useState(3)
  const [taste, setTaste] = useState<Taste | undefined>()
  const [notes, setNotes] = useState('')

  if (!loaded) return null

  const stats = computeStats(entries)
  const waterMl = Math.round(doseG * RECIPES[method].ratio)

  function save() {
    const bean = BEANS.find((b) => b.id === beanKey)
    add({
      method,
      doseG,
      waterMl,
      beanId: bean?.id,
      beanName: bean ? `${bean.roaster} — ${bean.name}` : undefined,
      grindSetting: grindSetting.trim() || undefined,
      seconds: seededSeconds,
      rating,
      taste,
      notes: notes.trim() || undefined,
    })
    setOpen(false)
    setNotes('')
    setTaste(undefined)
  }

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Your brews</h1>
          <p className="lede">
            Note what you did and how it tasted. The point isn't record-keeping — it's that
            "what did I change last time?" is the question every dial-in depends on, and
            nobody remembers.
          </p>
        </div>
        <Mascot mood={entries.length > 0 ? 'delighted' : 'sleepy'} size={100} />
      </div>

      {entries.length > 0 && (
        <div className="card stat-row">
          <div>
            <strong>{stats.total}</strong>
            brews logged
          </div>
          <div>
            <strong>{stats.last7Days}</strong>
            this week
          </div>
          <div>
            <strong>{stats.averageRating?.toFixed(1) ?? '—'}</strong>
            average rating
          </div>
          {stats.favouriteMethod && (
            <div>
              <strong>{BREW_METHOD_LABELS[stats.favouriteMethod]}</strong>
              most brewed
            </div>
          )}
          {stats.trend !== null && Math.abs(stats.trend) >= 0.2 && (
            <div>
              <strong style={{ color: stats.trend > 0 ? 'var(--good)' : 'var(--warn)' }}>
                {stats.trend > 0 ? '↑' : '↓'} {Math.abs(stats.trend).toFixed(1)}
              </strong>
              recent trend
            </div>
          )}
        </div>
      )}

      {!open ? (
        // With no entries the empty state below carries the call to action,
        // so this button would just be the same thing twice.
        entries.length > 0 && (
          <div>
            <button className="btn" onClick={() => setOpen(true)}>
              Log a brew
            </button>
          </div>
        )
      ) : (
        <div className="card stack">
          <strong>Log a brew</strong>

          <div>
            <span className="meta">Method</span>
            <div className="chip-row" style={{ marginTop: '0.4rem' }}>
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
          </div>

          <div>
            <label className="meta" htmlFor="bean">
              Bean
            </label>
            <br />
            <select id="bean" value={beanKey} onChange={(e) => setBeanKey(e.target.value)}>
              <option value="">Not listed / something else</option>
              {BEANS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.roaster} — {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="calc-out">
            <div>
              <label className="meta" htmlFor="dose">
                Dose (g)
              </label>
              <br />
              <input
                id="dose"
                type="number"
                min={5}
                max={100}
                value={doseG}
                onChange={(e) => setDoseG(Number(e.target.value))}
                style={{ width: '5.5rem' }}
              />
            </div>
            <div>
              <label className="meta" htmlFor="grind">
                Grind setting
              </label>
              <br />
              <input
                id="grind"
                type="text"
                placeholder="e.g. 18 clicks"
                value={grindSetting}
                onChange={(e) => setGrindSetting(e.target.value)}
                style={{ width: '9rem' }}
              />
            </div>
            <div>
              <span className="meta">Water</span>
              <br />
              <strong style={{ fontSize: '1.1rem' }}>{waterMl}ml</strong>
            </div>
          </div>

          <div>
            <span className="meta">How did it taste?</span>
            <div className="chip-row" style={{ marginTop: '0.4rem' }}>
              {TASTES.map((t) => (
                <button
                  key={t.value}
                  className={`chip${taste === t.value ? ' on' : ''}`}
                  onClick={() => setTaste(t.value)}
                  title={t.hint}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="meta" htmlFor="rating">
              Rating: {rating} / 5
            </label>
            <input
              id="rating"
              type="range"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="meta" htmlFor="notes">
              Notes
            </label>
            <br />
            <input
              id="notes"
              type="text"
              placeholder="Anything worth remembering"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {nextStepAdvice(taste) && <div className="notice">{nextStepAdvice(taste)}</div>}

          <div className="chip-row">
            <button className="btn" onClick={save}>
              Save
            </button>
            <button className="btn secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        !open && (
          <div className="card empty-state">
            <Mascot mood="sleepy" size={140} steam={false} />
            <h2>No brews yet</h2>
            <p>
              Log what you did and how it tasted, and the next dial-in stops being
              guesswork. Two brews is enough to start seeing the pattern.
            </p>
            <div className="empty-actions">
              <button className="btn" onClick={() => setOpen(true)}>
                Log one now
              </button>
              <Link to="/brew" className="btn secondary">
                Use the timer
              </Link>
            </div>
          </div>
        )
      ) : (
        <section>
          <div className="section-head">
            <h2>History</h2>
            <div className="rule" />
          </div>
          <div className="grid">
            {entries.map((e) => (
              <article key={e.id} className="card">
                <div className="row-between">
                  <div>
                    <strong>{BREW_METHOD_LABELS[e.method]}</strong>
                    <div className="meta">
                      {new Date(e.at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' · '}
                      {e.doseG}g → {e.waterMl}ml
                      {e.grindSetting && ` · ${e.grindSetting}`}
                      {e.seconds !== undefined && ` · ${formatClock(e.seconds)}`}
                    </div>
                  </div>
                  <span className="price" aria-label={`${e.rating} out of 5`}>
                    {'●'.repeat(e.rating)}
                    <span style={{ opacity: 0.25 }}>{'●'.repeat(5 - e.rating)}</span>
                  </span>
                </div>

                {e.beanName && <p style={{ margin: '0.5rem 0 0' }}>{e.beanName}</p>}
                {e.notes && <p className="meta" style={{ margin: '0.35rem 0 0' }}>{e.notes}</p>}

                {e.taste && (
                  <ul className={e.taste === 'balanced' ? 'reasons' : 'caveats'}>
                    <li>{nextStepAdvice(e.taste)}</li>
                  </ul>
                )}

                <button
                  className="btn secondary"
                  style={{ marginTop: '0.7rem', padding: '0.3rem 0.7rem', fontSize: '0.85rem' }}
                  onClick={() => remove(e.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
