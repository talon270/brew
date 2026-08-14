import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { GUIDE_SECTIONS } from '../lib/guide'

export default function GuideIndex() {
  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>A beginner's guide to specialty coffee</h1>
          <p className="lede">
            Everything you need to go from instant coffee to brewing something you're proud
            of. Read it in order, or jump to whatever's breaking.
          </p>
        </div>
        <Mascot mood="reading" size={104} />
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
    </div>
  )
}
