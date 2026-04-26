import type {
  CSSProperties,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { toneVar, type Tone } from '../tokens'
import styles from './Field.module.css'

export interface FieldProps {
  tone?: Tone
  children: ReactNode
}

export function Field({ tone = 'magentaBloom', children }: FieldProps) {
  const style: CSSProperties = { '--field-tone': toneVar[tone] } as CSSProperties
  return (
    <div className={styles.field} style={style}>
      {children}
    </div>
  )
}

function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={styles.label} {...props} />
}

function FieldInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />
}

function FieldTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...props} />
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Textarea = FieldTextarea
