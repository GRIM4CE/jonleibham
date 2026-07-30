import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Button.module.css'

/**
 * `icon` is the circular variant used for the detail screen's back and share
 * controls and the About screen's social marks.
 *
 * There is deliberately no `gradient` variant: this design is flat throughout,
 * and keeping one around would only invite a gradient back in.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'icon'

/** sm = Career "Résumé" pill, md = 50px, lg = 52px, xl = 56px. */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface BaseProps {
  tone?: Tone
  variant?: ButtonVariant
  size?: ButtonSize
  textTone?: Tone
  /** Stretch to the container width, as in the Home action stack. */
  block?: boolean
  children: ReactNode
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const {
    tone = 'sunflowerGold',
    variant = 'solid',
    size = 'lg',
    textTone = 'midnightViolet',
    block = false,
    children,
    // Pulled out of `rest` deliberately: spreading it would overwrite the
    // component's own classes instead of adding to them.
    className: extraClassName = '',
    ...rest
  } = props as BaseProps & Record<string, unknown> & { className?: string }

  const className = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    block ? styles.block : '',
    toneClass('accent', tone),
    toneClass('text', textTone),
    extraClassName,
  ]
    .filter(Boolean)
    .join(' ')

  if (props.as === 'a') {
    const { as: _as, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: string
    }
    void _as
    return (
      <a className={className} {...anchorRest}>
        {children}
      </a>
    )
  }

  const { as: _as, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: string
  }
  void _as
  return (
    <button className={className} {...buttonRest}>
      {children}
    </button>
  )
}
