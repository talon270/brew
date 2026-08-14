import { useMemo, useState } from 'react'
import Mascot from '../components/Mascot'
import { GLOSSARY, GLOSSARY_GROUPS } from '../data/glossary'

/**
 * Every term the site uses, in one place.
 *
 * Searchable rather than paginated, because the way people actually use a
 * glossary is "what does washed mean" not "let me browse the Bs".
 */
export default function Glossary() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GLOSSARY.filter((e) => {
      if (group && e.group !== group) return false
      if (!q) return true
      return (
        e.term.includes(q) ||
        (e.aliases ?? []).some((a) => a.includes(q)) ||
        e.short.toLowerCase().includes(q)
      )
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [query, group])

  return (
    <div className="stack">
      <div className="hero">
        <div className="hero-text">
          <h1>Glossary</h1>
          <p className="lede">
            The words that get in the way. Nothing here is defined using another word you
            would also have to look up.
          </p>
        </div>
        <Mascot mood="reading" size={104} />
      </div>

      <section>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          aria-label="Search the glossary"
          style={{ width: '100%', maxWidth: '26rem' }}
        />

        <div className="chip-row" style={{ marginTop: '0.8rem' }}>
          <button className={`chip${group === null ? ' on' : ''}`} onClick={() => setGroup(null)}>
            All
          </button>
          {GLOSSARY_GROUPS.map((g) => (
            <button
              key={g}
              className={`chip${group === g ? ' on' : ''}`}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {results.length === 0 ? (
        <p className="meta">Nothing matches “{query}”.</p>
      ) : (
        <div className="grid">
          {results.map((e) => (
            <div key={e.term} className="card">
              <div className="row-between">
                <strong style={{ textTransform: 'capitalize' }}>{e.term}</strong>
                <span className="tag">{e.group}</span>
              </div>
              <p style={{ margin: '0.4rem 0 0' }}>{e.short}</p>
              {e.more && (
                <p className="meta" style={{ margin: '0.5rem 0 0' }}>
                  {e.more}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
