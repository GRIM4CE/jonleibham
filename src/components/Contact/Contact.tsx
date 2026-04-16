import { type FormEvent, useCallback, useRef } from 'react'
import styles from './Contact.module.css'

// Email is split into parts and assembled at runtime
// so bots scraping static HTML can't harvest it
const user = 'jon'
const domain = 'jonleibham.com'

export function Contact() {
  const honeypotRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // If the hidden honeypot field is filled, a bot submitted the form
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
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.title}>Get In Touch</h2>
        <p className={styles.subtitle}>
          Have a question or want to work together? Drop me a message!
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p hidden>
            <label>
              Don't fill this out: <input ref={honeypotRef} name="bot-field" />
            </label>
          </p>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              rows={5}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
