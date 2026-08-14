import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GRINDERS } from '../data/grinders'
import { rankGrinders } from '../lib/matching'
import { GrinderCard } from '../components/Cards'
import { useProfile } from '../lib/profile'
import { BREW_METHODS, BREW_METHOD_LABELS, type BrewMethod } from '../lib/types'
import { BUDGET_OPTIONS, DEFAULT_PROFILE } from '../lib/quiz'

/**
 * The grinder finder. Works standalone — someone who lands here without a
 * taste profile can still set budget and brew method by hand — but it seeds
 * itself from the saved profile when there is one.
 */
export default function GrindersPage() {
  const { profile, loaded } = useProfile()

  const [budget, setBudget] = useState<number | null>(null)
  const [methods, setMethods] = useState<BrewMethod[] | null>(null)

  const effectiveBudget = budget ?? profile?.budgetInr ?? DEFAULT_PROFILE.budgetInr
  const effectiveMethods = methods ?? profile?.methods ?? []

  const ranked = useMemo(() => {
    const base = profile ?? DEFAULT_PROFILE
    return rankGrinders(
      { ...base, budgetInr: effectiveBudget, methods: effectiveMethods },
      GRINDERS,
    )
  }, [profile, effectiveBudget, effectiveMethods])

  if (!loaded) return null

  const inBudget = ranked.filter((m) => !m.overBudget)
  const nearMisses = ranked.filter((m) => m.overBudget).slice(0, 2)

  function toggleMethod(m: BrewMethod) {
    const current = effectiveMethods
    setMethods(current.includes(m) ? current.filter((x) => x !== m) : [...current, m])
  }

  return (
    <div className="stack">
      <div>
        <h1>Which grinder should you buy?</h1>
        <p className="lede">
          There is no single best grinder at a given price — it depends entirely on how you
          brew. Espresso needs a far finer, more precise grind than French press, so set both
          below.
        </p>
      </div>

      <div className="card stack">
        <div>
          <strong>How do you brew?</strong>
          <div className="chip-row" style={{ marginTop: '0.5rem' }}>
            {BREW_METHODS.map((m) => (
              <button
                key={m}
                className={`chip${effectiveMethods.includes(m) ? ' on' : ''}`}
                onClick={() => toggleMethod(m)}
              >
                {BREW_METHOD_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <strong>Budget</strong>
          <div className="chip-row" style={{ marginTop: '0.5rem' }}>
            {BUDGET_OPTIONS.map((b) => (
              <button
                key={b.value}
                className={`chip${effectiveBudget === b.value ? ' on' : ''}`}
                onClick={() => setBudget(b.value)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {effectiveMethods.length === 0 && (
        <div className="notice">
          Pick at least one brew method above and these rankings will change — often a lot.
          Or <Link to="/quiz">take the taste quiz</Link> and it will fill this in for you.
        </div>
      )}

      <section>
        <h2 style={{ fontSize: '1.2rem' }}>
          Within ₹{effectiveBudget.toLocaleString('en-IN')}
        </h2>
        <div className="grid">
          {inBudget.length > 0 ? (
            inBudget.map((m) => <GrinderCard key={m.item.id} match={m} />)
          ) : (
            <p className="meta">Nothing in the catalogue fits that budget yet.</p>
          )}
        </div>
      </section>

      {nearMisses.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.2rem' }}>Worth stretching for</h2>
          <div className="grid">
            {nearMisses.map((m) => (
              <GrinderCard key={m.item.id} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
