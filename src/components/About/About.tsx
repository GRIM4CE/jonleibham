import { useState } from 'react'
import { Section, SectionTitle, Tag, type Tone } from '../../design-system'
import styles from './About.module.css'

const skillCategories = {
  'Languages & Frameworks': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Vue', 'React', 'Nuxt', 'Next.js', 'Node.js', 'Nest.js', 'Ruby on Rails', 'Storybook'],
  Testing: ['Jest', 'Vitest', 'Cypress', 'K6', 'Chromatic', 'A11y'],
  'Data & APIs': ['GraphQL', 'MySQL', 'NoSQL', 'MongoDB'],
  'DevOps & Tools': ['Git', 'Docker', 'Kubernetes', 'Helm3', 'AWS', 'Vite', 'TurboRepo'],
  AI: ['Claude', 'ChatGPT', 'Copilot', 'Cursor'],
}

type Category = keyof typeof skillCategories

const categoryTones: Record<Category, Tone> = {
  'Languages & Frameworks': 'dustyGrape',
  Testing: 'seaGreen',
  'Data & APIs': 'sunflowerGold',
  'DevOps & Tools': 'magentaBloom',
  AI: 'grapefruitPink',
}

const skillRotation: Tone[] = ['dustyGrape', 'seaGreen', 'magentaBloom', 'sunflowerGold', 'grapefruitPink']

export function About() {
  const [activeTab, setActiveTab] = useState<Category>('Languages & Frameworks')

  return (
    <Section id="about" surface="paleSlate90">
      <SectionTitle accent="sunflowerGold">About Me</SectionTitle>
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
          <h3 className={styles.skillsHeading}>Technologies I work with:</h3>

          <div className={styles.tabs}>
            {(Object.keys(skillCategories) as Category[]).map((category) => (
              <Tag
                key={category}
                tone={categoryTones[category]}
                textTone={category === 'Data & APIs' ? 'midnightViolet' : 'porcelain'}
                interactive
                selected={activeTab === category}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </Tag>
            ))}
          </div>

          <div className={styles.skillList}>
            {skillCategories[activeTab].map((skill, i) => (
              <Tag key={skill} tone={skillRotation[i % skillRotation.length]} variant="soft">
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
