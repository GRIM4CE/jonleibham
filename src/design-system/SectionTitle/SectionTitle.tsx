import type { ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './SectionTitle.module.css'

export interface SectionTitleProps {
  accent?: Tone
  align?: 'left' | 'center'
  size?: 'md' | 'lg'
  as?: 'h2' | 'h3'
  children: ReactNode
}

export function SectionTitle({
  accent = 'sunflowerGold',
  align = 'center',
  size = 'lg',
  as: Tag = 'h2',
  children,
}: SectionTitleProps) {
  const className = [
    styles.title,
    styles[`align-${align}`],
    styles[`size-${size}`],
    toneClass('accent', accent),
  ].join(' ')

  return (
    <Tag className={className}>
      <span className={styles.text}>{children}</span>
    </Tag>
  )
}
