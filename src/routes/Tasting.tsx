import { useState } from 'react'
import Mascot from '../components/Mascot'
import Term from '../components/Term'
import FlavourWheel from '../components/visuals/FlavourWheel'

/**
 * The tasting trainer.
 *
 * The one skill you genuinely cannot read your way into. These are structured
 * exercises rather than an article, because palate training is comparison —
 * you learn what acidity is by tasting it next to something without it, not by
 * having it described.
 */

interface Exercise {
  id: string
  title: string
  what: string
  how: string[]
  point: string
  difficulty: 'Start here' | 'Next' | 'Harder'
}

const EXERCISES: Exercise[] = [
  {
    id: 'extremes',
    title: 'Sour versus bitter',
    difficulty: 'Start here',
    what: 'Learn the two ends of extraction by making both on purpose.',
    how: [
      'Brew one cup much coarser than normal, and one much finer.',
      'Taste the coarse one first. Note where in your mouth you feel it.',
      'Then the fine one. Note how long the taste lingers after swallowing.',
    ],
    point:
      'Sour hits the sides of your tongue immediately and vanishes. Bitter arrives late, sits at the back, and dries your mouth. Once you can tell them apart you can diagnose most bad coffee in one sip.',
  },
  {
    id: 'acidity-vs-sour',
    title: 'Acidity is not sourness',
    difficulty: 'Start here',
    what: 'Separate the compliment from the fault — the single most confusing pair in coffee.',
    how: [
      'Brew a light roast properly, at a grind you know works.',
      'Alongside it, put a slice of apple and a squeeze of lemon.',
      'Taste the coffee, then the apple, then the coffee again.',
    ],
    point:
      'Good acidity tastes like the apple — bright, juicy, makes you want another sip. Sourness tastes like the lemon: sharp, one-dimensional, makes you wince. Same word, completely different experience.',
  },
  {
    id: 'body',
    title: 'Feel the body',
    difficulty: 'Next',
    what: 'Body is texture, not flavour, and it is easiest to learn away from coffee first.',
    how: [
      'Line up water, skimmed milk and full-cream milk. Sip each and notice the weight, not the taste.',
      'Now brew the same coffee twice: once through paper, once through a French press.',
      'Compare those two the same way.',
    ],
    point:
      'Paper traps oils and fine particles, so the cup feels lighter and cleaner. Metal lets them through, so it feels heavier and rounder. Identical coffee, different texture.',
  },
  {
    id: 'temperature',
    title: 'Taste it as it cools',
    difficulty: 'Next',
    what: 'Coffee changes more between hot and cool than most people ever notice, because they drink it too fast.',
    how: [
      'Brew one cup. Taste it immediately, then every five minutes for twenty minutes.',
      'Write one word each time before tasting again.',
    ],
    point:
      'Heat masks sweetness and acidity. Most coffee is at its most expressive around body temperature, which is why professionals judge as it cools. A coffee that gets worse as it cools is usually over-extracted.',
  },
  {
    id: 'triangulation',
    title: 'Triangulation',
    difficulty: 'Harder',
    what: 'The standard test of whether you can actually taste a difference, rather than believing you can.',
    how: [
      'Get someone to prepare three cups: two of one coffee, one of another. You must not see which.',
      'Taste all three and pick the odd one out.',
      'Repeat five times. Track how often you are right.',
    ],
    point:
      'Chance alone gets you one in three. Consistently beating that is real evidence your palate is working. Failing it on two similar coffees is completely normal and worth knowing.',
  },
  {
    id: 'blind-roast',
    title: 'Guess the roast level blind',
    difficulty: 'Harder',
    what: 'Test whether you can read a coffee without the bag telling you what to think.',
    how: [
      'Have someone brew you a coffee without showing you the bag.',
      'Before any discussion, write down: light, medium or dark, and why.',
      'Then look.',
    ],
    point:
      'Expectation drives perception more than most people accept. Reading the tasting notes first makes you find them. This is the exercise that shows you how much.',
  },
]

const AXES = [
  { id: 'acidity', label: 'Acidity', low: 'flat', high: 'bright' },
  { id: 'sweetness', label: 'Sweetness', low: 'dry', high: 'sweet' },
  { id: 'body', label: 'Body', low: 'thin', high: 'heavy' },
  { id: 'bitterness', label: 'Bitterness', low: 'none', high: 'harsh' },
  { id: 'finish', label: 'Finish', low: 'short', high: 'long' },
] as const

export default function Tasting() {
  const [scores, setScores] = useState<Record<string, number>>({
    acidity: 5,
    sweetness: 5,
    body: 5,
    bitterness: 5,
    finish: 5,
  })
  const [words, setWords] = useState('')

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Learning to taste</h1>
          <p className="lede">
            The one part of coffee you cannot read your way into. All of these are
            comparisons, because that is the only way a palate actually learns — you find
            out what <Term word="acidity" /> is by tasting something without it.
          </p>
        </div>
        <Mascot mood="delighted" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>Exercises</h2>
          <div className="rule" />
        </div>
        <div className="grid">
          {EXERCISES.map((ex) => (
            <div key={ex.id} className="card">
              <div className="row-between">
                <strong>{ex.title}</strong>
                <span className="tag">{ex.difficulty}</span>
              </div>
              <p className="meta" style={{ margin: '0.3rem 0 0.6rem' }}>
                {ex.what}
              </p>
              <ol style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {ex.how.map((h) => (
                  <li key={h} style={{ marginBottom: '0.25rem' }}>
                    {h}
                  </li>
                ))}
              </ol>
              <div className="reason" style={{ marginTop: '0.7rem' }}>
                ✓ {ex.point}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Put words to it</h2>
          <div className="rule" />
        </div>
        <p className="lede" style={{ marginTop: 0 }}>
          Eight families is enough to describe almost anything in a cup. Start broad —
          "fruity" is a perfectly good note — and narrow down only when you are sure.
        </p>
        <FlavourWheel />
      </section>

      <section>
        <div className="section-head">
          <h2>A scorecard</h2>
          <div className="rule" />
        </div>
        <p className="lede" style={{ marginTop: 0 }}>
          Five axes, scored out of ten. The numbers do not matter in themselves — what
          matters is comparing two cups on the same scale, on the same day.
        </p>

        <div className="card">
          {AXES.map((axis) => (
            <label key={axis.id} style={{ display: 'block', marginBottom: '0.9rem' }}>
              <div className="row-between">
                <strong>{axis.label}</strong>
                <span className="meta">{scores[axis.id]}/10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={scores[axis.id]}
                onChange={(e) => setScores({ ...scores, [axis.id]: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div className="row-between meta">
                <span>{axis.low}</span>
                <span>{axis.high}</span>
              </div>
            </label>
          ))}

          <label style={{ display: 'block' }}>
            <strong>Three words</strong>
            <input
              type="text"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="e.g. berry, cocoa, heavy"
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </label>

          <p className="meta" style={{ marginTop: '0.8rem' }}>
            Write your words before you read the bag. Reading the roaster's notes first makes
            you find them, whether they are there or not.
          </p>
        </div>
      </section>
    </div>
  )
}
