import type { CSSProperties, ReactNode } from 'react'
import { toneVar, type Tone } from '../tokens'
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
  return (
    <Tag
      className={`${styles.title} ${styles[`align-${align}`]} ${styles[`size-${size}`]}`}
      style={{ '--title-accent': toneVar[accent] } as CSSProperties}
    >
      <span className={styles.text}>{children}</span>
    </Tag>
  )
}
