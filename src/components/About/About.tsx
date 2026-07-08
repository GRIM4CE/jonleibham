import { useState } from 'react'
import { Section, SectionTitle, Tag, Tabs } from '../../design-system'
import styles from './About.module.css'

const skillCategories = {
  'Languages & Frameworks': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Vue', 'React', 'Nuxt', 'Next.js', 'Node.js', 'Nest.js', 'Ruby on Rails', 'Storybook'],
  Testing: ['Jest', 'Vitest', 'Cypress', 'K6', 'Chromatic', 'A11y'],
  'Data & APIs': ['GraphQL', 'MySQL', 'NoSQL', 'MongoDB'],
  'DevOps & Tools': ['Git', 'Docker', 'Kubernetes', 'Helm3', 'AWS', 'Vite', 'TurboRepo'],
  AI: ['Claude', 'ChatGPT', 'Copilot', 'Cursor'],
}

type Category = keyof typeof skillCategories

const categoryLabels: Record<Category, string> = {
  'Languages & Frameworks': 'Languages',
  Testing: 'Testing',
  'Data & APIs': 'Data & APIs',
  'DevOps & Tools': 'DevOps',
  AI: 'AI',
}

export function About() {
  const [activeTab, setActiveTab] = useState<Category>('Languages & Frameworks')

  return (
    <Section id="about" surface="paleSlate90">
      <SectionTitle accent="sunflowerGold">About Me</SectionTitle>
      <div className={styles.content}>
        <img
          src="/jon-leibham.jpg"
          srcSet="/jon-leibham.jpg 900w, /jon-leibham@2x.jpg 1400w"
          sizes="(max-width: 768px) 100vw, 300px"
          width={900}
          height={763}
          alt="Jon Leibham"
          className={styles.photo}
          loading="lazy"
        />
        <div className={styles.main}>
          <div className={styles.text}>
            <p>
              I'm a Senior Software Engineer with 10+ years focused on frontend.
              I build the design systems and monorepos that let teams ship
              consistent experiences at scale — from migrating a 1.5M+ listing
              platform to Vue 3 and the Composition API, to a Storybook design
              system unifying five applications.
            </p>
            <p>
              The fundamentals are where I go deep: I've cut bundle size by 80%,
              brought load times from 2s to 0.5s, and built the component
              libraries and developer tooling that make teams faster.
            </p>
            <p>
              Lately I ship complete, AI-native products end to end, self-hosted
              and security-first, from guardrailed trading engines to
              Claude-powered PWAs running on my own hardware.
            </p>
            <p>
              When I'm not coding, you can find me in my workshop doing woodworking,
              building synthesizers, experimenting in the kitchen, or relaxing with
              my wife and son.
            </p>
          </div>
          <div className={styles.skills}>
          <h3 className={styles.skillsHeading}>Technologies I work with:</h3>

          <Tabs
            items={Object.keys(skillCategories)}
            active={activeTab}
            onChange={(value) => setActiveTab(value as Category)}
            renderLabel={(category) => categoryLabels[category as Category]}
            label="Technology categories"
          />

          <div
            className={styles.skillList}
            aria-live="polite"
            aria-label={`${activeTab} technologies`}
          >
            {skillCategories[activeTab].map((skill) => (
              <Tag key={skill} tone="dustyGrape" variant="soft">
                {skill}
              </Tag>
            ))}
          </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
