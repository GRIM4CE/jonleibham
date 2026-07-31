/**
 * The Work index. Order here is the order on screen; the displayed index
 * ("01", "02"…) is derived at render time so filtering always renumbers
 * sequentially rather than leaving gaps.
 *
 * Seven projects are curated for the index — the strongest and most recent —
 * with the five utilities behind the collapse at the bottom of the screen.
 * To promote or demote something, move it between the two arrays; nothing
 * else needs to change.
 */

export type ProjectCategory = 'product' | 'utility' | 'ai'

/**
 * Radio group name for the Work filter. WorkScreen.module.css keys its
 * `:has()` rules off this, so the two have to agree.
 */
export const WORK_FILTER_GROUP = 'work-filter'

/**
 * Filter chips, in order. Each one needs a matching rule in
 * WorkScreen.module.css — CSS cannot compare an input's value against a row's
 * `data-cat`, so the mapping is written out there by hand.
 */
export const filters = ['All', 'Products', 'Utilities', 'AI'] as const

export type Filter = (typeof filters)[number]

/**
 * Row accents. Gold marks the single featured project; the other two rotate so
 * adjacent rows never share a spine color. No other colors are introduced.
 */
export type Accent = 'gold' | 'green' | 'grape'

export interface ProjectLinks {
  live?: string
  source?: string
}

export interface Project {
  id: string
  title: string
  /** Right-aligned on the index row. */
  year: string
  /** "Shipped" in the detail fact strip. */
  shipped: string
  role: string
  /** One or two lines on the index row. */
  blurb: string
  /** Sits under the title on the detail screen. */
  standfirst: string
  /** The "What I built" paragraph. */
  body: string
  /** Mono line on the index row, rendered uppercase. */
  stackLine: string[]
  /** Chips on the detail screen. */
  stack: string[]
  categories: ProjectCategory[]
  accent: Accent
  featured?: boolean
  links: ProjectLinks
}

export const projects: Project[] = [
  {
    id: 'recipe-book',
    title: 'Recipe Book',
    year: '2026',
    shipped: 'July 2026',
    role: 'Solo build',
    blurb: 'React 19 front end, Express 5 on Lambda, Turso for data, S3 uploads behind Cognito auth.',
    standfirst:
      'A recipe app for two: a colorful grid with search, filtering and serving-size scaling.',
    body: 'Anyone can browse; only I can edit, from the web app or a bearer-token API. React 19 front end, Express 5 on Lambda, Turso for data, Cognito auth.',
    stackLine: ['React 19', 'TypeScript', 'Vite', 'AWS'],
    stack: ['React 19', 'TypeScript', 'Express 5', 'AWS Lambda', 'Turso (libSQL)', 'AWS Cognito'],
    categories: ['product'],
    accent: 'gold',
    featured: true,
    links: {
      live: 'https://recipes.jonleibham.com/',
      source: 'https://github.com/GRIM4CE/recipe-book',
    },
  },
  {
    id: 'stonk',
    title: 'Stonk',
    year: '2026',
    shipped: 'July 2026',
    role: 'Solo build',
    blurb: 'Covered-call screening and stock discovery, with Claude in the loop.',
    standfirst: 'A covered-call income and stock-discovery cockpit, with Claude in the loop.',
    body: 'Deterministic screeners rank the best near-dated covered-call setups across a 600-name universe, surface undervalued and turnaround names, and track open positions. Discord and email alerts fire when a fresh setup or a buy-back target hits. Market data is pluggable: yfinance, Tradier or the Schwab Trader API.',
    stackLine: ['FastAPI', 'Python', 'Vue 3', 'Claude'],
    stack: ['FastAPI', 'Python', 'Vue 3', 'TypeScript', 'Claude API', 'Docker'],
    categories: ['product', 'ai'],
    accent: 'green',
    links: {},
  },
  {
    id: 'finance-pwa',
    title: 'Finance PWA',
    year: '2026',
    shipped: 'April 2026',
    role: 'Solo build',
    blurb: 'An installable finance PWA that replaced a stack of spreadsheets.',
    standfirst: 'A private, installable finance PWA that replaced a stack of Google Sheets.',
    body: 'Net worth, budgets, recurring bills, transactions and a stock portfolio for a two-person household. Handles multi-currency accounts, AI-assisted CSV and PDF statement import, and historical net-worth snapshots. Self-hosted on a Synology NAS, reachable only over Tailscale.',
    stackLine: ['SvelteKit', 'TypeScript', 'libSQL', 'PWA'],
    stack: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind CSS v4', 'libSQL', 'PWA'],
    categories: ['product', 'ai'],
    accent: 'grape',
    links: {},
  },
  {
    id: 'job-finder',
    title: 'Job Finder',
    year: '2026',
    shipped: 'April 2026',
    role: 'Solo build',
    blurb: 'Claude tailors a resume to any posting and tracks the pipeline.',
    standfirst: 'A Vue and TypeScript PWA that tailors a resume to any job posting.',
    body: 'Claude reads the posting, rewrites the resume against it, calls out the skill gaps, and tracks the whole application pipeline from first search through follow-up.',
    stackLine: ['Vue 3', 'TypeScript', 'Claude', 'SQLite'],
    stack: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Claude API', 'Node.js', 'Express', 'SQLite'],
    categories: ['product', 'ai'],
    accent: 'green',
    links: {},
  },
  {
    id: 'sunspot',
    title: 'Sunspot',
    year: '2024',
    shipped: 'February 2024',
    role: 'Solo build',
    blurb: 'End-to-end IoT monitor: ESP32 firmware to a Flask API to a Vue 3 dashboard.',
    standfirst: 'An end-to-end IoT environmental monitor.',
    body: 'ESP32 firmware in Arduino and C++ reads light with a BH1750 and temperature and humidity with a DHT22, then posts readings to a Flask and MongoDB API behind an AWS Lambda relay. A Vue 3 dashboard reads it back.',
    stackLine: ['ESP32', 'C++', 'Python', 'Vue 3'],
    stack: ['ESP32', 'C++ / Arduino', 'Python', 'Flask', 'MongoDB', 'AWS Lambda', 'Vue 3'],
    categories: ['product'],
    accent: 'grape',
    links: { source: 'https://github.com/GRIM4CE/sunspot' },
  },
  {
    id: 'web-synth-wizard',
    title: 'Web Synth Wizard',
    year: '2024',
    shipped: 'January 2024',
    role: 'Solo build',
    blurb: 'A synthesizer that runs entirely in the browser. No plugins, no installs.',
    standfirst: 'A synthesizer that runs entirely in the browser.',
    body: 'Patch together and tweak sounds with no plugins and no installs, built on Vue 3 and the Web Audio API.',
    stackLine: ['Vue 3', 'TypeScript', 'Web Audio'],
    stack: ['Vue 3', 'TypeScript', 'Web Audio API', 'Sass', 'Vite'],
    categories: ['product'],
    accent: 'green',
    links: {
      live: 'https://websynthwizard.com/',
      source: 'https://github.com/GRIM4CE/web-synth-wizard',
    },
  },
]

/** Behind the collapse at the bottom of the Work screen, and under the Utilities chip. */
export const utilities: Project[] = [
  {
    id: 'transcribe',
    title: 'transcribe',
    year: '2026',
    shipped: 'June 2026',
    role: 'Solo build',
    blurb: 'Local speech-to-text with speaker diarization. No cloud, no API keys.',
    standfirst: 'Local speech-to-text with speaker diarization.',
    body: 'Transcribes video and audio to text using MLX Whisper on Apple Silicon, with speakers auto-detected via voice-embedding clustering. Runs entirely on-device: no cloud, no API keys.',
    stackLine: ['Python', 'MLX Whisper', 'ffmpeg'],
    stack: ['Python', 'MLX Whisper', 'uv', 'ffmpeg'],
    categories: ['utility', 'ai'],
    accent: 'grape',
    links: { source: 'https://github.com/GRIM4CE/transcribe' },
  },
  {
    id: 'm4a2wav',
    title: 'm4a2wav',
    year: '2024',
    shipped: 'May 2024',
    role: 'Solo build',
    blurb: 'Batch converter that turns Apple M4A files into WAVs.',
    standfirst: 'A batch converter that turns Apple M4A files into WAVs.',
    body: 'A small Node.js command-line tool for converting a directory of M4A recordings to WAV in one pass.',
    stackLine: ['Node.js', 'JavaScript'],
    stack: ['Node.js', 'JavaScript'],
    categories: ['utility'],
    accent: 'green',
    links: { source: 'https://github.com/GRIM4CE/m4a2wav' },
  },
  {
    id: 'node-image-processor',
    title: 'node-image-processor',
    year: '2021',
    shipped: 'March 2021',
    role: 'Solo build',
    blurb: 'Batch image manipulation built on Sharp.js.',
    standfirst: 'A batch image-processing prototype built on Sharp.js.',
    body: 'A Node.js prototype for resizing, converting and compressing images in bulk.',
    stackLine: ['Node.js', 'Sharp.js'],
    stack: ['Node.js', 'Sharp.js'],
    categories: ['utility'],
    accent: 'grape',
    links: { source: 'https://github.com/GRIM4CE/node-image-processor' },
  },
  {
    id: 'tv-formatter',
    title: 'TV Formatter',
    year: '2022',
    shipped: 'February 2022',
    role: 'Solo build',
    blurb: 'Auto-formats TV series filenames from the TVDB API.',
    standfirst: 'Auto-formats TV series filenames from the TVDB API.',
    body: 'A script that looks up a series on TVDB and rewrites a directory of episode filenames into a consistent, sortable format.',
    stackLine: ['Node.js', 'Axios', 'TVDB API'],
    stack: ['Node.js', 'Axios', 'TVDB API'],
    categories: ['utility'],
    accent: 'green',
    links: { source: 'https://github.com/GRIM4CE/tv-formater' },
  },
  {
    id: 'photo-rename',
    title: 'photo-rename',
    year: '2022',
    shipped: 'February 2022',
    role: 'Solo build',
    blurb: 'Batch renames photo files for a legacy portfolio site.',
    standfirst: 'A batch renamer for photo files on a legacy portfolio site.',
    body: 'A script that normalizes a directory of photo filenames so a static gallery can index them predictably.',
    stackLine: ['Node.js'],
    stack: ['Node.js'],
    categories: ['utility'],
    accent: 'grape',
    links: { source: 'https://github.com/GRIM4CE/photo-rename' },
  },
]

/** Every item that has a detail screen, projects first. */
export const allWork: Project[] = [...projects, ...utilities]

export function findWork(id: string): Project | undefined {
  return allWork.find((item) => item.id === id)
}

/**
 * The fact strip's third column. Live sites read green; everything else is
 * stated plainly rather than dressed up.
 */
export function statusOf(project: Project): { label: string; live: boolean } {
  if (project.links.live) return { label: 'Live', live: true }
  if (project.links.source) return { label: 'Source', live: false }
  return { label: 'Private', live: false }
}

/** "PRODUCT" / "UTILITY" / "AI" pill above the detail title. */
export function categoryLabel(project: Project): string {
  if (project.categories.includes('utility')) return 'Utility'
  if (project.categories.includes('ai')) return 'AI'
  return 'Product'
}
