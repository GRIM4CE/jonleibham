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
      'A personal Vue + TypeScript PWA that uses Claude AI to tailor your resume to any job posting, surface skill gaps, and manage the full application pipeline from search to follow-up. Built entirely with Claude AI, zero hand-written code.',
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
      'A simple real-time chat application built entirely by Claude AI without writing a single line of code. Features basic authentication and WebSocket-based messaging.',
    technologies: ['Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'JavaScript'],
    built: 'April 2026',
    liveUrl: 'https://claude-sandbox-1x1f.onrender.com',
    repoUrl: 'https://github.com/GRIM4CE/chat-app',
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

export function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Projects</h2>

        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <article key={project.title} className={styles.projectCard}>
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
                  <span className={styles.built}>
                    {project.built}
                  </span>
                </div>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>
                {(project.liveUrl || project.repoUrl) && (
                  <div className={styles.links}>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Site
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <h3 className={styles.sectionTitle}>Utilities</h3>
        <div className={styles.utilitiesGrid}>
          {utilities.map((utility) => (
            <article key={utility.title} className={styles.utilityCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{utility.title}</h3>
                  <span className={styles.built}>
                    {utility.built}
                  </span>
                </div>
                <p className={styles.cardDescription}>
                  {utility.description}
                </p>
                <div className={styles.technologies}>
                  {utility.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={styles.links}>
                  <a
                    href={utility.repoUrl}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
