import type { CSSProperties } from 'react'
import { toneVar, type Tone } from '../tokens'
import styles from './LogoMark.module.css'

export interface LogoMarkProps {
  text: string
  accent?: Tone
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LogoMark({ text, accent = 'sunflowerGold', href = '#', size = 'md' }: LogoMarkProps) {
  const style: CSSProperties = { '--logo-accent': toneVar[accent] } as CSSProperties
  return (
    <a className={`${styles.logo} ${styles[`size-${size}`]}`} style={style} href={href}>
      {text}
      <span className={styles.dot}>.</span>
    </a>
  )
}
