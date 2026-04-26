import { Section, SectionTitle, Card, Tag, Link, type Tone } from '../../design-system'
import styles from './Projects.module.css'

interface Project {
  title: string
  description: string
  technologies: string[]
  built: string
  liveUrl?: string
  repoUrl?: string
  screenshot?: string
}

interface Utility {
  title: string
  description: string
  technologies: string[]
  built: string
  repoUrl: string
}

const projects: Project[] = [
  {
    title: 'Job Finder',
    description:
      'A personal Vue + TypeScript PWA that uses Claude AI to tailor your resume to any job posting, surface skill gaps, and manage the full application pipeline from search to follow-up. Built with Claude AI under my architecture and direction.',
    technologies: [
      'Vue 3',
      'TypeScript',
      'TailwindCSS',
      'Claude API',
      'Node.js',
      'Express',
      'SQLite',
    ],
    built: 'April 2026',
  },
  {
    title: 'Chat App',
    description:
      'A simple real-time chat application built with Claude AI under my architecture and direction. Features basic authentication and WebSocket-based messaging.',
    technologies: ['Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'JavaScript'],
    built: 'April 2026',
    liveUrl: 'https://claude-sandbox-1x1f.onrender.com',
    repoUrl: 'https://github.com/GRIM4CE/chat-app',
  },
  {
    title: 'Todos PWA',
    description:
      'A Next.js 16 progressive web app for personal todo management with TOTP-based authentication, Drizzle ORM over Turso (libSQL) in production with a local SQLite fallback, and a daily cleanup cron. Built with Claude AI under my architecture and direction.',
    technologies: [
      'Next.js 16',
      'TypeScript',
      'Drizzle ORM',
      'Turso / libSQL',
      'Tailwind CSS',
      'TOTP Auth',
    ],
    built: 'April 2026',
    repoUrl: 'https://github.com/GRIM4CE/todos-pwa',
  },
  {
    title: 'Web Synth Wizard',
    description:
      'A web-based synthesizer application built with Vue 3 and the Web Audio API, allowing users to create and manipulate sounds directly in the browser.',
    technologies: ['Vue 3', 'TypeScript', 'Web Audio API', 'Sass', 'Vite'],
    built: 'January 2024',
    liveUrl: 'https://websynthwizard.com/',
    repoUrl: 'https://github.com/GRIM4CE/web-synth-wizard',
    screenshot: '/web-synth-wizard-screenshot.png',
  },
  {
    title: 'bham',
    description:
      'My previous personal portfolio: a TypeScript monorepo housing a custom design system, Storybook documentation, and the portfolio site itself, all deployed via AWS Amplify.',
    technologies: ['TypeScript', 'Vue', 'Storybook', 'SCSS', 'AWS Amplify', 'Monorepo'],
    built: 'January 2024',
    repoUrl: 'https://github.com/GRIM4CE/bham',
  },
  {
    title: 'Sunspot',
    description:
      'An end-to-end IoT environmental monitor: an ESP32 firmware (Arduino/C++) reads light (BH1750) and temperature/humidity (DHT22) and posts readings to a Flask + MongoDB API, with an AWS Lambda relay and a Vue 3 dashboard for viewing the data.',
    technologies: ['ESP32', 'C++ / Arduino', 'Python', 'Flask', 'MongoDB', 'AWS Lambda', 'Vue 3'],
    built: 'February 2024',
    repoUrl: 'https://github.com/GRIM4CE/sunspot',
  },
]

const utilities: Utility[] = [
  {
    title: 'm4a2wav',
    description:
      'Simple Node.js batch audio converter that converts Apple M4A files to WAV format.',
    technologies: ['Node.js', 'JavaScript'],
    built: 'May 2024',
    repoUrl: 'https://github.com/GRIM4CE/m4a2wav',
  },
  {
    title: 'node-image-processor',
    description:
      'Node.js image processor prototype built with Sharp.js for batch image manipulation.',
    technologies: ['Node.js', 'Sharp.js'],
    built: 'March 2021',
    repoUrl: 'https://github.com/GRIM4CE/node-image-processor',
  },
  {
    title: 'TV Formatter',
    description:
      'Script that utilizes the TVDB API to automatically format TV series filenames.',
    technologies: ['Node.js', 'Axios', 'TVDB API'],
    built: 'February 2022',
    repoUrl: 'https://github.com/GRIM4CE/tv-formater',
  },
  {
    title: 'photo-rename',
    description:
      'Script to batch rename photo files for a legacy portfolio site.',
    technologies: ['Node.js'],
    built: 'February 2022',
    repoUrl: 'https://github.com/GRIM4CE/photo-rename',
  },
]

const projectAccents: Tone[] = ['dustyGrape', 'seaGreen', 'magentaBloom']
const utilityAccents: Tone[] = ['sunflowerGold', 'grapefruitPink', 'seaGreen']
const techToneRotation: Tone[] = ['dustyGrape', 'seaGreen', 'magentaBloom', 'sunflowerGold']

export function Projects() {
  return (
    <>
      <Section id="projects" surface="porcelain">
        <SectionTitle accent="seaGreen">My Projects</SectionTitle>
        <div className={styles.projectsGrid}>
          {projects.map((project, idx) => (
            <Card
              key={project.title}
              accent={projectAccents[idx % projectAccents.length]}
              accentSide="top"
              bg="porcelain"
              textTone="midnightViolet"
            >
              {project.screenshot && (
                <a
                  href={project.liveUrl ?? project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={project.screenshot}
                    alt={`${project.title} screenshot`}
                    className={styles.screenshot}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </a>
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <span className={styles.built}>{project.built}</span>
                </div>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech, i) => (
                    <Tag
                      key={tech}
                      tone={techToneRotation[i % techToneRotation.length]}
                      variant="soft"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
                {(project.liveUrl || project.repoUrl) && (
                  <div className={styles.links}>
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Site
                      </Link>
                    )}
                    {project.repoUrl && (
                      <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        Source Code
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="utilities" surface="paleSlate90">
        <SectionTitle accent="sunflowerGold">Utilities</SectionTitle>
        <div className={styles.utilitiesGrid}>
          {utilities.map((utility, idx) => (
            <Card
              key={utility.title}
              accent={utilityAccents[idx % utilityAccents.length]}
              accentSide="left"
              bg="porcelain"
              textTone="midnightViolet"
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{utility.title}</h3>
                  <span className={styles.built}>{utility.built}</span>
                </div>
                <p className={styles.cardDescription}>{utility.description}</p>
                <div className={styles.technologies}>
                  {utility.technologies.map((tech, i) => (
                    <Tag
                      key={tech}
                      tone={techToneRotation[i % techToneRotation.length]}
                      variant="soft"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
                <div className={styles.links}>
                  <Link href={utility.repoUrl} target="_blank" rel="noopener noreferrer">
                    Source Code
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
