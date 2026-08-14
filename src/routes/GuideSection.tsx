import { Link, useParams } from 'react-router-dom'
import { GUIDE_SECTIONS, getSection } from '../lib/guide'

export default function GuideSection() {
  const { slug } = useParams<{ slug: string }>()
  const section = slug ? getSection(slug) : undefined

  if (!section) {
    return (
      <div className="stack">
        <h1>Not found</h1>
        <Link to="/guide">Back to the guide</Link>
      </div>
    )
  }

  const index = GUIDE_SECTIONS.findIndex((s) => s.slug === section.slug)
  const prev = GUIDE_SECTIONS[index - 1]
  const next = GUIDE_SECTIONS[index + 1]

  return (
    <div className="stack">
      <p className="meta">
        <Link to="/guide">Guide</Link>
      </p>

      <article className="prose">
        <h1>{section.title}</h1>
        <div
          className="table-scroll"
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      </article>

      <nav className="row-between" style={{ marginTop: '2rem' }}>
        {prev ? (
          <Link to={`/guide/${prev.slug}`}>← {prev.title}</Link>
        ) : (
          <span />
        )}
        {next && <Link to={`/guide/${next.slug}`}>{next.title} →</Link>}
      </nav>
    </div>
  )
}
