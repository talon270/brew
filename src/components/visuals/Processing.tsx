/**
 * Processing methods.
 *
 * The single biggest driver of how a coffee tastes after roast level, and the
 * one most people have never heard of. All four are answering one question:
 * how much fruit do you leave on the seed while it dries?
 */

interface Process {
  name: string
  mucilage: string
  colour: string
  acidity: number
  body: number
  sweetness: number
  funk: number
  text: string
}

const PROCESSES: Process[] = [
  {
    name: 'Washed',
    mucilage: 'All removed before drying',
    colour: '#6d9fd4',
    acidity: 85,
    body: 45,
    sweetness: 50,
    funk: 5,
    text: 'The fruit is stripped off and the seed fermented in water, then dried clean. Nothing between you and the bean, so it shows the farm and the varietal most honestly. Clean, bright, structured — the default for most Indian estates.',
  },
  {
    name: 'Natural',
    mucilage: 'All left on, dried whole',
    colour: '#c8543f',
    acidity: 60,
    body: 80,
    sweetness: 85,
    funk: 70,
    text: 'The whole cherry dries in the sun with the fruit intact, so the seed absorbs it. Big, jammy, berry-forward, heavier bodied. Harder to do well — done badly it tastes of rot rather than fruit.',
  },
  {
    name: 'Honey',
    mucilage: 'Some left on',
    colour: '#dda03f',
    acidity: 70,
    body: 65,
    sweetness: 78,
    funk: 30,
    text: 'The middle path: skin removed, sticky mucilage left on to dry. Named for the texture, not the taste. Graded by how much is left — white, yellow, red, black, in increasing order.',
  },
  {
    name: 'Anaerobic',
    mucilage: 'Fermented sealed, without oxygen',
    colour: '#8b5aa0',
    acidity: 72,
    body: 70,
    sweetness: 70,
    funk: 95,
    text: 'Cherries ferment in sealed tanks, so different microbes dominate. Produces intense, unusual, sometimes polarising cups — cinnamon, rum, tropical fruit. The most modern and the most divisive.',
  },
]

function MiniBar({ label, value, colour }: { label: string; value: number; colour: string }) {
  return (
    <div style={{ marginTop: '0.35rem' }}>
      <div className="row-between" style={{ marginBottom: '0.15rem' }}>
        <span className="meta">{label}</span>
      </div>
      <div className="progress">
        <div style={{ width: `${value}%`, background: colour }} />
      </div>
    </div>
  )
}

export default function Processing() {
  return (
    <div className="tiles">
      {PROCESSES.map((p) => (
        <div key={p.name} className="card">
          <div className="row-between">
            <strong style={{ color: p.colour }}>{p.name}</strong>
          </div>
          <p className="meta" style={{ margin: '0.15rem 0 0.6rem' }}>
            {p.mucilage}
          </p>

          <MiniBar label="Acidity" value={p.acidity} colour={p.colour} />
          <MiniBar label="Body" value={p.body} colour={p.colour} />
          <MiniBar label="Sweetness" value={p.sweetness} colour={p.colour} />
          <MiniBar label="Funk" value={p.funk} colour={p.colour} />

          <p style={{ margin: '0.7rem 0 0', fontSize: '0.92rem' }}>{p.text}</p>
        </div>
      ))}
    </div>
  )
}
