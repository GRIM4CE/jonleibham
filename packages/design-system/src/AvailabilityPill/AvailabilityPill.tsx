import type { ReactNode } from 'react'
import styles from './AvailabilityPill.module.css'

export interface AvailabilityPillProps {
  children: ReactNode
  /**
   * The call site's own gap and padding. Home's pill is tighter than the
   * rail's, and the rail's is hidden below 1024 by a rule that stays in
   * TabBar.module.css.
   */
  className?: string
}

/**
 * A status dot and a label.
 *
 * Home shows it in its brand row below 1024; the rail shows it in its foot
 * from 1024 up. Only one is ever visible — `TabBar.module.css` hides `.foot`
 * outright below 1024 and `HomeScreen.module.css` hides the brand row from
 * there on — which is why the breakpoint rules stay with the screens and only
 * the pill's own look lives here.
 */
export function AvailabilityPill({ children, className = '' }: AvailabilityPillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      <i className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  )
}
