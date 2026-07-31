# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

npm-workspaces monorepo for Jon Leibham's personal projects.

- `apps/portfolio-site` — the portfolio. Deployed to AWS Amplify.
- `apps/storybook` — hosts the stories. Deployed to AWS Amplify. It owns no story
  of its own: each lives beside its component, in the package or the app that owns
  it, and the two are kept apart by title prefix — `Components/` for the shared
  library, `Portfolio/` for the app's screens.
- `packages/design-system` — shared component library. Not deployed; both apps
  compile it from source.

Built with React 19, TypeScript and Vite.

**The shipped site is static HTML and CSS with no JavaScript.** React is a build-time templating tool here, not a runtime dependency — see *Static generation* below.

## Commands

Run from the repository root; each delegates to a workspace.

- `npm run dev` — portfolio dev server (localhost:5173)
- `npm run build` — portfolio: tsc, Vite client build, SSR build, prerender (→ `apps/portfolio-site/dist/`)
- `npm run storybook` — Storybook dev server (localhost:6006)
- `npm run build-storybook` — static Storybook (→ `apps/storybook/storybook-static/`)
- `npm run build:design` — Claude Design card bundle (→ `packages/design-system/design-bundle/`)
- `npm run measure:design` — report each card's real content height
- `npm run lint` — ESLint across all workspaces
- `npm run test` — Vitest in every workspace
- `npm run typecheck:dev` — typecheck stories and tests, which the prod build excludes
- `npm run preview` — preview the portfolio build locally

`npm install` must be run at the **root**. There is one lockfile and one
`node_modules`; installing inside a workspace produces a second lockfile and an
install that is not reproducible.

Node version 24.12.0 is pinned via Volta.

## Architecture

**Component pattern:** Each component lives in `apps/portfolio-site/src/components/<Name>/` with three files:
- `<Name>.tsx` — React functional component
- `<Name>.module.css` — CSS Modules scoped styles
- `index.ts` — Barrel re-export

Reusable primitives live in `packages/design-system/src/<Name>/` with the same shape. A file
that exports both a component and a helper trips the `react-refresh` lint rule, so
helpers get their own module — see `Tag/tagVariant.ts` and `Icon/icons.ts`.

**Content** is static data in `apps/portfolio-site/src/data/`: `projects.ts` (the Work index and every
detail screen), `career.ts`, `stack.ts` and `profile.ts`. The index shows seven
curated projects; the five utilities sit behind the collapse. Promoting or demoting
one is a data edit and nothing more.

**Styling:** CSS Modules for component scoping. Design tokens *and the element
resets the components depend on* live in `packages/design-system/src/tokens.css`;
`apps/portfolio-site/src/index.css` imports that and adds page-level globals
(`body`, `.sr-only`, `.skip-link`). The resets belong to the package because its
components render bare `<p>`, `<button>` and `<a>` — leaving them with the app
meant a component only looked right inside that one app. No CSS framework.

**The design system is consumed source-first.** `main` points at
`src/index.ts`, so each app's Vite compiles the package's TSX and CSS Modules
directly. No build step sits in the dependency chain. The package's own
`vite build` exists only to emit a standalone stylesheet for the Claude Design
export.

**Scoped-name pinning must match across Vite configs.**
`generateScopedName: '[name]_[local]_[hash:base64:5]'` appears in both
`apps/portfolio-site/vite.config.ts` and `packages/design-system/vite.config.ts`.
The hash is derived from the path relative to the Vite root, so moving a file
across that boundary changes it — harmless when markup and stylesheet come from
the same build, fatal when they do not.

**Static generation:** `npm run build` runs three passes. Vite's client build emits the stylesheet (its entry, `src/entry-client.tsx`, mounts the app in `npm run dev` but in production exists only so Vite walks the component tree for CSS, and is deleted afterwards). Vite's SSR build compiles `src/entry-server.tsx`. Then `scripts/prerender.mjs` calls `renderToStaticMarkup`, injects the markup into `dist/index.html`, strips the module script, deletes the orphaned JS chunks, and fails the build if any script tag, inline style attribute, or inline event handler survives.

Consequences to keep in mind when editing:

- **No hooks, no event handlers, no browser APIs in components.** For the
  package this is enforced by `packages/design-system/src/modules.test.ts`,
  because `prerender.mjs`'s assertions only cover the app. Anything that needs `useState` or `onClick` has to become CSS. Tab bars and filters use `<Tabs>`, which renders a hidden radio group; the consuming stylesheet reveals content with `:has(input[value='…']:checked)`. The utilities collapse uses a checkbox for the same reason. Because CSS can't compare two attribute values, every tab/filter needs its own rule — the tests in `apps/portfolio-site/src/data/projects.test.ts` and `stack.test.ts` fail when the rules and the data drift apart.
- **No inline `style` attributes.** The CSP in `amplify.yml` sets `style-src 'self'` with no `'unsafe-inline'`, so style attributes are dropped in production. Components set CSS custom properties through the tone classes in `packages/design-system/src/tones.module.css` instead — `toneClass('accent', 'dustyGrape')`, `surfaceClass('porcelain')`.
- **CSS Modules scopes ids, not just class names.** A `#home` selector inside a `.module.css` compiles to `#App-module_home_4GdE4` and matches nothing in the rendered markup — no build error, no styling. Cross-module hooks are data attributes instead: `data-screen`, `data-tab`, `data-detail`, `data-cat`, `data-stack`. `src/App.test.ts` fails if an id selector reappears.
- **Build-time values freeze.** Anything derived from `Date` or the environment is evaluated during the build, not in the browser.

**Navigation:** the four screens (Overview, Work, Career, About) and one detail screen per project all live in the same document. Overview's id, hash and `data-screen` are all still `home` — only its label reads Overview, and every `:target` rule is written against `home`. The nav carries a fifth item, an outbound link to the deployed Storybook. `src/App.module.css` shows whichever screen the URL hash targets and falls back to Home when nothing is targeted, so every screen has a real URL and the browser's own back button works. A detail screen keeps the Work tab lit via `:has(section[data-detail]:target)`.

**No backend:** Contact is a `mailto:` link — the secondary action on Home and the primary action on About. There is no form.

**Deployment:** AWS Amplify configured in `amplify.yml` — builds with `npm run build`, serves from `dist/`, includes security headers and immutable asset caching.

## Key Files

- `packages/design-system/src/tokens.css` — palette, role tokens, geometry, type, motion, element reset
- `apps/portfolio-site/src/App.module.css` — the app shell and the `:target` routing rules
- `packages/design-system/src/tones.module.css` — tone/surface classes that replace inline CSS-var styles
- `apps/portfolio-site/scripts/prerender.mjs` — static HTML generation and the zero-JS assertions
- `apps/portfolio-site/index.html` — page shell: SEO meta, Open Graph, Twitter cards, favicon/PWA
- `amplify.yml` — both Amplify applications, keyed by `appRoot`, with their very different CSPs

## Future Ideas

- **More apps.** The finance, todo and job-search apps slot into `apps/*` and
  consume `@jonleibham/design-system` the same way the portfolio does. No
  further restructuring needed — add a workspace and an `appRoot` entry.
- **CI across workspaces.** A workflow running `build` + `test` + `lint` on
  every workspace, so a change to the shared package cannot break an app
  silently.
- **Visual regression.** Nothing currently catches an unintended visual change
  to a component. Chromatic was considered and rejected; revisit if drift
  starts slipping through.
- **Turborepo.** Task caching becomes worthwhile once several apps share the
  package. Premature with two.
