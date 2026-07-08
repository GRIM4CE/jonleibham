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
    title: 'Stonk',
    description:
      'A personal options-income and stock-discovery cockpit with Claude in the loop for screening, discovery, and conversational research. Deterministic screeners rank covered-call setups across a ~600-name universe, surface undervalued and turnaround names, and flag meme spikes, with Discord/email alerts on holdings and a Claude chat agent that drives the same screeners via tool use. Informational only, not investment advice. Architected and directed end-to-end, implemented with AI pair-programming.',
    technologies: ['FastAPI', 'Python', 'Vue 3', 'TypeScript', 'Claude API', 'Docker'],
    built: 'May 2026',
  },
  {
    title: 'Traitor',
    description:
      'A security-first engine for automated equity trading against the Schwab Trader API. Strategies are treated as untrusted and only emit intents; the engine independently enforces hard guardrails: symbol allowlists, per-order/day dollar caps, cash-only limit orders, and an equity-floor auto-halt kill switch. Real orders require two independent opt-ins, secrets are Fernet-encrypted at rest, and every decision (including blocked orders) is written to an append-only audit journal. Architected and directed end-to-end, implemented with AI pair-programming.',
    technologies: ['Python', 'Schwab Trader API', 'Vue 3', 'Cryptography (Fernet)', '1Password CLI'],
    built: 'July 2026',
  },
  {
    title: 'Finance PWA',
    description:
      'A private, installable household finance PWA built to replace a stack of Google Sheets: net worth, budgets, recurring bills, transactions, and a stock portfolio for a two-person household. Handles multi-currency accounts, AI-assisted CSV/PDF statement import and categorization, and historical net-worth snapshots. Self-hosted on a Synology NAS and reachable only over a private Tailscale network. Architected and directed end-to-end, implemented with AI pair-programming.',
    technologies: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind CSS v4', 'libSQL', 'PWA'],
    built: 'April 2026',
  },
  {
    title: 'Job Finder',
    description:
      'A personal Vue + TypeScript PWA that uses Claude AI to tailor your resume to any job posting, surface skill gaps, and manage the full application pipeline from search to follow-up. Architected and directed end-to-end, implemented with AI pair-programming.',
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
    title: 'Todos PWA',
    description:
      'A Next.js 16 progressive web app for personal and household todo and habit tracking with TOTP-based authentication and a daily cleanup cron, self-hosted on a Synology NAS behind Tailscale. Architected and directed end-to-end, implemented with AI pair-programming.',
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
      'A self-hosted uploader PWA for your NAS: snap photos, record video or voice notes, upload documents, and send messages from any device, and they land as neatly organized files with JSON metadata on your own storage. Installs to the home screen and captures straight from the device camera and mic. Access is locked to a private Tailscale network, with nothing exposed to the public internet. Architected and directed end-to-end, implemented with AI pair-programming.',
    technologies: ['React', 'Vite', 'Express', 'Docker', 'Tailscale'],
    built: 'July 2026',
  },
  {
    title: 'Joebot',
    description:
      "A Discord bot that answers in one specific person's voice. It builds a persona profile from a corpus of things he's actually written, then replies in-character when mentioned (with server-side web search for current events) or dodges with a weighted-random canned one-liner. Hard-capped Claude usage and a hand-maintained guardrails file keep it on-brand. Architected and directed end-to-end, implemented with AI pair-programming.",
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
      'A real-time chat application I architected and directed end-to-end, implemented with AI pair-programming. Features basic authentication and WebSocket-based messaging.',
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

const cardAccent: Tone = 'dustyGrape'

const ALL_FILTER = 'All'

// Technologies used by more than one item make useful filters; single-use
// tech would just create dead-end filters showing one card.
function deriveFilters(items: { technologies: string[] }[]): string[] {
  const counts = new Map<string, number>()
  items.forEach((item) => item.technologies.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
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
      : projects.filter((project) => project.technologies.includes(projectFilter))

  const visibleUtilities =
    utilityFilter === ALL_FILTER
      ? utilities
      : utilities.filter((utility) => utility.technologies.includes(utilityFilter))

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
                      tone="dustyGrape"
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
                      tone="dustyGrape"
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
