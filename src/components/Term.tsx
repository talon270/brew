import { useId, useState } from 'react'
import { lookupTerm } from '../data/glossary'

/**
 * An inline jargon definition.
 *
 * Jargon is the barrier to entry, and sending someone to a glossary page mid
 * sentence loses them. This defines the word where it stands: hover or focus on
 * a desktop, tap on a phone.
 *
 * Falls back to plain text when the word is not in the glossary, so wrapping
 * something speculatively can never break the sentence.
 */
export default function Term({
  word,
  children,
}: {
  word: string
  children?: React.ReactNode
}) {
  const entry = lookupTerm(word)
  const [open, setOpen] = useState(false)
  const id = useId()

  if (!entry) return <>{children ?? word}</>

  return (
    <span className="term-wrap">
      <button
        type="button"
        className="term"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children ?? word}
      </button>
      {open && (
        <span role="tooltip" id={id} className="term-pop">
          <strong>{entry.term}</strong>
          {entry.short}
        </span>
      )}
    </span>
  )
}
