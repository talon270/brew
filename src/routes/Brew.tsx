import { useEffect, useMemo, useRef, useState } from 'react'
import Mascot from '../components/Mascot'
import { RECIPES, formatClock } from '../data/recipes'
import { BREW_METHODS, BREW_METHOD_LABELS, type BrewMethod } from '../lib/types'
import { useProfile } from '../lib/profile'

/**
 * Brew timer and ratio calculator in one.
 *
 * Elapsed time is derived from a wall-clock start rather than counting
 * interval ticks, so it stays accurate if the tab is throttled in the
 * background — which it will be, since people put the phone down mid-brew.
 */
export default function Brew() {
  const { profile, loaded } = useProfile()

  const [method, setMethod] = useState<BrewMethod>('pourover')
  const [dose, setDose] = useState<number>(RECIPES.pourover.defaultDoseG)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const recipe = RECIPES[method]
  const water = Math.round(dose * recipe.ratio)
  const steps = useMemo(() => recipe.buildSteps(dose, water), [recipe, dose, water])

  // Default to the user's first home method once the profile loads.
  const seeded = useRef(false)
  useEffect(() => {
    if (!loaded || seeded.current) return
    seeded.current = true
    const first = profile?.methods[0]
    if (first) {
      setMethod(first)
      setDose(RECIPES[first].defaultDoseG)
    }
  }, [loaded, profile])

  useEffect(() => {
    if (startedAt === null) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 250)
    return () => clearInterval(id)
  }, [startedAt])

  function pickMethod(m: BrewMethod) {
    setMethod(m)
    setDose(RECIPES[m].defaultDoseG)
    reset()
  }

  function reset() {
    setStartedAt(null)
    setElapsed(0)
  }

  const running = startedAt !== null
  const currentIndex = steps.reduce(
    (acc, s, i) => (running && elapsed >= s.at ? i : acc),
    -1,
  )
  const overrun = running && elapsed > recipe.totalSeconds

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Brew it</h1>
          <p className="lede">
            Pick a method, set your dose, and follow the clock. The water amounts are
            calculated for you, so there is no arithmetic to do with a kettle in your hand.
          </p>
        </div>
        <Mascot mood={running ? 'grinding' : 'happy'} size={104} />
      </div>

      <div className="card stack">
        <div>
          <strong>Method</strong>
          <div className="chip-row" style={{ marginTop: '0.5rem' }}>
            {BREW_METHODS.map((m) => (
              <button
                key={m}
                className={`chip${method === m ? ' on' : ''}`}
                onClick={() => pickMethod(m)}
              >
                {BREW_METHOD_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="row-between">
            <strong>Coffee dose</strong>
            <span className="meta">
              1:{recipe.ratio.toFixed(recipe.ratio % 1 === 0 ? 0 : 1)} ratio
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={60}
            step={1}
            value={dose}
            onChange={(e) => setDose(Number(e.target.value))}
            aria-label="Coffee dose in grams"
          />
          <div className="calc-out">
            <div>
              <strong>{dose}g</strong>
              <span className="meta">coffee</span>
            </div>
            <div>
              <strong>{water}ml</strong>
              <span className="meta">{method === 'espresso' ? 'in the cup' : 'water'}</span>
            </div>
            <div>
              <strong>{recipe.waterTempC}{recipe.waterTempC.match(/^\d/) ? '°C' : ''}</strong>
              <span className="meta">kettle</span>
            </div>
          </div>
          <p className="meta" style={{ marginBottom: 0 }}>
            Grind: {recipe.grind}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="row-between">
          <div className="timer-dial" style={{ color: overrun ? 'var(--warn)' : undefined }}>
            {formatClock(elapsed)}
          </div>
          <div className="chip-row">
            {!running ? (
              <button className="btn" onClick={() => setStartedAt(Date.now())}>
                Start brewing
              </button>
            ) : (
              <button className="btn secondary" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
        {overrun && (
          <p className="meta" style={{ marginBottom: 0 }}>
            Past the target time — if this happens every brew, grind coarser.
          </p>
        )}
      </div>

      <section>
        <div className="section-head">
          <h2>Steps</h2>
          <div className="rule" />
          <span className="meta">target {formatClock(recipe.totalSeconds)}</span>
        </div>
        <div className="card" style={{ paddingBlock: '0.4rem' }}>
          {steps.map((s, i) => (
            <div
              key={`${s.at}-${s.title}`}
              className={`step${i === currentIndex ? ' current' : ''}${
                running && i < currentIndex ? ' done' : ''
              }`}
            >
              <span className="step-at">{formatClock(s.at)}</span>
              <span className="step-body">
                <strong>{s.title}</strong>
                {s.detail && <span>{s.detail}</span>}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
