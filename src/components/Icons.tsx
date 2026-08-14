/**
 * Icon set.
 *
 * Replaces the emoji that were previously used for tools and guide chapters.
 * Emoji render differently on every OS, so they clashed with the mascot and
 * looked inconsistent between the user's phone and desktop.
 *
 * House style, kept deliberately narrow so everything reads as one family:
 * 24x24 grid, stroke-only, 1.75 weight, round caps and joins, currentColor.
 */

export type IconName =
  | 'timer'
  | 'grinder'
  | 'bean'
  | 'seedling'
  | 'bag'
  | 'scale'
  | 'kettle'
  | 'wrench'
  | 'cup'
  | 'book'
  | 'sparkle'
  | 'droplet'

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export default function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}

const PATHS: Record<IconName, React.ReactNode> = {
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4l2.5 2" />
      <path d="M9.5 2h5" />
      <path d="M12 2v4" />
      <path d="M18.5 5.5 20 7" />
    </>
  ),

  // A burr grinder reads best as concentric rings with teeth.
  grinder: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20" />
      <path d="m6.3 6.3 1.8 1.8M15.9 15.9l1.8 1.8M17.7 6.3l-1.8 1.8M8.1 15.9l-1.8 1.8" />
    </>
  ),

  bean: (
    <g transform="rotate(-28 12 12)">
      <ellipse cx="12" cy="12" rx="5.5" ry="8.5" />
      <path d="M12 3.5c-3 4 3 12.5 0 17" />
    </g>
  ),

  seedling: (
    <>
      <path d="M12 21v-7.5" />
      <path d="M12 13.5C12 10 9.3 7.5 5.5 7.5c0 3.7 2.8 6 6.5 6z" />
      <path d="M12 13.5c0-4.2 3-7.5 7-7.5 0 4.2-3 7.5-7 7.5z" />
    </>
  ),

  bag: (
    <>
      <path d="M5 8h14l-1.1 11.2a2 2 0 0 1-2 1.8H8.1a2 2 0 0 1-2-1.8z" />
      <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
    </>
  ),

  scale: (
    <>
      <path d="M12 4.5V21" />
      <path d="M7.5 21h9" />
      <path d="M4 8.2 12 6.5l8 1.7" />
      <path d="M4 8.2 1.8 14a2.8 2.8 0 0 0 4.4 0z" />
      <path d="M20 8.2 17.8 14a2.8 2.8 0 0 0 4.4 0z" />
    </>
  ),

  kettle: (
    <>
      <path d="M3.5 11h13v6a4 4 0 0 1-4 4h-5a4 4 0 0 1-4-4z" />
      <path d="M16.5 12.5c4.5 0 4.5-9 0-9" />
      <path d="M10 11V8.5" />
    </>
  ),

  wrench: (
    <path d="M14.8 3.6a5.2 5.2 0 0 0-6.4 6.4L3 15.4V21h5.6l5.4-5.4a5.2 5.2 0 0 0 6.4-6.4l-3.3 3.3-3-3z" />
  ),

  cup: (
    <>
      <path d="M3.5 8.5h12V16a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16z" />
      <path d="M15.5 10.5h2a3 3 0 0 1 0 6h-2" />
      <path d="M7 5.5V3.5M11.5 5.5V3.5" />
    </>
  ),

  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z" />
      <path d="M4 19.5A1.5 1.5 0 0 1 5.5 21H19v-3" />
    </>
  ),

  sparkle: (
    <path d="M12 3.5 13.9 9.1 19.5 11 13.9 12.9 12 18.5 10.1 12.9 4.5 11 10.1 9.1z" />
  ),

  droplet: <path d="M12 3.5c3.5 4.2 5.5 7 5.5 9.6a5.5 5.5 0 0 1-11 0c0-2.6 2-5.4 5.5-9.6z" />,
}
