import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Button.module.css'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  tone?: Tone
  gradientTone?: Tone
  variant?: ButtonVariant
  size?: ButtonSize
  textTone?: Tone
  children: ReactNode
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const {
    tone = 'dustyGrape',
    gradientTone = 'midnightViolet',
    variant = 'solid',
    size = 'md',
    textTone = 'porcelain',
    children,
    ...rest
  } = props as BaseProps & Record<string, unknown>

  const className = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    toneClass('accent', tone),
    toneClass('accent2', gradientTone),
    toneClass('text', textTone),
  ].join(' ')

  if (props.as === 'a') {
    const { as: _as, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { as?: string }
    void _as
    return (
      <a className={className} {...anchorRest}>
        {children}
      </a>
    )
  }

  const { as: _as, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { as?: string }
  void _as
  return (
    <button className={className} {...buttonRest}>
      {children}
    </button>
  )
}
