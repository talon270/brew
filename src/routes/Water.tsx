import { useState } from 'react'
import Mascot from '../components/Mascot'
import Term from '../components/Term'
import {
  buildWater,
  CONCENTRATES,
  describeWater,
  TARGET,
  WATER_SOURCES,
} from '../lib/water'

/**
 * The water calculator.
 *
 * Deliberately opinionated about the Delhi case: nearly everyone here is
 * brewing with either RO (too empty) or municipal supply (too hard), and both
 * ruin good coffee in opposite directions.
 */
export default function Water() {
  const [sourceId, setSourceId] = useState('ro')
  const [litres, setLitres] = useState(1)

  const source = WATER_SOURCES.find((w) => w.id === sourceId)!
  const advice = buildWater(source, litres)

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Water</h1>
          <p className="lede">
            Your cup is about 98% water, which makes it the biggest ingredient and the one
            nobody thinks about. In Delhi it is also the one most likely to be quietly
            ruining your coffee.
          </p>
        </div>
        <Mascot mood="thinking" size={104} />
      </div>

      <section>
        <div className="section-head">
          <h2>Why it matters here specifically</h2>
          <div className="rule" />
        </div>
        <div className="tiles">
          <div className="card">
            <strong>Hardness does the extracting</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              Magnesium and calcium physically pull flavour out of the grounds. Strip them out
              and the cup tastes hollow and sour no matter how well you brew.
            </p>
          </div>
          <div className="card">
            <strong>Alkalinity buffers acidity</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              Bicarbonate neutralises the acids you paid for. Delhi tap water is high in it,
              which is why good beans can taste flat and dull straight from the tap.
            </p>
          </div>
          <div className="card">
            <strong>RO overcorrects</strong>
            <p className="meta" style={{ margin: '0.35rem 0 0' }}>
              The standard fix for hard water removes almost everything, leaving water that is
              too empty to extract properly. Right answer, taken too far.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Build your brewing water</h2>
          <div className="rule" />
        </div>

        <div className="chip-row">
          {WATER_SOURCES.map((w) => (
            <button
              key={w.id}
              className={`chip${sourceId === w.id ? ' on' : ''}`}
              onClick={() => setSourceId(w.id)}
            >
              {w.label}
            </button>
          ))}
        </div>

        <p className="meta" style={{ margin: '0.7rem 0 0' }}>
          {source.note}
        </p>

        <div className="card" style={{ marginTop: '1rem' }}>
          <label htmlFor="litres">
            Batch size: <strong>{litres} L</strong>
          </label>
          <input
            id="litres"
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={litres}
            onChange={(e) => setLitres(Number(e.target.value))}
            style={{ width: '100%' }}
          />

          <div className="row-between" style={{ marginTop: '0.8rem' }}>
            <strong>Add to {litres} L</strong>
            <span className={`tag ${advice.verdict}`}>{advice.verdict}</span>
          </div>

          {advice.epsomMl === 0 && advice.sodaMl === 0 ? (
            <p style={{ margin: '0.5rem 0 0' }}>Nothing to add.</p>
          ) : (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
              {advice.epsomMl > 0 && (
                <li>
                  <strong>{advice.epsomMl} mL</strong> Epsom concentrate
                </li>
              )}
              {advice.sodaMl > 0 && (
                <li>
                  <strong>{advice.sodaMl} mL</strong> baking soda concentrate
                </li>
              )}
            </ul>
          )}

          <div className="meta" style={{ marginTop: '0.8rem' }}>
            Result: {advice.resulting.hardness} mg/L hardness, {advice.resulting.alkalinity} mg/L
            alkalinity (target {TARGET.hardness} / {TARGET.alkalinity}).
            <br />
            {describeWater(advice.resulting)}
          </div>

          {advice.reasons.map((r) => (
            <div key={r} className="reason">
              ✓ {r}
            </div>
          ))}
          {advice.caveats.map((c) => (
            <div key={c} className="caveat">
              ! {c}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Making the concentrates</h2>
          <div className="rule" />
        </div>
        <p>
          Two bottles, made once, lasting months. Each is one salt dissolved in a litre of
          distilled or RO water — never tap, or you are adding to something you have not
          measured. Keep them separate: that is what lets you move hardness and{' '}
          <Term word="acidity">buffering</Term> independently.
        </p>
        <div className="tiles">
          <div className="card">
            <strong>{CONCENTRATES.epsom.label}</strong>
            <p style={{ margin: '0.35rem 0 0' }}>
              {CONCENTRATES.epsom.gramsPerLitre} g in 1 L of distilled water. Contributes
              hardness only. Sold in any Indian pharmacy as bath salts — check it is pure
              magnesium sulfate with nothing added.
            </p>
          </div>
          <div className="card">
            <strong>{CONCENTRATES.soda.label}</strong>
            <p style={{ margin: '0.35rem 0 0' }}>
              {CONCENTRATES.soda.gramsPerLitre} g in 1 L of distilled water. Contributes
              alkalinity only. Ordinary baking soda, not baking powder.
            </p>
          </div>
        </div>

        <div className="notice" style={{ marginTop: '1rem' }}>
          <strong>Worth being honest about:</strong> this is a real improvement, not a
          rounding error — but it is also the last 10%. A decent grinder and fresh beans
          matter more. Do this once those are sorted.
        </div>
      </section>
    </div>
  )
}
