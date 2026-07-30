import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './LogoMark.module.css'

export interface LogoMarkProps {
  text: string
  accent?: Tone
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LogoMark({ text, accent = 'sunflowerGold', href = '#', size = 'md' }: LogoMarkProps) {
  return (
    <a
      className={`${styles.logo} ${styles[`size-${size}`]} ${toneClass('accent', accent)}`}
      href={href}
    >
      {text}
      <span className={styles.dot}>.</span>
    </a>
  )
}
