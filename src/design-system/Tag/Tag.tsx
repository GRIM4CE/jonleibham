import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { toneVar, type Tone } from '../tokens'
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
  textTone,
  children,
  ...rest
}: TagProps) {
  const style: CSSProperties = {
    '--tag-tone': toneVar[tone],
    '--tag-text': textTone ? toneVar[textTone] : 'var(--color-porcelain)',
  } as CSSProperties

  const className = [
    styles.tag,
    styles[`variant-${variant}`],
    interactive ? styles.interactive : '',
    selected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (interactive) {
    return (
      <button type="button" className={className} style={style} {...rest}>
        {children}
      </button>
    )
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  )
}
