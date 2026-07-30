import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Tag.module.css'

export type TagVariant = 'soft' | 'solid' | 'outline'

export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  tone?: Tone
  variant?: TagVariant
  selected?: boolean
  interactive?: boolean
  textTone?: Tone
  children: ReactNode
}

export function Tag({
  tone = 'dustyGrape',
  variant = 'soft',
  selected = false,
  interactive = false,
  textTone = 'porcelain',
  children,
  ...rest
}: TagProps) {
  const className = [
    styles.tag,
    styles[`variant-${variant}`],
    interactive ? styles.interactive : '',
    selected ? styles.selected : '',
    toneClass('accent', tone),
    toneClass('text', textTone),
  ]
    .filter(Boolean)
    .join(' ')

  if (interactive) {
    return (
      <button type="button" className={className} {...rest}>
        {children}
      </button>
    )
  }
  return <span className={className}>{children}</span>
}
