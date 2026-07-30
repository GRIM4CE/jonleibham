import type { Tone } from '../../design-system'


// Primary-tech tints for the generated card headers. Muted a touch so they
// harmonize with the warm palette rather than clashing as raw brand colors.
//
// The colors themselves live in Projects.module.css, one rule per tint, because
// a card can no longer set `--tint` through an inline style — the deployed CSP
// (`style-src 'self'`) drops style attributes. This map only picks which tint a
// card wears. Lookup is by exact tech string, not canonical family, so
// "React 19" deliberately falls through to the next entry.
const TECH_TINT: Record<string, TintName> = {
  FastAPI: 'fastapi',
  Python: 'python',
  SvelteKit: 'svelte',
  'Svelte 5': 'svelte',
  'Vue 3': 'vue',
  Vue: 'vue',
  'Next.js 16': 'next',
  React: 'react',
  TypeScript: 'typescript',
  Swift: 'swift',
  'Node.js': 'node',
  ESP32: 'esp32',
  'C++ / Arduino': 'arduino',
}

export const tintNames = [
  'fastapi',
  'python',
  'svelte',
  'vue',
  'next',
  'react',
  'typescript',
  'swift',
  'node',
  'esp32',
  'arduino',
  'default',
] as const

export type TintName = (typeof tintNames)[number]

const FALLBACK_TINT: TintName = 'default' // dustyGrape

export function tintFor(technologies: string[]): TintName {
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

export function canonicalTech(tech: string): string {
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

export function toneForTech(tech: string, technologies: string[]): Tone {
  if (WEB_LANGUAGES.has(tech)) {
    const shipsUi = technologies.some((t) => categoryOf(t) === 'frontend')
    return CATEGORY_TONE[shipsUi ? 'frontend' : 'backend']
  }
  const category = categoryOf(tech)
  return category ? CATEGORY_TONE[category] : 'paleSlate' // neutral grey for anything unmapped
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  built: string
  liveUrl?: string
  repoUrl?: string
  /**
   * Path to a screenshot under `public/`. Nothing sets this today: the one
   * project that did pointed at an asset that was never committed, and the
   * broken image was papered over by an `onError` handler that a zero-JS page
   * can't run. Set it once a real screenshot exists.
   */
  screenshot?: string
}

export interface Utility {
  title: string
  description: string
  technologies: string[]
  built: string
  repoUrl: string
}

export const projects: Project[] = [
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

export const utilities: Utility[] = [
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

export const cardAccent: Tone = 'dustyGrape'

export const ALL_FILTER = 'All'

// Technologies used by more than one item make useful filters; single-use
// tech would just create dead-end filters showing one card. Grouped by canonical
// family (so React 19 / Next.js all count toward "React"), deduped per item.
export function deriveFilters(items: { technologies: string[] }[]): string[] {
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

export const projectFilters = deriveFilters(projects)
export const utilityFilters = deriveFilters(utilities)

/** Radio group names. Projects.module.css keys its `:has()` rules off these. */
export const PROJECT_FILTER_GROUP = 'project-filter'
export const UTILITY_FILTER_GROUP = 'utility-filter'

/**
 * The canonical technology families an item belongs to, as a pipe-delimited
 * string for the card's `data-tech` attribute.
 *
 * Filtering happens in CSS, which can only do substring matching on an
 * attribute — and `~=` is no help because family names contain spaces
 * ("Tailwind CSS", "Web Audio API"). Wrapping each family in pipes lets a
 * `[data-tech*='|React|']` selector match exactly, without "React" also
 * matching "React Three Fiber".
 */
export function techFilterValue(technologies: string[]): string {
  const families = Array.from(new Set(technologies.map(canonicalTech)))
  return `|${families.join('|')}|`
}
