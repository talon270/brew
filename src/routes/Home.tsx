import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { useProfile } from '../lib/profile'
import { describeProfile } from '../lib/quiz'
import { GUIDE_SECTIONS } from '../lib/guide'
import { GRINDERS } from '../data/grinders'
import { BEANS } from '../data/beans'

/** Rotates daily so the home page isn't identical every visit. */
const TIPS = [
  'A blade grinder caps how good your coffee can be. Replacing it is the highest-value upgrade there is.',
  'Coffee is at its best 5 to 21 days after roasting. An expiry date tells you nothing; a roast date tells you everything.',
  'Sour means under-extracted — grind finer. Bitter means over-extracted — grind coarser. Change one thing at a time.',
  'Your cup is 98% water. In Delhi, filtered water is often a bigger upgrade than better beans.',
  'Buy 250g at a time. A kilo bag is worse value than it looks, because the last 400g will taste stale.',
  'Espresso needs a far finer grind than pourover, so "best grinder under ₹10,000" has a different answer for each.',
  'Chicory in South Indian filter coffee is not an adulterant. It adds body and depth that survives milk and sugar.',
]

function tipOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  return TIPS[dayIndex % TIPS.length]
}

export default function Home() {
  const { profile, loaded } = useProfile()

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Good coffee, worked out for you</h1>
          <p className="lede">
            A guide to specialty coffee for Delhi NCR. Tell it how you actually drink coffee,
            and it will tell you which beans to try and which grinder is worth your money —
            with the reasons, not a score.
          </p>
        </div>
        <Mascot mood={loaded && profile ? 'delighted' : 'happy'} size={128} />
      </div>

      {loaded && profile ? (
        <div className="card">
          <div className="row-between">
            <strong>Welcome back</strong>
            <Link to="/quiz" className="meta">
              Retake
            </Link>
          </div>
          <p className="meta" style={{ marginBottom: '0.8rem' }}>
            You like {describeProfile(profile)}.
          </p>
          <Link to="/you" className="btn">
            See your recommendations
          </Link>
        </div>
      ) : (
        <div className="card with-mascot">
          <Mascot mood="thinking" size={72} steam={false} />
          <div style={{ flex: '1 1 260px' }}>
            <div className="speech">
              <strong>Start here.</strong> Eight questions, about a minute — then everything
              else in the app is tailored to you. No account, and it stays on your device.
            </div>
            <Link to="/quiz" className="btn" style={{ marginTop: '0.8rem' }}>
              Find your taste
            </Link>
          </div>
        </div>
      )}

      <section>
        <div className="section-head">
          <h2>Tools</h2>
          <div className="rule" />
        </div>
        <div className="tiles">
          <Link to="/brew" className="tile">
            <span className="tile-icon" aria-hidden="true">⏱️</span>
            <strong>Brew timer</strong>
            <span className="meta">
              Timed steps and water amounts for six methods, worked out from your dose.
            </span>
          </Link>
          <Link to="/grinders" className="tile">
            <span className="tile-icon" aria-hidden="true">⚙️</span>
            <strong>Grinder finder</strong>
            <span className="meta">
              {GRINDERS.length} grinders ranked by budget and how you actually brew.
            </span>
          </Link>
          <Link to="/beans" className="tile">
            <span className="tile-icon" aria-hidden="true">🫘</span>
            <strong>Beans</strong>
            <span className="meta">
              {BEANS.length} bags from Delhi NCR roasters, matched to your taste.
            </span>
          </Link>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>The guide</h2>
          <div className="rule" />
          <span className="meta">{GUIDE_SECTIONS.length} chapters</span>
        </div>
        <div className="grid">
          {GUIDE_SECTIONS.map((s, i) => (
            <Link
              key={s.slug}
              to={`/guide/${s.slug}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="row-between">
                <strong>{s.title}</strong>
                <span className="meta">{i + 1}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="card with-mascot">
        <Mascot mood="reading" size={64} steam={false} />
        <div style={{ flex: '1 1 240px' }}>
          <div className="speech">
            <strong>Tip of the day.</strong> {tipOfTheDay()}
          </div>
        </div>
      </div>

      <div className="notice">
        <strong>Coming next:</strong> a community-built list of Delhi NCR cafes — which ones
        roast light, which will pull you a proper pourover, and which do real filter coffee.
      </div>
    </div>
  )
}
