import { useState } from 'react'
import styles from './About.module.css'

const skillCategories = {
  'Languages & Frameworks': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Vue', 'React', 'Nuxt', 'Next.js', 'Node.js', 'Nest.js', 'Ruby on Rails', 'Storybook'],
  Testing: ['Jest', 'Vitest', 'Cypress', 'K6', 'Chromatic', 'A11y'],
  'Data & APIs': ['GraphQL', 'MySQL', 'NoSQL', 'MongoDB'],
  'DevOps & Tools': ['Git', 'Docker', 'Kubernetes', 'Helm3', 'AWS', 'Vite', 'TurboRepo'],
  AI: ['Claude', 'ChatGPT', 'Copilot', 'Cursor'],
}

type Category = keyof typeof skillCategories

export function About() {
  const [activeTab, setActiveTab] = useState<Category>('Languages & Frameworks')

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Me</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            <p>
              I'm a Senior Software Engineer with a focus on frontend development.
              I specialize in building design systems and monorepos that enable
              teams to deliver seamless, consistent user experiences at scale.
            </p>
            <p>
              I'm passionate about crafting intuitive interfaces, establishing
              robust component libraries, and creating developer tooling that
              makes teams more productive.
            </p>
            <p>
              When I'm not coding, you can find me in my workshop doing woodworking,
              building synthesizers, experimenting in the kitchen, or relaxing with
              my wife and son.
            </p>
          </div>
          <div className={styles.skills}>
            <h3>Technologies I work with:</h3>

            <div className={styles.tabs}>
              {Object.keys(skillCategories).map((category) => (
                <button
                  key={category}
                  className={`${styles.tab} ${activeTab === category ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(category as Category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <ul className={styles.skillList}>
              {skillCategories[activeTab].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
