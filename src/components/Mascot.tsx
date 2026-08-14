/**
 * Bruno — the app mascot.
 *
 * A mug with a cafe sleeve, stubby legs and one swinging arm. The sleeve does
 * a lot of work: it breaks up what was otherwise a plain cream oval, and it is
 * the only place the brand accent lands on him.
 *
 * Proportions follow the baby-schema rules that make a shape read as a
 * character rather than an object — squat wide body, eyes low and wide apart,
 * tiny mouth, soft corners. A thin outline keeps him legible on both the cream
 * and the dark theme.
 *
 * Inline SVG so he inherits the palette, scales without assets, and can change
 * expression and pose per page.
 */

export type Mood =
  | 'happy'
  | 'thinking'
  | 'grinding'
  | 'reading'
  | 'delighted'
  | 'sleepy'
  | 'worried'

/** Normalised look direction, each axis -1..1. */
export interface Look {
  x: number
  y: number
}

interface MascotProps {
  mood?: Mood
  size?: number
  steam?: boolean
  className?: string
  look?: Look
  /**
   * Play the walk cycle. The stride is animated in CSS rather than driven by
   * a phase prop, so it stays smooth without re-rendering every frame.
   */
  walk?: boolean
  /** Flips him to face left. */
  facing?: 'left' | 'right'
}

/** Aspect ratio of the viewBox, so callers can size by width alone. */
export const MASCOT_ASPECT = 182 / 140

export default function Mascot({
  mood = 'happy',
  size = 140,
  steam = true,
  className,
  look,
  walk = false,
  facing = 'right',
}: MascotProps) {
  const uid = `m-${mood}${walk ? '-w' : ''}`
  const closedEyes = mood === 'sleepy' || mood === 'grinding'

  const lookX = look ? clamp(look.x, -1, 1) * 3 : 0
  const lookY = look ? clamp(look.y, -1, 1) * 2.2 : 0


  return (
    <svg
      className={`mascot mascot-${mood}${walk ? ' is-walking' : ''}${className ? ` ${className}` : ''}`}
      width={size}
      height={size * MASCOT_ASPECT}
      viewBox="0 0 140 182"
      fill="none"
      role="img"
      aria-label="Bruno, a coffee mug"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--mascot-mug-light)" />
          <stop offset="1" stopColor="var(--mascot-mug)" />
        </linearGradient>
        <linearGradient id={`${uid}-sleeve`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--mascot-sleeve-light)" />
          <stop offset="1" stopColor="var(--mascot-sleeve)" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d="M30 48h80v40q0 28 -28 28H58q-28 0 -28 -28z" />
        </clipPath>
      </defs>

      <g transform={facing === 'left' ? 'translate(140 0) scale(-1 1)' : undefined}>
        {steam && (
          <g
            className="mascot-steam"
            stroke="var(--mascot-steam)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M56 30c-6-7 6-13 0-20" />
            <path d="M70 25c-6-7 6-14 0-21" />
            <path d="M84 30c-6-7 6-13 0-20" />
          </g>
        )}

        <g className="mascot-rig">
          <Legs />

          <g className="mascot-body">
            {/* handle, behind the body */}
            <path
              d="M108 66c19 0 19 28 0 28"
              stroke="var(--mascot-line)"
              strokeWidth="15"
              strokeLinecap="round"
              fill="none"
              opacity="0.18"
            />
            <path
              d="M108 66c19 0 19 28 0 28"
              stroke="var(--mascot-rim)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            <Arm />

            {/* squat body */}
            <path
              d="M30 48h80v40q0 28 -28 28H58q-28 0 -28 -28z"
              fill={`url(#${uid}-body)`}
              stroke="var(--mascot-line)"
              strokeWidth="2"
              strokeOpacity="0.22"
            />

            {/* cafe sleeve — the only accent colour on him, and what stops the
                body reading as a blank oval. Clipped to the body so it cannot
                flatten the rounded bottom. */}
            <g clipPath={`url(#${uid}-clip)`}>
              <rect x="28" y="86" width="84" height="22" fill={`url(#${uid}-sleeve)`} />
              <g stroke="var(--mascot-line)" fill="none">
                <path d="M28 86h84" strokeWidth="1.8" strokeOpacity="0.22" />
                <path d="M28 108h84" strokeWidth="1.8" strokeOpacity="0.14" />
                <path d="M52 86v22M70 86v22M88 86v22" strokeWidth="1.4" strokeOpacity="0.1" />
              </g>
            </g>

            {/* rim and coffee */}
            <ellipse
              cx="70"
              cy="48"
              rx="40"
              ry="10.5"
              fill="var(--mascot-rim)"
              stroke="var(--mascot-line)"
              strokeWidth="2"
              strokeOpacity="0.22"
            />
            <ellipse cx="70" cy="48.5" rx="32" ry="7.5" fill="var(--mascot-coffee)" />
            <ellipse cx="58" cy="46.5" rx="9" ry="2.4" fill="var(--mascot-crema)" opacity="0.5" />

            <Face mood={mood} closedEyes={closedEyes} lookX={lookX} lookY={lookY} />
          </g>
        </g>

        {mood === 'delighted' && (
          <g fill="var(--mascot-spark)" className="mascot-sparks">
            <path d="M20 54l2.6 6.2L28.8 63l-6.2 2.6L20 71.8l-2.6-6.2L11.2 63l6.2-2.6z" />
            <path d="M122 42l1.9 4.5 4.5 1.9-4.5 1.9-1.9 4.5-1.9-4.5-4.5-1.9 4.5-1.9z" />
          </g>
        )}

        {mood === 'sleepy' && (
          <g fill="var(--mascot-steam)" className="mascot-zzz" fontSize="15" fontWeight="700">
            <text x="108" y="32">z</text>
            <text x="119" y="20">z</text>
          </g>
        )}
      </g>
    </svg>
  )
}

function Legs() {
  const HIP_Y = 116
  const LEN = 15

  const leg = (hipX: number, cls: string) => (
    // transform-origin is the hip, so the CSS stride rotates the leg about it.
    <g className={cls} style={{ transformBox: 'view-box', transformOrigin: `${hipX}px ${HIP_Y}px` }}>
      <line
        x1={hipX}
        y1={HIP_Y}
        x2={hipX}
        y2={HIP_Y + LEN}
        stroke="var(--mascot-limb)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse cx={hipX} cy={HIP_Y + LEN + 2} rx="9.5" ry="5.5" fill="var(--mascot-limb)" />
    </g>
  )

  return (
    <g className="mascot-legs">
      {leg(61, 'leg leg-l')}
      {leg(81, 'leg leg-r')}
    </g>
  )
}

function Arm() {
  return (
    <g
      className="mascot-arm"
      style={{ transformBox: 'view-box', transformOrigin: '33px 84px' }}
    >
      <path
        d="M33 84q-8 6 -9 14"
        stroke="var(--mascot-limb)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="98" r="5.6" fill="var(--mascot-limb)" />
    </g>
  )
}

function Face({
  mood,
  closedEyes,
  lookX,
  lookY,
}: {
  mood: Mood
  closedEyes: boolean
  lookX: number
  lookY: number
}) {
  const eyeY = mood === 'reading' ? 72 : 70

  return (
    <>
      <Brows mood={mood} />

      {closedEyes ? (
        <g stroke="var(--mascot-face)" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M46 70q7 -7 14 0" />
          <path d="M80 70q7 -7 14 0" />
        </g>
      ) : (
        <g className="mascot-eyes" transform={`translate(${lookX} ${lookY})`}>
          <ellipse cx="53" cy={eyeY} rx="7" ry={mood === 'delighted' ? 8 : 7.5} fill="var(--mascot-face)" />
          <ellipse cx="87" cy={eyeY} rx="7" ry={mood === 'delighted' ? 8 : 7.5} fill="var(--mascot-face)" />
          <circle cx="50.5" cy={eyeY - 2.5} r="2.5" fill="#fff" />
          <circle cx="84.5" cy={eyeY - 2.5} r="2.5" fill="#fff" />
          <circle cx="55.5" cy={eyeY + 3} r="1.2" fill="#fff" opacity="0.75" />
          <circle cx="89.5" cy={eyeY + 3} r="1.2" fill="#fff" opacity="0.75" />
        </g>
      )}

      <Mouth mood={mood} />
    </>
  )
}

/** Brows carry most of the expression once the eyes are small. */
function Brows({ mood }: { mood: Mood }) {
  const props = {
    stroke: 'var(--mascot-face)',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    fill: 'none',
  }

  switch (mood) {
    case 'worried':
      return (
        <g {...props}>
          <path d="M45 60q7 -3.5 13 0.5" />
          <path d="M95 60q-7 -3.5 -13 0.5" />
        </g>
      )
    case 'thinking':
      return (
        <g {...props}>
          <path d="M46 57q7 -4 14 -1" />
          <path d="M82 61h12" />
        </g>
      )
    case 'grinding':
      return (
        <g {...props}>
          <path d="M46 58q7 3 13 5" />
          <path d="M94 58q-7 3 -13 5" />
        </g>
      )
    case 'delighted':
      return (
        <g {...props}>
          <path d="M46 57q7 -4 13 -1" />
          <path d="M94 57q-7 -4 -13 -1" />
        </g>
      )
    default:
      return (
        <g {...props} opacity="0.5">
          <path d="M47 60q6 -2.5 12 -0.5" />
          <path d="M93 60q-6 -2.5 -12 -0.5" />
        </g>
      )
  }
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
      return <ellipse cx="77" cy="83" rx="4" ry="3.2" fill={stroke} />
    case 'delighted':
      return (
        <path
          d="M62 82q8 9 16 0z"
          fill={stroke}
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )
    case 'sleepy':
      return <path d="M66 84q4 3 8 0" {...common} />
    case 'grinding':
      return <path d="M63 83h14" {...common} />
    case 'worried':
      return <path d="M63 85q3.5 -4 7 0t7 0" {...common} />
    default:
      return <path d="M63 81q7 6 14 0" {...common} />
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
