import type { HTMLAttributes, ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Card.module.css'

export type CardAccentSide = 'top' | 'left' | 'none'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  accent?: Tone
  accentSide?: CardAccentSide
  bg?: Tone
  textTone?: Tone
  hoverable?: boolean
  as?: 'article' | 'div' | 'section'
  children: ReactNode
}

export function Card({
  accent = 'dustyGrape',
  accentSide = 'top',
  bg = 'porcelain',
  textTone = 'midnightViolet',
  hoverable = true,
  as: Tag = 'article',
  children,
  className = '',
  ...rest
}: CardProps) {
  const cls = [
    styles.card,
    styles[`accent-${accentSide}`],
    hoverable ? styles.hoverable : '',
    toneClass('accent', accent),
    toneClass('bg', bg),
    toneClass('text', textTone),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}
