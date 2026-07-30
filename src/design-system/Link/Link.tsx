import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Link.module.css'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: Tone
  hoverTone?: Tone
  underline?: boolean
  weight?: 'regular' | 'medium' | 'semibold'
  children: ReactNode
}

export function Link({
  tone = 'dustyGrape',
  hoverTone = 'magentaBloom',
  underline = true,
  weight = 'medium',
  children,
  className = '',
  ...rest
}: LinkProps) {
  const cls = [
    styles.link,
    styles[`weight-${weight}`],
    underline ? styles.underline : '',
    toneClass('accent', tone),
    toneClass('hover', hoverTone),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={cls} {...rest}>
      {children}
    </a>
  )
}
