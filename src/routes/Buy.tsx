import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import Icon, { type IconName } from '../components/Icons'
import { BEANS } from '../data/beans'
import { GEAR } from '../data/gear'
import { GRINDERS } from '../data/grinders'
import { ROASTERS } from '../data/roasters'

/**
 * The buying hub.
 *
 * Four separate pages answer four different money questions, and putting them
 * behind one nav item keeps the header from turning into a directory.
 */

const SECTIONS: Array<{
  to: string
  icon: IconName
  title: string
  blurb: string
  count: string
}> = [
  {
    to: '/grinders',
    icon: 'grinder',
    title: 'Grinders',
    blurb:
      'The one purchase that decides how good your coffee can be. Ranked by your budget and how you actually brew.',
    count: `${GRINDERS.length} ranked`,
  },
  {
    to: '/gear',
    icon: 'kettle',
    title: 'Everything else',
    blurb:
      'Brewers, kettles, scales and accessories — in the order worth buying, including what to skip.',
    count: `${GEAR.length} items`,
  },
  {
    to: '/beans',
    icon: 'bean',
    title: 'Beans',
    blurb: 'Specific bags from Indian roasters, reordered to match your taste profile.',
    count: `${BEANS.length} bags`,
  },
  {
    to: '/roasters',
    icon: 'bag',
    title: 'Roasters',
    blurb:
      'Who to buy from, who prints a roast date, and what to check on any bag before paying for it.',
    count: `${ROASTERS.length} roasters`,
  },
]

export default function Buy() {
  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Spending money well</h1>
          <p className="lede">
            Four different questions, answered separately. No affiliate links, and nobody has
            paid to appear anywhere on this site.
          </p>
        </div>
        <Mascot mood="thinking" size={104} />
      </div>

      <div className="tiles">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="tile">
            <span className="tile-icon">
              <Icon name={s.icon} />
            </span>
            <div className="row-between">
              <strong>{s.title}</strong>
              <span className="meta">{s.count}</span>
            </div>
            <span className="meta">{s.blurb}</span>
          </Link>
        ))}
      </div>

      <div className="notice">
        <strong>The short version:</strong> a burr grinder and a scale first, then one
        brewer, then better beans more often. Almost everyone buys these in the wrong order
        and regrets it.
      </div>
    </div>
  )
}
