import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'

/**
 * Renders the whole site to a string at build time.
 *
 * `renderToStaticMarkup` rather than `renderToString`: nothing hydrates, so the
 * `data-reactroot` markers and comment nodes React uses to line the server
 * output up with a client render would be dead weight.
 *
 * Called by `scripts/prerender.mjs`.
 */
export function render(): string {
  return renderToStaticMarkup(<App />)
}
