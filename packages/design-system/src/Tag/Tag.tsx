import type { ReactNode } from 'react'
import styles from './Tag.module.css'

export type TagVariant = 'neutral' | 'cloud' | 'data'

export type TagSize = 'sm' | 'md'

export interface TagProps {
  /**
   * `cloud` reads gold, `data` green, `neutral` everything else. Prefer
   * `tagVariantFor(tech)` over picking one by hand.
   */
  variant?: TagVariant
  /** `sm` for dense lists, `md` for chips that stand on their own. */
  size?: TagSize
  /** The chip's label. Usually a technology name. */
  children: ReactNode
}

/**
 * A small pill for a technology name. Static text — no dismiss control and no
 * interactive state.
 *
 * Color is by category, so pass names through `tagVariantFor` rather than
 * choosing a variant per call site.
 */

export function Tag({ variant = 'neutral', size = 'sm', children }: TagProps) {
  const className = [styles.tag, styles[`variant-${variant}`], styles[`size-${size}`]].join(' ')

  return <span className={className}>{children}</span>
}
