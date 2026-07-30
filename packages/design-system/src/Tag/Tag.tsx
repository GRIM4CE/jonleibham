import type { ReactNode } from 'react'
import styles from './Tag.module.css'

/**
 * Chips are color-coded by what the technology *is*, not for decoration:
 * cloud and infra read gold, data stores read green, everything else takes the
 * neutral grape tint.
 */
export type TagVariant = 'neutral' | 'cloud' | 'data'

/** sm = detail-screen tech chips, md = the About stack chips. */
export type TagSize = 'sm' | 'md'

export interface TagProps {
  variant?: TagVariant
  size?: TagSize
  children: ReactNode
}

export function Tag({ variant = 'neutral', size = 'sm', children }: TagProps) {
  const className = [styles.tag, styles[`variant-${variant}`], styles[`size-${size}`]].join(' ')

  return <span className={className}>{children}</span>
}
