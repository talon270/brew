import { Link } from 'react-router-dom'
import { useProfile } from '../lib/profile'
import { describeProfile } from '../lib/quiz'
import { rankBeans, rankGrinders } from '../lib/matching'
import { GRINDERS } from '../data/grinders'
import { BEANS } from '../data/beans'
import { BeanCard, GrinderCard } from '../components/Cards'
import { BREW_METHOD_LABELS } from '../lib/types'

export default function You() {
  const { profile, loaded, reset } = useProfile()

  if (!loaded) return null

  if (!profile) {
    return (
      <div className="stack">
        <h1>You haven't taken the quiz yet</h1>
        <p className="lede">
          It's eight questions and takes about a minute. Everything else in the app gets more
          useful once it knows how you drink coffee.
        </p>
        <div>
          <Link to="/quiz" className="btn">
            Find your taste
          </Link>
        </div>
      </div>
    )
  }

  const beans = rankBeans(profile, BEANS).slice(0, 4)
  const grinders = rankGrinders(profile, GRINDERS).slice(0, 3)

  return (
    <div className="stack">
      <div>
        <h1>Your taste</h1>
        <p className="lede">You like {describeProfile(profile)}.</p>
        {profile.methods.length > 0 && (
          <p className="meta">
            Brewing at home with{' '}
            {profile.methods.map((m) => BREW_METHOD_LABELS[m].toLowerCase()).join(', ')} ·
            grinder budget ₹{profile.budgetInr.toLocaleString('en-IN')}
          </p>
        )}
      </div>

      <section>
        <h2 style={{ fontSize: '1.2rem' }}>Beans to try</h2>
        <div className="grid">
          {beans.map((m) => (
            <BeanCard key={m.item.id} match={m} />
          ))}
        </div>
      </section>

      <section>
        <div className="row-between">
          <h2 style={{ fontSize: '1.2rem' }}>Grinders for you</h2>
          <Link to="/grinders" className="meta">
            See all
          </Link>
        </div>
        <div className="grid">
          {grinders.map((m) => (
            <GrinderCard key={m.item.id} match={m} />
          ))}
        </div>
      </section>

      <div className="chip-row">
        <Link to="/quiz" className="btn secondary">
          Retake the quiz
        </Link>
        <button className="btn secondary" onClick={reset}>
          Clear my profile
        </button>
      </div>
    </div>
  )
}
