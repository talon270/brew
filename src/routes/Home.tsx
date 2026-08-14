import { Link } from 'react-router-dom'
import { useProfile } from '../lib/profile'
import { describeProfile } from '../lib/quiz'
import { GUIDE_SECTIONS } from '../lib/guide'

export default function Home() {
  const { profile, loaded } = useProfile()

  return (
    <div className="stack">
      <div>
        <h1>Good coffee, worked out for you</h1>
        <p className="lede">
          A guide to specialty coffee for Delhi NCR. Tell it how you actually drink coffee,
          and it will tell you which beans to try and which grinder is worth your money —
          with the reasons, not a score.
        </p>
      </div>

      {loaded && profile ? (
        <div className="card">
          <div className="row-between">
            <strong>Your taste</strong>
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
        <div className="card">
          <strong>Start here</strong>
          <p className="meta" style={{ marginBottom: '0.8rem' }}>
            Eight questions, about a minute. No account needed — it stays on your device.
          </p>
          <Link to="/quiz" className="btn">
            Find your taste
          </Link>
        </div>
      )}

      <section>
        <h2 style={{ fontSize: '1.2rem' }}>The guide</h2>
        <div className="grid">
          {GUIDE_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              to={`/guide/${s.slug}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <strong>{s.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <div className="notice">
        <strong>Coming next:</strong> a community-built list of Delhi NCR cafes — which ones
        roast light, which will pull you a proper pourover, and which do real filter coffee.
      </div>
    </div>
  )
}
