import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { readFreshness, suggestMethods, useShelf } from '../lib/shelf'

/**
 * What is actually on your shelf.
 *
 * Everything else in the app talks about coffee in the abstract. This is the
 * one place that knows what you own, and it exists mainly to answer a single
 * question people get wrong: is this bag ready yet, and is it still good?
 */
export default function Shelf() {
  const { bags, add, remove, finish } = useShelf()
  const [open, setOpen] = useState(false)
  const [forEspresso, setForEspresso] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    name: '',
    roaster: '',
    roastedOn: today,
    roastLevel: 50,
    notes: '',
  })

  const active = bags.filter((b) => !b.finished)
  const finished = bags.filter((b) => b.finished)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    add({ ...form, name: form.name.trim(), roaster: form.roaster.trim() })
    setForm({ name: '', roaster: '', roastedOn: today, roastLevel: 50, notes: '' })
    setOpen(false)
  }

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Your shelf</h1>
          <p className="lede">
            Coffee does not spoil — it fades, and the good window is earlier and narrower
            than most people expect. Add a bag with its roast date and this will tell you
            where it is in that window.
          </p>
        </div>
        <Mascot mood={active.length ? 'happy' : 'sleepy'} size={104} />
      </div>

      <section>
        <div className="chip-row">
          <button
            className={`chip${!forEspresso ? ' on' : ''}`}
            onClick={() => setForEspresso(false)}
          >
            Filter
          </button>
          <button
            className={`chip${forEspresso ? ' on' : ''}`}
            onClick={() => setForEspresso(true)}
          >
            Espresso
          </button>
          <span className="meta" style={{ alignSelf: 'center', marginLeft: '0.4rem' }}>
            Espresso needs about a week longer resting.
          </span>
        </div>
      </section>

      {open ? (
        <form className="card" onSubmit={submit}>
          <strong>Add a bag</strong>

          <div className="field-row" style={{ marginTop: '0.7rem' }}>
            <label>
              Coffee
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Attikan Estate"
                required
              />
            </label>
            <label>
              Roaster
              <input
                type="text"
                value={form.roaster}
                onChange={(e) => setForm({ ...form, roaster: e.target.value })}
                placeholder="e.g. Blue Tokai"
              />
            </label>
          </div>

          <div className="field-row" style={{ marginTop: '0.7rem' }}>
            <label>
              Roasted on
              <input
                type="date"
                value={form.roastedOn}
                max={today}
                onChange={(e) => setForm({ ...form, roastedOn: e.target.value })}
              />
            </label>
          </div>

          <label style={{ display: 'block', marginTop: '0.7rem' }}>
            Roast level: <strong>{form.roastLevel}</strong>
            <input
              type="range"
              min={0}
              max={100}
              value={form.roastLevel}
              onChange={(e) => setForm({ ...form, roastLevel: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
            <span className="meta">0 = very light, 100 = very dark</span>
          </label>

          <div className="empty-actions" style={{ justifyContent: 'flex-start', marginTop: '0.9rem' }}>
            <button type="submit" className="btn">
              Save
            </button>
            <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        active.length > 0 && (
          <div>
            <button className="btn" onClick={() => setOpen(true)}>
              Add a bag
            </button>
          </div>
        )
      )}

      {active.length === 0 && !open ? (
        <div className="card empty-state">
          <Mascot mood="sleepy" size={140} steam={false} />
          <h2>Nothing on the shelf</h2>
          <p>
            Add the coffee you have open with the roast date off the bag. If there is no
            roast date on it — only a "best before" — that itself tells you something about
            the roaster.
          </p>
          <div className="empty-actions">
            <button className="btn" onClick={() => setOpen(true)}>
              Add a bag
            </button>
            <Link to="/beans" className="btn secondary">
              Find something to buy
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {active.map((bag) => {
            const fresh = readFreshness(bag, Date.now(), forEspresso)
            return (
              <div key={bag.id} className={`card bag ${fresh.stage}`}>
                <div className="row-between">
                  <strong>{bag.name}</strong>
                  <span className={`tag ${fresh.stage}`}>{fresh.label}</span>
                </div>
                <div className="meta">
                  {bag.roaster ? `${bag.roaster} · ` : ''}
                  roasted {fresh.daysOld} {fresh.daysOld === 1 ? 'day' : 'days'} ago
                </div>

                <p style={{ margin: '0.6rem 0 0', fontSize: '0.92rem' }}>{fresh.detail}</p>

                <div className="chip-row" style={{ marginTop: '0.7rem' }}>
                  {suggestMethods(bag.roastLevel).map((m) => (
                    <span key={m} className="tag">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="empty-actions" style={{ justifyContent: 'flex-start', marginTop: '0.8rem' }}>
                  <Link to="/brew" className="btn secondary">
                    Brew it
                  </Link>
                  <button className="btn secondary" onClick={() => finish(bag.id)}>
                    Finished
                  </button>
                  <button className="btn secondary" onClick={() => remove(bag.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {finished.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Finished</h2>
            <div className="rule" />
          </div>
          <div className="grid">
            {finished.map((bag) => (
              <div key={bag.id} className="card" style={{ opacity: 0.65 }}>
                <div className="row-between">
                  <strong>{bag.name}</strong>
                  <button className="btn secondary" onClick={() => finish(bag.id)}>
                    Reopen
                  </button>
                </div>
                <span className="meta">{bag.roaster}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
