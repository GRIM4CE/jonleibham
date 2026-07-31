import type { SVGProps } from 'react'
import { type IconName } from './icons'

/**
 * Lucide paths, inlined.
 *
 * The site ships no JavaScript and no third-party requests, so icons are drawn
 * from a small hand-picked table rather than pulled from `lucide-react`. Stroke
 * width is 2.75 with round caps and joins throughout — the heavier weight is
 * part of the look, not a default.
 *
 * The LinkedIn and GitHub marks are filled brand paths, so they opt out of the
 * stroke treatment.
 */
const paths: Record<IconName, string[]> = {
  home: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  layoutGrid: [],
  briefcase: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
  search: ['m21 21-4.3-4.3'],
  arrowLeft: ['m12 19-7-7 7-7', 'M19 12H5'],
  arrowUpRight: ['M7 7h10v10', 'M7 17 17 7'],
  chevronRight: ['m9 18 6-6-6-6'],
  download: ['M12 3v13', 'm7 12 5 5 5-5', 'M5 21h14'],
  share: ['M12 3v12', 'm7 8 5-5 5 5', 'M5 21h14'],
  graduationCap: ['M22 10 12 5 2 10l10 5z', 'M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5'],
  linkedin: [],
  github: [],
}

const BRAND: Partial<Record<IconName, string>> = {
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0',
  github:
    'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /**
   * Which glyph to draw. The set is closed — `iconNames` in `./icons` is the
   * whole table, and adding one means adding its path there.
   */
  name: IconName
  /** Both width and height in px; Lucide's grid is square. Defaults to 22. */
  size?: number
}

/**
 * A single glyph, drawn inline.
 *
 * Every icon is `aria-hidden` and unfocusable, so an icon never contributes an
 * accessible name. When one is the only content of a control, that control
 * needs its own `aria-label` — see the `icon` variant of `Button`.
 *
 * Color comes from `currentColor`: set `color` on the parent rather than
 * passing a fill. Size is set on the element rather than inherited from the
 * font, so it does not scale with surrounding text.
 */
export function Icon({ name, size = 22, ...rest }: IconProps) {
  const brand = BRAND[name]

  if (brand) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        <path d={brand} />
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
      {name === 'layoutGrid' && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </>
      )}
      {name === 'briefcase' && <rect x="2" y="7" width="20" height="14" rx="2.5" />}
      {name === 'user' && <circle cx="12" cy="7" r="4" />}
      {name === 'search' && <circle cx="11" cy="11" r="8" />}
    </svg>
  )
}
