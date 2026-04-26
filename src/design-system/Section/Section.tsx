import type { CSSProperties, ReactNode } from 'react'
import { surfaceColor, type Surface } from '../tokens'
import styles from './Section.module.css'

export interface SectionProps {
  id?: string
  surface?: Surface
  maxWidth?: number
  paddingY?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Section({
  id,
  surface = 'porcelain',
  maxWidth = 1200,
  paddingY = 'lg',
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[`pad-${paddingY}`]}`}
      style={{ '--section-bg': surfaceColor[surface] } as CSSProperties}
    >
      <div className={styles.container} style={{ maxWidth: `${maxWidth}px` }}>
        {children}
      </div>
    </section>
  )
}
