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
        {GUIDE_SECTIONS.map((s) => (
          <Link key={s.slug} to={`/guide/${s.slug}`} className="card chapter">
            <span className="chapter-icon" aria-hidden="true">
              {s.icon}
            </span>
            <span className="chapter-body">
              <strong>{s.title}</strong>
              <p>{s.excerpt}</p>
            </span>
            <span className="chapter-meta">{s.readingMinutes} min</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
