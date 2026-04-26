import { type FormEvent, useCallback, useRef } from 'react'
import { Section, SectionTitle, Field, Button } from '../../design-system'
import styles from './Contact.module.css'

const user = 'jon'
const domain = 'jonleibham.com'

export function Contact() {
  const honeypotRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (honeypotRef.current?.value) return

    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const message = data.get('message') as string

    const subject = encodeURIComponent(`Contact from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )

    window.location.href = `mailto:${user}@${domain}?subject=${subject}&body=${body}`
  }, [])

  return (
    <Section id="contact" surface="porcelain">
      <div className={styles.inner}>
        <SectionTitle accent="magentaBloom">Get In Touch</SectionTitle>
        <p className={styles.subtitle}>
          Have a question or want to work together? Drop me a message!
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p hidden>
            <label>
              Don't fill this out: <input ref={honeypotRef} name="bot-field" />
            </label>
          </p>
          <Field tone="magentaBloom">
            <Field.Label htmlFor="name">Name</Field.Label>
            <Field.Input type="text" id="name" name="name" required />
          </Field>
          <Field tone="magentaBloom">
            <Field.Label htmlFor="email">Email</Field.Label>
            <Field.Input type="email" id="email" name="email" required />
          </Field>
          <Field tone="magentaBloom">
            <Field.Label htmlFor="message">Message</Field.Label>
            <Field.Textarea id="message" name="message" rows={5} required />
          </Field>
          <Button
            type="submit"
            variant="gradient"
            tone="magentaBloom"
            gradientTone="flagRed"
            size="lg"
          >
            Send Message
          </Button>
        </form>
      </div>
    </Section>
  )
}
