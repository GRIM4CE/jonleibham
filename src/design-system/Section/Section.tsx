import type { ReactNode } from 'react'
import { surfaceClass } from '../tones'
import type { Surface } from '../tokens'
import styles from './Section.module.css'

export interface SectionProps {
  id?: string
  surface?: Surface
  paddingY?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Section({
  id,
  surface = 'porcelain',
  paddingY = 'lg',
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[`pad-${paddingY}`]} ${surfaceClass(surface)}`}
    >
      <div className={styles.container}>{children}</div>
    </section>
  )
}
