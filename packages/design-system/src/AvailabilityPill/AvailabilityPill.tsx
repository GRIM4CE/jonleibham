import type { ReactNode } from 'react'
import styles from './AvailabilityPill.module.css'

export interface AvailabilityPillProps {
  /** The status text. Rendered uppercase, so pass it in ordinary case. */
  children: ReactNode
  /** Placement, and overrides for the default gap and padding. */
  className?: string
}

/**
 * A status dot and a short label, in a pill.
 *
 * The dot is `aria-hidden` and the color is fixed to the success tone, so the
 * label has to carry the meaning. No max width — a long label makes it wider.
 */
export function AvailabilityPill({ children, className = '' }: AvailabilityPillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      <i className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  )
}
