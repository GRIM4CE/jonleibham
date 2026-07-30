import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Client entry — and in production, a formality.
 *
 * The shipped site is prerendered and ships no JavaScript:
 * `scripts/prerender.mjs` strips this chunk and its `<script>` tag from
 * `dist/index.html`. It stays in the build only so Vite walks the component
 * tree and collects every CSS Module into the stylesheet the page links.
 *
 * `npm run dev` has no prerender step, so there the app mounts for real and
 * keeps its HMR loop. Vite compiles this branch away for production.
 */
if (import.meta.env.DEV) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/**
 * With the branch above compiled out, Rollup would treat `App` as unused and
 * drop it — taking the component tree's CSS with it. Assigning to a global is a
 * side effect it has to keep.
 */
;(globalThis as Record<string, unknown>).__styleEntry = App
