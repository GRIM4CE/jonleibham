# npm-workspaces monorepo: apps/portfolio and packages/design-system

**Date:** 2026-07-30
**Status:** Approved, ready for planning

## Problem

Storybook needs to deploy somewhere. Every route that keeps the current
single-package layout runs into the same wall:

**AWS Amplify resolves its build spec from `amplify.yml` at the repository root,
and that file overrides console build settings for every app and branch pointed
at the repo.** There is no supported way to point a second Amplify app at a
different filename. Custom headers behave identically — a root `customHttp.yml`
beats per-app console headers.

So a second Amplify app on this repo would build the *portfolio*, and would
inherit the portfolio's zero-JS CSP, which breaks Storybook outright:
`iframe.html` is Storybook's preview canvas, and `X-Frame-Options: DENY` with
`frame-ancestors 'none'` leaves it blank.

`amplify.storybook.yml` was merged in #53 on the assumption that a second app
could be pointed at it. It cannot. That file is currently **dead config on
`main`** and this work removes it.

Amplify does support exactly this case, through `applications:`/`appRoot` in a
monorepo. That is the supported mechanism, and taking it also delivers the
package boundary `CLAUDE.md` has listed under Future Ideas since the redesign.

Sources: [build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html),
[migrating custom headers](https://docs.aws.amazon.com/amplify/latest/userguide/migrate-custom-headers.html)

## Scope

**In:** `apps/portfolio` and `packages/design-system`, npm workspaces, a root
`amplify.yml` with two `appRoot` entries, and Storybook deploying from the
package.

**Out:** the planned finance, todo and job-search apps. The Dossier Design
System project already carries UI kits for them, so they are real — but
scaffolding empty apps adds surface area and Amplify apps that are not needed
yet. The layout chosen here lets them slot in later without another
restructure.

**Out:** Turborepo and pnpm. The repo is already on npm with a
`package-lock.json` and a Volta-pinned Node 24.12.0. Task caching is worth
adding once several apps share the package; it is premature with one, and it is
another moving part on the deploy path this work exists to fix.

**Out:** any change to what the portfolio renders. This is a move, not a
redesign. The deployed site should be byte-identical apart from asset hashes.

## Target structure

```
package.json              root, private, workspaces: ["apps/*", "packages/*"]
package-lock.json         single lockfile, root only
amplify.yml               applications: two appRoots
eslint.config.js          stays at the root and lints both workspaces; its
                          globalIgnores already cover build output and .claude
apps/
  portfolio/
    package.json          @jonleibham/portfolio
    index.html
    vite.config.ts, vitest.config.ts, tsconfig*.json
    scripts/prerender.mjs
    public/
    src/
      App.tsx, App.module.css, App.test.ts
      index.css           app globals; imports the package's tokens
      components/         the five screens and the tab bar
      data/
      entry-client.tsx, entry-server.tsx
packages/
  design-system/
    package.json          @jonleibham/design-system
    .storybook/
    vite.config.ts        library build, cssCodeSplit: false
    vitest.config.ts      the storybook browser project moves here with the stories
    src/
      Button/ Tag/ Tabs/ Icon/ LabeledNote/ AvailabilityPill/ Wordmark/
      tokens.ts, tones.ts, tones.module.css, tokens.css, index.ts
      entry-design.tsx, designCardChrome.tsx
    scripts/
      build-design-bundle.mjs, measure-design-cards.mjs, design-card.css
```

Screens change `from '../../design-system'` to `from '@jonleibham/design-system'`.

## The two substantive changes

Everything else is file movement. These two are real work.

### 1. `src/index.css` splits

Its 236 lines are two different things:

- **Design tokens** — the source palette, role tokens, geometry, type and
  motion custom properties, plus the breakpoint blocks that retune `--gutter`,
  `--hero-size`, `--rail-width` and the pane padding.
- **App globals** — `body`, heading resets, `p`, `a`, `img`, `button`, focus
  rings, `::selection`, `.mono`, `.sr-only`, `.skip-link`, and the
  reduced-motion block.

Design-system components reference `var(--accent)`, `var(--font-mono)`,
`var(--radius-pill)`, `var(--success-line)` and more. Without the tokens the
package cannot render standalone — which is why `.storybook/preview.ts` already
imports `../src/index.css` today.

Tokens move to `packages/design-system/src/tokens.css`. The portfolio's
`index.css` imports that and keeps the globals.

**Judgement call to make during implementation, not now:** some tokens are
arguably app-level rather than system-level — `--rail-width` and the
`--pane-pad-*` set describe the portfolio's shell, not the design system.
Splitting them out is defensible; so is keeping the token block whole on the
grounds that a split invites drift. Decide with both files open and record the
reasoning. Either outcome is acceptable; what is not acceptable is splitting
them silently.

### 2. The design-bundle export stops depending on the app

`scripts/build-design-bundle.mjs` currently reads the **portfolio's** built
stylesheet from `dist/assets/*.css`, and `npm run build:design` runs the whole
portfolio build first to produce it. That is backwards once the design system
is its own package.

The package gets its own Vite library build with `cssCodeSplit: false`, emitting
one stylesheet. The bundle script reads that instead.

This also upgrades `assertStyled` from a formality to a real check. Today it
passes largely because every design-system component happens to be reachable
from `App`, so its CSS is in the app's stylesheet regardless. Against the
package's own stylesheet, a component whose CSS fails to make the build is
caught properly.

## Amplify

Root `amplify.yml` gains an `applications:` list:

```yaml
version: 1
applications:
  - appRoot: apps/portfolio
    frontend: …   # existing spec: --omit=dev, strict zero-JS CSP, dist/
  - appRoot: packages/design-system
    frontend: …   # storybook spec: full install, loose CSP, storybook-static/
```

`amplify.storybook.yml` is deleted; its contents move into the second entry.
Its CSP analysis carries over unchanged and was verified against a real
`build-storybook` output:

| Directive | Why |
| --- | --- |
| `script-src 'unsafe-inline'` | `index.html` has 3 inline `<script>` blocks, `iframe.html` has 5 |
| `script-src 'unsafe-eval'`, `worker-src blob:` | `sb-manager/globals-runtime.js` and the syntax-highlighter chunk use `eval()` and `new Worker` |
| `X-Frame-Options: SAMEORIGIN`, `frame-ancestors 'self'` | `iframe.html` **is** the preview canvas |

Console work, owned by the user: set both apps to monorepo and give each its
`appRoot`; attach a subdomain to the Storybook app.

## The main risk

**npm workspaces install at the repository root; Amplify runs monorepo builds
from the `appRoot`.** Whether Amplify's install step handles a root lockfile
correctly from a subdirectory is unverified, and it is the single thing most
likely to break the deploy.

This is verified **early** — a minimal two-workspace skeleton pushed to a branch
and built on a real Amplify app *before* the portfolio is moved. Discovering it
after the restructure means unwinding a large change under pressure. If Amplify
cannot install from the root, the fallback is a `preBuild` that runs
`cd ../.. && npm ci` before building, which should be proven at the same time.

## Constraints that survive the move

- **The portfolio still prerenders to zero JS.** `scripts/prerender.mjs` moves
  with the app and its assertions are unchanged. The deployed CSP still sets
  `script-src 'self'` and `style-src 'self'`.
- **Design-system components stay hook-free and handler-free.** This used to be
  enforced indirectly — the prerender assertions failed if a component shipped
  a handler. That guard now only covers the app. The package therefore needs its
  own test asserting no `useState`, `useEffect`, `onClick` or similar appears in
  `packages/design-system/src`, or the constraint quietly stops being enforced
  for the library.
- **No inline `style` attributes in the app.** `tones.module.css` moves with the
  package; `toneClass()` / `surfaceClass()` are unchanged.
- **No id selectors in CSS Modules.** `App.test.ts` moves with the app, and its
  directory walk must be repointed so it still covers every module — including
  the ones now in the package, or the package needs its own copy.
- **The CSS-order dependency.** Screens override component classes by bundle
  order: the component's CSS is emitted first because the screen imports it.
  This survives a workspace boundary, but it is implicit and worth re-verifying
  at 390 and 1280 after the move.

## Verification

The move is correct when, from a clean checkout:

```
npm install                 # at the root
npm run build      -w apps/portfolio
npm run test       -w apps/portfolio -w packages/design-system
npm run lint
npm run build-storybook   -w packages/design-system
npm run build:design      -w packages/design-system
```

all pass, **and** the rendered portfolio is unchanged at 390 and 1280 across
Home, Work, Career, About and a project detail screen. The prerendered
`dist/index.html` should differ from its pre-move output only in asset hashes;
diffing the two is the strongest single check that this was a move and not a
redesign.

## Out of scope

- The finance, todo and job-search apps.
- Turborepo, pnpm, or CI task caching.
- Publishing `@jonleibham/design-system` to a registry. It is consumed through
  the workspace link; nothing needs it externally.
- Any visual or behavioural change to the portfolio.
- Creating the Amplify apps or attaching subdomains.
