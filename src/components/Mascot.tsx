/**
 * Bruno — the app mascot.
 *
 * Proportions follow the baby-schema rules that make a shape read as cute
 * rather than as an object: a squat, wide body; eyes that are enormous
 * relative to the face, set low and far apart; a tiny mouth; soft round
 * corners everywhere; and very little detail. The earlier version was a tall
 * narrow mug with small high-set eyes, which read as a mug wearing a face.
 *
 * Inline SVG so he inherits the theme palette, scales without assets, and can
 * change expression per page.
 */

export type Mood =
  | 'happy' // home, general
  | 'thinking' // quiz
  | 'grinding' // grinder finder
  | 'reading' // guide
  | 'delighted' // results
  | 'sleepy' // empty states
  | 'worried' // something is going wrong, e.g. a brew running long

/** Normalised look direction, each axis -1..1. Used by the cursor companion. */
export interface Look {
  x: number
  y: number
}

interface MascotProps {
  mood?: Mood
  size?: number
  steam?: boolean
  className?: string
  /** Shifts the eyes toward a point, so Bruno can watch the cursor. */
  look?: Look
}

export default function Mascot({
  mood = 'happy',
  size = 140,
  steam = true,
  className,
  look,
}: MascotProps) {
  const uid = `m-${mood}`
  const closedEyes = mood === 'sleepy' || mood === 'grinding'

  // A few SVG units is plenty — the eyes are small, and overshooting makes
  // them slide off the face.
  const lookX = look ? clamp(look.x, -1, 1) * 3 : 0
  const lookY = look ? clamp(look.y, -1, 1) * 2.2 : 0

  return (
    <svg
      className={`mascot mascot-${mood}${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      role="img"
      aria-label="Bruno, a coffee mug"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--mascot-mug-light)" />
          <stop offset="1" stopColor="var(--mascot-mug)" />
        </linearGradient>
      </defs>

      {steam && (
        <g
          className="mascot-steam"
          stroke="var(--mascot-steam)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M56 32c-6-7 6-13 0-20" />
          <path d="M70 27c-6-7 6-14 0-21" />
          <path d="M84 32c-6-7 6-13 0-20" />
        </g>
      )}

      <g className="mascot-body">
        {/* handle — chunky and rounded, tucked behind the body */}
        <path
          d="M108 64c20 0 20 30 0 30"
          stroke="var(--mascot-mug)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* squat, wide body */}
        <path
          d="M30 48h80v34q0 26 -26 26H56q-26 0 -26 -26z"
          fill={`url(#${uid}-body)`}
        />

        {/* soft shadow inside the lower right, for a little dimension */}
        <path
          d="M96 48h14v34q0 26 -26 26h-8q22 -4 22 -28z"
          fill="var(--mascot-shade)"
          opacity="0.35"
        />

        {/* rim and coffee */}
        <ellipse cx="70" cy="48" rx="40" ry="10.5" fill="var(--mascot-rim)" />
        <ellipse cx="70" cy="48.5" rx="32" ry="7.5" fill="var(--mascot-coffee)" />
        <ellipse cx="58" cy="46.5" rx="9" ry="2.4" fill="var(--mascot-crema)" opacity="0.55" />

        {/* ---- face ---- */}

        {closedEyes ? (
          <g
            stroke="var(--mascot-face)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M45 78q8 -8 16 0" />
            <path d="M79 78q8 -8 16 0" />
          </g>
        ) : (
          <g className="mascot-eyes" transform={`translate(${lookX} ${lookY})`}>
            <ellipse
              cx="53"
              cy={mood === 'reading' ? 80 : 78}
              rx="7"
              ry={mood === 'delighted' ? 8 : 7.5}
              fill="var(--mascot-face)"
            />
            <ellipse
              cx="87"
              cy={mood === 'reading' ? 80 : 78}
              rx="7"
              ry={mood === 'delighted' ? 8 : 7.5}
              fill="var(--mascot-face)"
            />
            {/* two catchlights per eye — the single biggest cuteness lever */}
            <circle cx="49.5" cy={mood === 'reading' ? 76 : 74} r="2.5" fill="#fff" />
            <circle cx="83.5" cy={mood === 'reading' ? 76 : 74} r="2.5" fill="#fff" />
            <circle cx="56.5" cy={mood === 'reading' ? 83.5 : 81.5} r="1.2" fill="#fff" opacity="0.8" />
            <circle cx="90.5" cy={mood === 'reading' ? 83.5 : 81.5} r="1.2" fill="#fff" opacity="0.8" />
          </g>
        )}

        {/* Both inner brows tilted up — the universal worried face. */}
        {mood === 'worried' && (
          <g
            stroke="var(--mascot-face)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M45 67.5q7 -3.5 13 0.5" />
            <path d="M95 67.5q-7 -3.5 -13 0.5" />
          </g>
        )}

        {/* One raised brow, over the left eye only. Kept clear of the rim,
            which it used to overlap and read as a crack in the mug. */}
        {mood === 'thinking' && (
          <path
            d="M46 65.5q7 -4 14 -1"
            stroke="var(--mascot-face)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        <Mouth mood={mood} />
      </g>

      {mood === 'delighted' && (
        <g fill="var(--mascot-spark)" className="mascot-sparks">
          <path d="M22 56l2.6 6.2L30.8 65l-6.2 2.6L22 73.8l-2.6-6.2L13.2 65l6.2-2.6z" />
          <path d="M120 44l1.9 4.5 4.5 1.9-4.5 1.9-1.9 4.5-1.9-4.5-4.5-1.9 4.5-1.9z" />
        </g>
      )}

      {mood === 'sleepy' && (
        <g
          fill="var(--mascot-steam)"
          className="mascot-zzz"
          fontSize="15"
          fontWeight="700"
          fontFamily="inherit"
        >
          <text x="108" y="34">z</text>
          <text x="119" y="22">z</text>
        </g>
      )}
    </svg>
  )
}

function Mouth({ mood }: { mood: Mood }) {
  const stroke = 'var(--mascot-face)'
  const common = {
    stroke,
    strokeWidth: 3.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }

  switch (mood) {
    case 'thinking':
      // Off to one side, which reads as "considering it" rather than as a nose.
      return <ellipse cx="77" cy="94" rx="4" ry="3.2" fill={stroke} />
    case 'delighted':
      // open smile — small, wide, and low
      return <path d="M62 94q8 9 16 0z" fill={stroke} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    case 'sleepy':
      return <path d="M66 95q4 3 8 0" {...common} />
    case 'grinding':
      return <path d="M63 94h14" {...common} />
    case 'worried':
      return <path d="M63 96q3.5 -4 7 0t7 0" {...common} />
    default:
      return <path d="M63 93q7 6 14 0" {...common} />
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
