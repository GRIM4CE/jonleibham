import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { toneVar, type Tone } from '../tokens'
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
  const style: CSSProperties = {
    '--link-tone': toneVar[tone],
    '--link-hover': toneVar[hoverTone],
  } as CSSProperties

  const cls = [
    styles.link,
    styles[`weight-${weight}`],
    underline ? styles.underline : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={cls} style={style} {...rest}>
      {children}
    </a>
  )
}
