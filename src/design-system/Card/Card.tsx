import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { toneVar, type Tone } from '../tokens'
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
  const style: CSSProperties = {
    '--card-accent': toneVar[accent],
    '--card-bg': toneVar[bg],
    '--card-text': toneVar[textTone],
  } as CSSProperties

  const cls = [
    styles.card,
    styles[`accent-${accentSide}`],
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={cls} style={style} {...rest}>
      {children}
    </Tag>
  )
}
