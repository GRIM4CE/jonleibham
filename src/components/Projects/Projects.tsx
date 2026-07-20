import { useState, type CSSProperties } from 'react'
import { Section, SectionTitle, Card, Tag, Tabs, Link, type Tone } from '../../design-system'
import styles from './Projects.module.css'

// Primary-tech tints for the generated card headers. Muted a touch so they
// harmonize with the warm palette rather than clashing as raw brand colors.
const TECH_TINT: Record<string, string> = {
  FastAPI: '#0d9488',
  Python: '#4b7fb5',
  SvelteKit: '#e5502a',
  'Svelte 5': '#e5502a',
  'Vue 3': '#3fa877',
  Vue: '#3fa877',
  'Next.js 16': '#4b5162',
  React: '#3a95b8',
  TypeScript: '#3877c0',
  Swift: '#e0533a',
  'Node.js': '#5a9350',
  ESP32: '#c9463f',
  'C++ / Arduino': '#1a8f95',
}

const FALLBACK_TINT = '#5b5f97' // dustyGrape

function tintFor(technologies: string[]): string {
  for (const tech of technologies) {
    if (TECH_TINT[tech]) return TECH_TINT[tech]
  }
  return FALLBACK_TINT
}

// --- Tag categories & filter grouping ------------------------------------

// Collapse framework variants and meta-frameworks onto a canonical family name,
// so filtering by "React" also matches "React 19" and "Next.js", and "Vue"
// matches "Nuxt". Cards keep their original tag text; only filtering uses this.
const TECH_ALIASES: Record<string, string> = {
  'Next.js': 'React',
  Nuxt: 'Vue',
  SvelteKit: 'Svelte',
  TailwindCSS: 'Tailwind CSS',
}

function canonicalTech(tech: string): string {
  // Strip a trailing version token: "React 19" → "React", "Tailwind CSS v4" → "Tailwind CSS".
  const base = tech.replace(/\s+v?\d+(?:\.\d+)*$/i, '').trim()
  return TECH_ALIASES[base] ?? base
}

// Each technology belongs to a discipline, which drives its tag color. Keyed by
// canonical name, so version variants (React 19) and meta-frameworks (Next.js)
// inherit their family's category automatically.
type TechCategory = 'frontend' | 'backend' | 'devops' | 'embedded' | 'testing'

const CATEGORY_TONE: Record<TechCategory, Tone> = {
  frontend: 'dustyGrape', // indigo
  backend: 'seaGreen', // green
  devops: 'sunflowerGold', // gold
  embedded: 'flagRed', // red
  testing: 'magentaBloom', // pink (reserved — nothing maps here yet)
}

const TECH_CATEGORY: Record<string, TechCategory> = {
  // Frontend — UI frameworks, styling, browser/app APIs
  React: 'frontend',
  Vue: 'frontend',
  Svelte: 'frontend',
  Vite: 'frontend',
  PWA: 'frontend',
  'Tailwind CSS': 'frontend',
  Sass: 'frontend',
  SCSS: 'frontend',
  'React Three Fiber': 'frontend',
  'Web Audio API': 'frontend',
  Swift: 'frontend',
  SwiftUI: 'frontend',
  PDFKit: 'frontend',
  macOS: 'frontend',
  // Backend — servers, runtimes, APIs, databases, AI
  FastAPI: 'backend',
  Express: 'backend',
  Flask: 'backend',
  'Node.js': 'backend',
  WebSockets: 'backend',
  'Discord.js': 'backend',
  Axios: 'backend',
  'TVDB API': 'backend',
  'Sharp.js': 'backend',
  ffmpeg: 'backend',
  'MLX Whisper': 'backend',
  'Claude API': 'backend',
  'TOTP Auth': 'backend',
  Python: 'backend',
  SQLite: 'backend',
  PostgreSQL: 'backend',
  MongoDB: 'backend',
  libSQL: 'backend',
  'Turso (libSQL)': 'backend',
  // DevOps / cloud / infra / tooling
  Docker: 'devops',
  'AWS Lambda': 'devops',
  'AWS Amplify': 'devops',
  'AWS Cognito': 'devops',
  Tailscale: 'devops',
  uv: 'devops',
  // Embedded
  ESP32: 'embedded',
  'C++ / Arduino': 'embedded',
}

// TypeScript and JavaScript run on both sides of the stack, so they borrow their
// color from the card: frontend if the card ships any UI tech, otherwise backend.
const WEB_LANGUAGES = new Set(['TypeScript', 'JavaScript'])

function categoryOf(tech: string): TechCategory | undefined {
  return TECH_CATEGORY[canonicalTech(tech)]
}

function toneForTech(tech: string, technologies: string[]): Tone {
  if (WEB_LANGUAGES.has(tech)) {
    const shipsUi = technologies.some((t) => categoryOf(t) === 'frontend')
    return CATEGORY_TONE[shipsUi ? 'frontend' : 'backend']
  }
  const category = categoryOf(tech)
  return category ? CATEGORY_TONE[category] : 'paleSlate' // neutral grey for anything unmapped
}

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
    title: 'Recipe Book',
    description:
      'A recipe app for two, styled after a Highball-inspired grid of colorful recipe cards with search, category filtering, and serving-size scaling. Anyone can browse; only I can add or edit — from the web app or a bearer-token API. A React 19 front end with an Express 5 backend on AWS Lambda, Turso (libSQL) for data, and S3 presigned uploads for photos, all behind Cognito auth on AWS Amplify.',
    technologies: [
      'React 19',
      'TypeScript',
      'Vite',
      'Express 5',
      'AWS Lambda',
      'Turso (libSQL)',
      'AWS Cognito',
    ],
    built: 'July 2026',
    liveUrl: 'https://recipes.jonleibham.com/',
    repoUrl: 'https://github.com/GRIM4CE/recipe-book',
  },
  {
    title: 'Stonk',
    description:
      'My covered-call income and stock-discovery cockpit, with Claude in the loop for screening and discovery. Deterministic screeners rank the best near-dated covered-call setups across a ~600-name universe, dig up undervalued and turnaround names, and track my open positions — with Discord and email alerts when a fresh setup or a buy-back target hits. Market data is pluggable: yfinance, Tradier, or the Schwab Trader API.',
    technologies: ['FastAPI', 'Python', 'Vue 3', 'TypeScript', 'Claude API', 'Docker'],
    built: 'July 2026',
  },
  {
    title: 'Finance PWA',
    description:
      'A private, installable finance PWA I built to replace a stack of Google Sheets: net worth, budgets, recurring bills, transactions, and a stock portfolio for a two-person household. Handles multi-currency accounts, AI-assisted CSV/PDF statement import and categorization, and historical net-worth snapshots. Self-hosted on a Synology NAS, reachable only over Tailscale.',
    technologies: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind CSS v4', 'libSQL', 'PWA'],
    built: 'April 2026',
  },
  {
    title: 'Job Finder',
    description:
      'A Vue + TypeScript PWA that uses Claude to tailor my resume to any job posting, call out skill gaps, and track the whole application pipeline from first search to follow-up.',
    technologies: [
      'Vue 3',
      'TypeScript',
      'Tailwind CSS',
      'Claude API',
      'Node.js',
      'Express',
      'SQLite',
    ],
    built: 'April 2026',
  },
  {
    title: 'Todos PWA',
    description:
      'A Next.js 16 PWA for personal and household todos and habit tracking, with TOTP auth and a daily cleanup cron. Self-hosted on a Synology NAS behind Tailscale.',
    technologies: [
      'Next.js 16',
      'TypeScript',
      'SQLite',
      'Tailwind CSS',
      'TOTP Auth',
      'Tailscale',
    ],
    built: 'April 2026',
  },
  {
    title: 'Uppercut',
    description:
      'A self-hosted uploader PWA for my NAS: snap a photo, record video or a voice note, upload a document, or fire off a message from any device, and it all lands as neatly organized files with JSON metadata on my own storage. Installs to the home screen and captures straight from the device camera and mic. Locked behind Tailscale — nothing exposed to the public internet.',
    technologies: ['React', 'Vite', 'Express', 'Docker', 'Tailscale'],
    built: 'July 2026',
  },
  {
    title: 'Joebot',
    description:
      "A Discord bot that answers in one specific friend's voice. It builds a persona profile from a corpus of things he's actually written, then replies in-character when mentioned (with server-side web search for current events) or dodges with a weighted-random canned one-liner. Hard-capped Claude usage and a hand-maintained guardrails file keep it on-brand.",
    technologies: ['TypeScript', 'Node.js', 'Claude API', 'Discord.js'],
    built: 'June 2026',
  },
  {
    title: 'Stamp',
    description:
      'A native macOS app for stamping invoices ahead of accountant review. Drag in many PDFs at once, mark each 100% or 50% tax-deductible, and the app stamps a badge onto page one, auto-placed in the largest area of whitespace, with drag-to-adjust preview. Originals are never modified. No Electron, no runtime dependencies.',
    technologies: ['Swift', 'SwiftUI', 'PDFKit', 'macOS'],
    built: 'June 2026',
    repoUrl: 'https://github.com/GRIM4CE/stamp',
  },
  {
    title: 'Photoesthesia',
    description:
      'A small system that translates light into sound. An ESP32 reads light through a photosensor and streams the values over serial; a Python service relays the stream to a React + TypeScript client, where React Three Fiber renders the signal as a live WebGL scene while the Web Audio API renders it sonically. The same signal, expressed two ways. A ground-up rewrite of Sunspot.',
    technologies: ['ESP32', 'Python', 'React', 'TypeScript', 'React Three Fiber', 'Web Audio API'],
    built: 'April 2026',
    repoUrl: 'https://github.com/GRIM4CE/photoesthesia',
  },
  {
    title: 'Chat App',
    description:
      'A real-time chat app with WebSocket messaging and basic auth — a small full-stack exercise in Node, Express, and PostgreSQL.',
    technologies: ['Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'JavaScript'],
    built: 'April 2026',
    liveUrl: 'https://claude-sandbox-1x1f.onrender.com',
    repoUrl: 'https://github.com/GRIM4CE/chat-app',
  },
  {
    title: 'Web Synth Wizard',
    description:
      'A synthesizer that runs entirely in the browser, built on Vue 3 and the Web Audio API — patch together and tweak sounds with no plugins or installs.',
    technologies: ['Vue 3', 'TypeScript', 'Web Audio API', 'Sass', 'Vite'],
    built: 'January 2024',
    liveUrl: 'https://websynthwizard.com/',
    repoUrl: 'https://github.com/GRIM4CE/web-synth-wizard',
    screenshot: '/web-synth-wizard-screenshot.png',
  },
  {
    title: 'bhamdesigns',
    description:
      'My old design portfolio, kept around as an archive of past work — a Nuxt 4 site with project galleries, fully prerendered to static HTML at build time for fast loads and clean SEO, deployed on AWS Amplify.',
    technologies: ['Nuxt 4', 'Vue', 'TypeScript', 'SCSS', 'AWS Amplify'],
    built: 'August 2022',
    liveUrl: 'https://bhamdesigns.com',
    repoUrl: 'https://github.com/GRIM4CE/bhamdesigns',
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
    title: 'transcribe',
    description:
      'Local speech-to-text with speaker diarization. Transcribes video/audio to text using MLX Whisper on Apple Silicon, with speakers auto-detected via voice-embedding clustering. No cloud, no API keys.',
    technologies: ['Python', 'MLX Whisper', 'uv', 'ffmpeg'],
    built: 'June 2026',
    repoUrl: 'https://github.com/GRIM4CE/transcribe',
  },
  {
    title: 'm4a2wav',
    description:
      'Small Node.js batch converter that turns Apple M4A files into WAVs.',
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
      'Script that uses the TVDB API to auto-format TV series filenames.',
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

const cardAccent: Tone = 'dustyGrape'

const ALL_FILTER = 'All'

// Technologies used by more than one item make useful filters; single-use
// tech would just create dead-end filters showing one card. Grouped by canonical
// family (so React 19 / Next.js all count toward "React"), deduped per item.
function deriveFilters(items: { technologies: string[] }[]): string[] {
  const counts = new Map<string, number>()
  items.forEach((item) => {
    const families = new Set(item.technologies.map(canonicalTech))
    families.forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1))
  })
  return Array.from(counts.entries())
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t)
}

const projectFilters = deriveFilters(projects)
const utilityFilters = deriveFilters(utilities)

interface FilterBarProps {
  filters: string[]
  active: string
  onChange: (value: string) => void
  label: string
}

function FilterBar({ filters, active, onChange, label }: FilterBarProps) {
  return (
    <Tabs
      items={[ALL_FILTER, ...filters]}
      active={active}
      onChange={onChange}
      label={label}
      align="center"
    />
  )
}

export function Projects() {
  const [projectFilter, setProjectFilter] = useState<string>(ALL_FILTER)
  const [utilityFilter, setUtilityFilter] = useState<string>(ALL_FILTER)

  const visibleProjects =
    projectFilter === ALL_FILTER
      ? projects
      : projects.filter((project) =>
          project.technologies.some((t) => canonicalTech(t) === projectFilter),
        )

  const visibleUtilities =
    utilityFilter === ALL_FILTER
      ? utilities
      : utilities.filter((utility) =>
          utility.technologies.some((t) => canonicalTech(t) === utilityFilter),
        )

  return (
    <>
      <Section id="projects" surface="porcelain">
        <SectionTitle accent="sunflowerGold">My Projects</SectionTitle>
        <FilterBar
          filters={projectFilters}
          active={projectFilter}
          onChange={setProjectFilter}
          label="Filter projects by technology"
        />
        <div className={styles.projectsGrid}>
          {visibleProjects.map((project) => (
            <Card
              key={project.title}
              accent={cardAccent}
              accentSide="top"
              bg="porcelain"
              textTone="midnightViolet"
            >
              <div
                className={styles.accentRule}
                style={{ '--tint': tintFor(project.technologies) } as CSSProperties}
                aria-hidden="true"
              />
              {project.screenshot && (
                <a
                  href={project.liveUrl ?? project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} screenshot (opens in a new tab)`}
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
                  {project.technologies.map((tech) => (
                    <Tag
                      key={tech}
                      tone={toneForTech(tech, project.technologies)}
                      variant="soft"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
                {(project.liveUrl || project.repoUrl) && (
                  <div className={styles.links}>
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site (opens in a new tab)`}
                      >
                        Live Site
                      </Link>
                    )}
                    {project.repoUrl && (
                      <Link
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} source code (opens in a new tab)`}
                      >
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
        <FilterBar
          filters={utilityFilters}
          active={utilityFilter}
          onChange={setUtilityFilter}
          label="Filter utilities by technology"
        />
        <div className={styles.projectsGrid}>
          {visibleUtilities.map((utility) => (
            <Card
              key={utility.title}
              accent={cardAccent}
              accentSide="top"
              bg="porcelain"
              textTone="midnightViolet"
            >
              <div
                className={styles.accentRule}
                style={{ '--tint': tintFor(utility.technologies) } as CSSProperties}
                aria-hidden="true"
              />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{utility.title}</h3>
                  <span className={styles.built}>{utility.built}</span>
                </div>
                <p className={styles.cardDescription}>{utility.description}</p>
                <div className={styles.technologies}>
                  {utility.technologies.map((tech) => (
                    <Tag
                      key={tech}
                      tone={toneForTech(tech, utility.technologies)}
                      variant="soft"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
                <div className={styles.links}>
                  <Link
                    href={utility.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${utility.title} source code (opens in a new tab)`}
                  >
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
