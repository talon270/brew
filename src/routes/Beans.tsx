import { Link } from 'react-router-dom'
import { BEANS } from '../data/beans'
import { rankBeans } from '../lib/matching'
import { BeanCard } from '../components/Cards'
import { useProfile } from '../lib/profile'
import { DEFAULT_PROFILE, describeProfile } from '../lib/quiz'

export default function BeansPage() {
  const { profile, loaded } = useProfile()
  if (!loaded) return null

  const ranked = rankBeans(profile ?? DEFAULT_PROFILE, BEANS)

  return (
    <div className="stack">
      <div>
        <h1>Beans</h1>
        {profile ? (
          <p className="lede">Ordered for someone who likes {describeProfile(profile)}.</p>
        ) : (
          <p className="lede">
            Roasters worth buying from, mostly in and around Delhi NCR.{' '}
            <Link to="/quiz">Take the quiz</Link> and this list reorders for your taste.
          </p>
        )}
      </div>

      <div className="grid">
        {ranked.map((m) => (
          <BeanCard key={m.item.id} match={m} />
        ))}
      </div>
    </div>
  )
}
