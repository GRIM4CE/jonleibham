import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { toneClass } from '../tones'
import type { Tone } from '../tokens'
import styles from './Field.module.css'

export interface FieldProps {
  tone?: Tone
  children: ReactNode
}

export function Field({ tone = 'magentaBloom', children }: FieldProps) {
  return <div className={`${styles.field} ${toneClass('accent', tone)}`}>{children}</div>
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
