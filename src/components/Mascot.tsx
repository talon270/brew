/**
 * Bruno — the app mascot.
 *
 * A mug with opinions. Drawn as inline SVG rather than an image so it scales
 * cleanly, inherits the theme palette, and can change expression per page.
 * Moods are cheap: only the eyes, mouth and props change.
 */

export type Mood =
  | 'happy' // home, general
  | 'thinking' // quiz
  | 'grinding' // grinder finder
  | 'reading' // guide
  | 'delighted' // results
  | 'sleepy' // empty states

interface MascotProps {
  mood?: Mood
  size?: number
  /** Steam animates by default; turn it off for dense layouts. */
  steam?: boolean
  className?: string
}

export default function Mascot({
  mood = 'happy',
  size = 120,
  steam = true,
  className,
}: MascotProps) {
  return (
    <svg
      className={`mascot mascot-${mood}${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="Bruno, a coffee mug"
    >
      {steam && (
        <g className="mascot-steam" stroke="var(--mascot-steam)" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M47 30c-5-6 5-11 0-17" />
          <path d="M60 26c-5-6 5-12 0-18" />
          <path d="M73 30c-5-6 5-11 0-17" />
        </g>
      )}

      <g className="mascot-body">
        {/* handle */}
        <path
          d="M89 58c15 0 17 26 0 27"
          stroke="var(--mascot-mug)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* mug body */}
        <path
          d="M30 46h60l-4 50c-.6 7-4 10-11 10H45c-7 0-10.4-3-11-10z"
          fill="var(--mascot-mug)"
        />

        {/* rim + coffee surface */}
        <ellipse cx="60" cy="46" rx="30" ry="8.5" fill="var(--mascot-rim)" />
        <ellipse cx="60" cy="46.5" rx="24" ry="6" fill="var(--mascot-coffee)" />
        {/* crema highlight */}
        <ellipse cx="52" cy="45" rx="7" ry="2" fill="var(--mascot-crema)" opacity="0.5" />

        {/* face */}
        <Face mood={mood} />

        {/* saucer */}
        <rect x="24" y="108" width="72" height="7" rx="3.5" fill="var(--mascot-rim)" />
      </g>

      {mood === 'delighted' && (
        <g fill="var(--mascot-spark)" className="mascot-sparks">
          <path d="M22 52l2.2 5.3L29.5 60l-5.3 2.2L22 67.5l-2.2-5.3L14.5 60l5.3-2.2z" />
          <path d="M100 68l1.7 4 4 1.7-4 1.7-1.7 4-1.7-4-4-1.7 4-1.7z" />
        </g>
      )}

      {mood === 'sleepy' && (
        <g fill="var(--mascot-steam)" className="mascot-zzz" fontSize="13" fontWeight="700">
          <text x="92" y="34">z</text>
          <text x="101" y="24">z</text>
        </g>
      )}
    </svg>
  )
}

function Face({ mood }: { mood: Mood }) {
  const eyeFill = 'var(--mascot-face)'

  // Sleepy and grinding both squint; everything else keeps open eyes.
  const closedEyes = mood === 'sleepy' || mood === 'grinding'

  return (
    <g className="mascot-face">
      {/* blush */}
      <ellipse cx="41" cy="80" rx="6" ry="3.6" fill="var(--mascot-blush)" opacity="0.55" />
      <ellipse cx="79" cy="80" rx="6" ry="3.6" fill="var(--mascot-blush)" opacity="0.55" />

      {closedEyes ? (
        <g stroke={eyeFill} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M44 71c2.5-3 6.5-3 9 0" />
          <path d="M67 71c2.5-3 6.5-3 9 0" />
        </g>
      ) : (
        <g fill={eyeFill}>
          <ellipse
            cx="48.5"
            cy={mood === 'reading' ? 73 : 71}
            rx="4.2"
            ry={mood === 'delighted' ? 5 : 4.6}
          />
          <ellipse
            cx="71.5"
            cy={mood === 'reading' ? 73 : 71}
            rx="4.2"
            ry={mood === 'delighted' ? 5 : 4.6}
          />
          {/* catchlights */}
          <circle cx="50" cy={mood === 'reading' ? 71.5 : 69.5} r="1.5" fill="var(--mascot-mug)" />
          <circle cx="73" cy={mood === 'reading' ? 71.5 : 69.5} r="1.5" fill="var(--mascot-mug)" />
        </g>
      )}

      {/* a single raised brow reads as "considering it" */}
      {mood === 'thinking' && (
        <path
          d="M44 62c3-2.5 7-2.5 10-.5"
          stroke={eyeFill}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      )}

      <Mouth mood={mood} />
    </g>
  )
}

function Mouth({ mood }: { mood: Mood }) {
  const stroke = 'var(--mascot-face)'
  const common = {
    stroke,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  switch (mood) {
    case 'thinking':
      // small pursed mouth, off to one side
      return <ellipse cx="63" cy="88" rx="3.4" ry="2.8" fill={stroke} />
    case 'delighted':
      return (
        <path
          d="M50 84c2 8 18 8 20 0z"
          fill={stroke}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )
    case 'sleepy':
      return <path d="M56 88c2 2.5 6 2.5 8 0" {...common} />
    case 'grinding':
      // gritted, doing the work
      return <path d="M52 86h16" {...common} />
    default:
      return <path d="M51 84c3 6 15 6 18 0" {...common} />
  }
}
