import type { ReactNode } from 'react'
import styles from './AvailabilityPill.module.css'

export interface AvailabilityPillProps {
  children: ReactNode
  /**
   * The call site's own gap and padding. Home's pill is tighter than the
   * rail's, and the rail's is hidden below 768 by a rule that stays in
   * TabBar.module.css.
   */
  className?: string
}

/**
 * A status dot and a label.
 *
 * Home shows it in the brand row below 768; the rail shows it in its foot from
 * 768 up. Only one is ever visible — `TabBar.module.css` hides `.brand` and
 * `.foot` outright below 768 — which is why the breakpoint rules stay with the
 * screens and only the pill's own look lives here.
 */
export function AvailabilityPill({ children, className = '' }: AvailabilityPillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      <i className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  )
}
