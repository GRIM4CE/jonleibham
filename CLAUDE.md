# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Jon Leibham, built with React 19, TypeScript, and Vite. Deployed via AWS Amplify.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — TypeScript check + Vite production build (outputs to `dist/`)
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview the production build locally

Node version 24.12.0 is pinned via Volta.

## Architecture

**Component pattern:** Each component lives in `src/components/<Name>/` with three files:
- `<Name>.tsx` — React functional component
- `<Name>.module.css` — CSS Modules scoped styles
- `index.ts` — Barrel re-export

**Styling:** CSS Modules for component scoping, global design tokens (colors, typography) defined in `src/index.css`. No CSS framework — vanilla CSS only.

**No backend:** The contact form uses client-side `mailto:` with email obfuscation (split into parts at runtime) and a honeypot field for spam protection.

**Deployment:** AWS Amplify configured in `amplify.yml` — builds with `npm run build`, serves from `dist/`, includes security headers and immutable asset caching.

## Key Files

- `src/index.css` — Color palette and global CSS variables
- `index.html` — SEO meta tags, Open Graph, Twitter cards, favicon/PWA config
- `amplify.yml` — AWS Amplify build pipeline and custom headers

## Future Ideas

- **Shared design system across apps.** Move this portfolio plus the planned finance, todo, and job-search apps into a monorepo (pnpm or npm workspaces, optionally Turborepo). Extract `src/index.css` tokens and reusable components into `packages/design-system` so all apps share type styles and UI while keeping app logic isolated. Per-app Amplify deploys via `appRoot` so each app only rebuilds when its folder or the shared package changes. Guard shared-package changes with CI that runs every app's `tsc` + `build` + `lint`, plus Storybook + visual regression on the design system.
