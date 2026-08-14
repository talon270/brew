import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import Icon, { type IconName } from '../components/Icons'
import { GUIDE_SECTIONS } from '../lib/guide'

/**
 * The learning hub.
 *
 * Was just a chapter list; it now fronts everything you can learn from, because
 * the alternative was a navigation bar with seventeen entries in it. Deep dives
 * come first — they are the pages people arrive wanting.
 */

const DEEP_DIVES: Array<{
  to: string
  icon: IconName
  title: string
  blurb: string
  tag: string
}> = [
  {
    to: '/path',
    icon: 'seedling',
    title: 'Two weeks to decent coffee',
    blurb:
      'The whole site in order: one idea a day, one thing to brew, one variable changed at a time.',
    tag: 'Start here',
  },
  {
    to: '/explore',
    icon: 'sparkle',
    title: 'Coffee 101',
    blurb:
      'Everything worth knowing, drawn rather than described. Cherry to cup, all of it interactive.',
    tag: 'Visual',
  },
  {
    to: '/fix',
    icon: 'wrench',
    title: 'Something tastes wrong',
    blurb: 'Two taps to one specific change, with the reasoning attached.',
    tag: 'Tool',
  },
  {
    to: '/water',
    icon: 'droplet',
    title: 'Water',
    blurb:
      '98% of your cup, and the reason Delhi coffee tastes flat. Includes a remineralisation calculator.',
    tag: 'Tool',
  },
  {
    to: '/tasting',
    icon: 'cup',
    title: 'Learning to taste',
    blurb: 'Exercises for the one skill you cannot read your way into.',
    tag: 'Practice',
  },
  {
    to: '/espresso',
    icon: 'timer',
    title: 'Espresso',
    blurb: 'Dial-in targets, a shot judge, and what to buy before you buy a machine.',
    tag: 'Tool',
  },
  {
    to: '/glossary',
    icon: 'book',
    title: 'Glossary',
    blurb: 'Every term the site uses, defined without using other terms you would look up.',
    tag: 'Reference',
  },
]

export default function GuideIndex() {
  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Learn coffee</h1>
          <p className="lede">
            Everything you need to go from instant coffee to brewing something you're proud
            of. Follow it in order, or jump to whatever's breaking.
          </p>
        </div>
        <Mascot mood="reading" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>Guides and tools</h2>
          <div className="rule" />
        </div>
        <div className="tiles">
          {DEEP_DIVES.map((d) => (
            <Link key={d.to} to={d.to} className="tile">
              <span className="tile-icon">
                <Icon name={d.icon} />
              </span>
              <div className="row-between">
                <strong>{d.title}</strong>
                <span className="tag">{d.tag}</span>
              </div>
              <span className="meta">{d.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>The written guide</h2>
          <div className="rule" />
          <span className="meta">{GUIDE_SECTIONS.length} chapters</span>
        </div>

        <div className="grid chapter-grid">
          {GUIDE_SECTIONS.map((s) => (
            <Link key={s.slug} to={`/guide/${s.slug}`} className="card chapter">
              <span className="chapter-icon">
                <Icon name={s.icon} size={22} />
              </span>
              <span className="chapter-body">
                <strong>{s.title}</strong>
                <p>{s.excerpt}</p>
              </span>
              <span className="chapter-meta">{s.readingMinutes} min</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
