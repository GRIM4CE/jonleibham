# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Jon Leibham, built with React 19, TypeScript, and Vite. Deployed via AWS Amplify.

**The shipped site is static HTML and CSS with no JavaScript.** React is a build-time templating tool here, not a runtime dependency — see *Static generation* below.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript check, Vite client build, SSR build, then prerender (outputs to `dist/`)
- `npm run lint` — ESLint across the project
- `npm run test` — Vitest (`unit` project in node, `storybook` project in a browser)
- `npm run typecheck:dev` — Typecheck stories and tests, which the prod build excludes
- `npm run preview` — Preview the production build locally

Node version 24.12.0 is pinned via Volta.

## Architecture

**Component pattern:** Each component lives in `src/components/<Name>/` with three files:
- `<Name>.tsx` — React functional component
- `<Name>.module.css` — CSS Modules scoped styles
- `index.ts` — Barrel re-export

Reusable primitives live in `src/design-system/<Name>/` with the same shape. A file
that exports both a component and a helper trips the `react-refresh` lint rule, so
helpers get their own module — see `Tag/tagVariant.ts` and `Icon/icons.ts`.

**Content** is static data in `src/data/`: `projects.ts` (the Work index and every
detail screen), `career.ts`, `stack.ts` and `profile.ts`. The index shows seven
curated projects; the five utilities sit behind the collapse. Promoting or demoting
one is a data edit and nothing more.

**Styling:** CSS Modules for component scoping, global design tokens (colors, typography) defined in `src/index.css`. No CSS framework — vanilla CSS only.

**Static generation:** `npm run build` runs three passes. Vite's client build emits the stylesheet (its entry, `src/entry-client.tsx`, mounts the app in `npm run dev` but in production exists only so Vite walks the component tree for CSS, and is deleted afterwards). Vite's SSR build compiles `src/entry-server.tsx`. Then `scripts/prerender.mjs` calls `renderToStaticMarkup`, injects the markup into `dist/index.html`, strips the module script, deletes the orphaned JS chunks, and fails the build if any script tag, inline style attribute, or inline event handler survives.

Consequences to keep in mind when editing:

- **No hooks, no event handlers, no browser APIs in components.** Anything that needs `useState` or `onClick` has to become CSS. Tab bars and filters use `<Tabs>`, which renders a hidden radio group; the consuming stylesheet reveals content with `:has(input[value='…']:checked)`. The utilities collapse uses a checkbox for the same reason. Because CSS can't compare two attribute values, every tab/filter needs its own rule — the tests in `src/data/projects.test.ts` and `src/data/stack.test.ts` fail when the rules and the data drift apart.
- **No inline `style` attributes.** The CSP in `amplify.yml` sets `style-src 'self'` with no `'unsafe-inline'`, so style attributes are dropped in production. Components set CSS custom properties through the tone classes in `src/design-system/tones.module.css` instead — `toneClass('accent', 'dustyGrape')`, `surfaceClass('porcelain')`.
- **CSS Modules scopes ids, not just class names.** A `#home` selector inside a `.module.css` compiles to `#App-module_home_4GdE4` and matches nothing in the rendered markup — no build error, no styling. Cross-module hooks are data attributes instead: `data-screen`, `data-tab`, `data-detail`, `data-cat`, `data-stack`. `src/App.test.ts` fails if an id selector reappears.
- **Build-time values freeze.** Anything derived from `Date` or the environment is evaluated during the build, not in the browser.

**Navigation:** the five screens (Home, Work, Career, About) and one detail screen per project all live in the same document. `src/App.module.css` shows whichever screen the URL hash targets and falls back to Home when nothing is targeted, so every screen has a real URL and the browser's own back button works. A detail screen keeps the Work tab lit via `:has(section[data-detail]:target)`.

**No backend:** Contact is a `mailto:` link — the secondary action on Home and the primary action on About. There is no form.

**Deployment:** AWS Amplify configured in `amplify.yml` — builds with `npm run build`, serves from `dist/`, includes security headers and immutable asset caching.

## Key Files

- `src/index.css` — Color palette and global CSS variables
- `src/App.module.css` — The app shell and the `:target` routing rules
- `src/design-system/tones.module.css` — Tone/surface classes that replace inline CSS-var styles
- `scripts/prerender.mjs` — Static HTML generation and the zero-JS assertions
- `index.html` — Page shell: SEO meta tags, Open Graph, Twitter cards, favicon/PWA config
- `amplify.yml` — AWS Amplify build pipeline and custom headers

## Future Ideas

- **Shared design system across apps.** Move this portfolio plus the planned finance, todo, and job-search apps into a monorepo (pnpm or npm workspaces, optionally Turborepo). Extract `src/index.css` tokens and reusable components into `packages/design-system` so all apps share type styles and UI while keeping app logic isolated. Per-app Amplify deploys via `appRoot` so each app only rebuilds when its folder or the shared package changes. Guard shared-package changes with CI that runs every app's `tsc` + `build` + `lint`, plus Storybook + visual regression on the design system.
