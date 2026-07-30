# Design system: finish the library, add two export paths

**Date:** 2026-07-30
**Status:** Approved, ready for planning

## Problem

Three things were asked for: extract the portfolio's components into a design
system, get that design system into Claude Design, and stand up a deployable
Storybook.

Two of the three partly exist. `src/design-system/` already holds `Button`,
`Tag`, `Tabs` and `Icon` alongside `tokens.ts` and the `tones.module.css`
custom-property table. Storybook is already configured — v10, `@storybook/react-vite`,
with the a11y, docs, vitest and Chromatic addons — and `storybook-static/` is on
disk. What is missing is a deploy target, not the setup.

Nothing exists for Claude Design. That is the only genuinely new pipeline.

So the work is **finish the library and add an export path**, not *build a design
system*.

## Constraints that shape everything

The portfolio prerenders to static HTML with **no client bundle**
(`scripts/prerender.mjs` fails the build if a script tag survives). Two
consequences bind every decision below:

1. **Every design-system component must stay hook-free and handler-free.** No
   `useState`, no `onClick`, no browser APIs. Interactivity is CSS — `Tabs`
   renders a hidden radio group and consumers reveal content with
   `:has(input[value='…']:checked)`.
2. **No inline `style` attributes in the app.** The deployed CSP sets
   `style-src 'self'` with no `'unsafe-inline'`, so style attributes are dropped
   in production. Components set CSS custom properties through
   `toneClass()` / `surfaceClass()` instead.

Constraint 2 applies to the *deployed portfolio only*. Preview files hosted on
claude.ai are not governed by that CSP, so the exported bundle may use inline
`<style>` freely. Do not contort the bundle to satisfy a rule that is not in
play there.

Storybook and the preview export are both build-time consumers, so neither costs
anything against constraint 1.

## Scope decisions

**Stay in-repo.** `src/design-system/` remains the design system. No npm-workspaces
split. Nothing in the request requires a package boundary: the Claude Design
bundle uploads HTML, and `.storybook/main.ts` already globs
`../src/**/*.stories.*`. The monorepo stays parked as the separate future item
CLAUDE.md already describes.

**Portfolio tie-in deferred.** Once Storybook has a public URL, linking it from
the portfolio is a one-line edit in `src/data/projects.ts`. Optional final step,
not a driver of the design.

**Storybook hosts on a second Amplify app.** Matches how the portfolio already
ships and keeps everything in the user's own AWS account. Chromatic was
considered and rejected; `@chromatic-com/storybook` is removed from the addon
list and from `devDependencies` rather than left as dead weight.

The tradeoff accepted with that: **no visual-regression testing.** The a11y
addon and `@storybook/addon-vitest` still run in `npm run test`, but nothing
will catch an unintended visual change to a component. If that becomes painful
later, it is a separate decision.

**A new Claude Design project is created** rather than an existing one updated —
`create_project`, not a push into something already there. `list_projects` still
runs first, to name the new project distinctly from anything already present.

**Screens are not design-system components.** `HomeScreen`, `WorkScreen`,
`CareerScreen`, `AboutScreen`, `ProjectDetail` and `TabBar` are page-level
compositions welded to `src/data/` and the `:target` routing rules in
`App.module.css`. They stay in `src/components/`.

## Part 1 — Claude Design export

The highest-unknown piece, and therefore the first piece built.

### What Claude Design consumes

Per the `DesignSync` tool contract: **standalone preview HTML files**, not
`.tsx`. The Design System pane builds its card index from each preview HTML's
first-line marker:

```html
<!-- @dsCard group="Components" -->
```

Explicit `register_assets` calls are the legacy path and are not needed for
marker-bearing uploads.

### Unresolved contract question — settle before writing the generator

The `DesignSync` schema references three things this spec does not yet account
for:

- `_ds_manifest.json`, described as compiled from the `@dsCard` markers by
  "the app's self-check"
- a `report_validate` method
- its `counts` shape: `{total, bad, thin, variantsIdentical, iterations}`

`thin` and `variantsIdentical` imply the upload path expects previews to be
*validated* — that a card is not near-empty, and that a variant grid shows
actual visual difference between its variants. `iterations` implies a
fix-and-recheck loop. The generator as described below emits HTML and stops.

Resolve first: whether the bundle must emit a `.render-check.json`, whether
anything local compiles `_ds_manifest.json` or the app derives it from the
markers, and whether `report_validate` is required after `write_files` or is
optional telemetry. This changes the generator's output contract, so it is
settled before the generator is written, not discovered mid-implementation.

One concrete consequence for the card list: `MediaWell` is a fixed-height empty
well and `Portrait` renders a single image. Both are prime `thin` candidates. If
a thinness check exists, those two cards need deliberate content — several
sizes, a filled state — rather than one faithful instance.

### The generator

`scripts/build-design-bundle.mjs`, modelled on the existing
`scripts/prerender.mjs`:

- A new `src/entry-design.tsx` exports a map of card name → a variant grid built
  from the **real components**. Generating previews from the real components is
  what keeps them from drifting from the app.
- Vite SSR-builds that entry; `renderToStaticMarkup` renders each card to a
  standalone HTML file under `design-bundle/`.
- Each file inlines the **entire compiled stylesheet** in a `<style>` tag. No
  per-component CSS tree-shaking — the fragility is not worth the bytes.
- Each file **sets its own dark ground explicitly** (`--ground: #1a0f16`, and
  padding). The pane supplies its own background and the site is dark-themed, so
  without this the components render invisible.

Do not scrape `storybook-static/` for previews. Those are iframe'd JS
applications, not standalone HTML.

### Cards

Foundations group: Colors (source palette plus role tokens), Type (the scale and
the mono/body split), Geometry (radii, gutter, `--content-max`).

Components group: one card per design-system component, each showing its
variants — `Button` (variants x sizes x block), `Tag`, `Icon` (the full set),
`Tabs` (chips and underline), then the eight extracted below.

### Upload flow

`list_projects` → `create_project` → `finalize_plan` → `write_files`.

A **new** design-system project is created for this repo. `list_projects` still
runs first — not to find a target to reuse, but to pick a name that does not
collide with anything already there, and to confirm the account can write.

`create_project` must produce a project of type
`PROJECT_TYPE_DESIGN_SYSTEM`; that type is immutable at creation, so a push into
a regular project never becomes a design system. Verify with `get_project`
before the first `finalize_plan`.

`write_files` publishes to claude.ai. Every `finalize_plan` / `write_files` pair
is an explicit approval step: show the user the exact path list and the source
directory, and wait for a yes.

### Known risk

Fonts load from Google Fonts via a `<link>` in `index.html` (Figtree, JetBrains
Mono). If claude.ai's CSP blocks that request, previews fall back to
`system-ui`. Check this on the first upload rather than pre-emptively
base64-embedding woff2 subsets, which would bloat every card.

### Sequencing

Prove the pipeline end-to-end with the four components that **already exist** —
Button, Tag, Icon, Tabs — plus a Colors card. Five cards, zero extraction work.
Upload them and confirm they render before extracting anything. If the card
format is wrong, that surfaces after four components instead of twelve.
Extraction is the predictable part; the upload contract is not.

**The render gate is user-owned.** `list_files` and `get_file` confirm *upload*,
not *render* — nothing available here can see the Design System pane. So after
`write_files` succeeds, the user opens the pane and confirms three things:

1. the five cards are visible against the dark ground, not invisible-on-dark;
2. fonts either applied or fell back acceptably;
3. variants within a card are visually distinct from one another.

**Extraction does not begin until that confirmation comes back.** Without this
being someone's explicit job, a 200 from `write_files` gets mistaken for a
passing gate and twelve components get extracted against an unverified
contract — the exact failure this sequencing exists to prevent.

`design-bundle/` is build output and is added to `.gitignore`, alongside `dist`
and `storybook-static`.

## Part 2 — Extraction

Eight components, each as `src/design-system/<Name>/` with `<Name>.tsx`,
`<Name>.module.css`, `index.ts` and `<Name>.stories.tsx`, matching the shape the
existing four use. Each is added to `src/design-system/index.ts`.

A file exporting both a component and a helper trips the `react-refresh` lint
rule, so any helper gets its own module — see `Tag/tagVariant.ts` and
`Icon/icons.ts` for the precedent.

### Genuinely duplicated

| Component | Call sites | Shape |
| --- | --- | --- |
| `LabeledNote` | `HomeScreen` "Now", `CareerScreen` "Why", `AboutScreen` "Off clock" | Small uppercase label followed by a line of text |
| `AvailabilityPill` | `HomeScreen` brand row, `TabBar` rail foot | Status dot plus label |
| `Wordmark` | `HomeScreen`, `TabBar` | Name, optionally with a title line beneath |

These are three shapes each written more than once today. Extracting them
removes real duplication.

**An extracted component owns its internal shape only. Every call site keeps its
own positioning and visibility wrapper in its existing module.** The three are
structurally identical but sit in materially different layout contexts:

- `CareerScreen`'s `.footer` lives inside `.foot`, which is `display: contents`
  on mobile and a pinned tinted card from 768 up.
- `AboutScreen`'s `.offClock` sits in its own `.foot` beside `.actions`.
- `TabBar`'s availability pill and `HomeScreen`'s are shown at *different
  breakpoints* — `TabBar`'s comment records that Home's brand row hides above
  768 rather than saying it twice.

Collapsing those three stylesheets into one is how the desktop layouts diverge
with nothing failing. `npm run build` will not catch it and neither will
`App.test.ts`; only looking at the rendered breakpoints will.

Detail worth not dropping: About's label is `Off&nbsp;clock`, with a
non-breaking space.

### Single-use primitives

| Component | Current home |
| --- | --- |
| `MetricStrip` | `HomeScreen` metrics `<dl>` — value over label, gold numerals |
| `FactList` | `ProjectDetail` facts `<dl>` — Role / Shipped / Status |
| `MediaWell` | `ProjectDetail` hero — fixed-height empty well |
| `SectionHeading` | `WorkScreen`, `CareerScreen` — heading, meta line, trailing slot |
| `Portrait` | `AboutScreen` — `srcSet` image at fixed intrinsic dimensions |

`MetricStrip` and `FactList` are both label/value description lists and may
collapse into one component with variants. That call is deferred to
implementation, when both stylesheets can be read side by side. If they stay
separate, that is a valid outcome — not a missed merge.

`SectionHeading` needs a trailing slot: `WorkScreen` puts a search icon beside
its heading, `CareerScreen` puts a Resume button.

### Deliberately not extracted

`IndexRow` (`WorkScreen`), the `CareerScreen` timeline rail, and the utilities
`Collapse` (`WorkScreen`). Each is welded to CSS counters, `:has()` filter rules
and `data-cat` attributes. `src/data/projects.test.ts` and
`src/data/stack.test.ts` exist specifically to fail when those rules and the
data drift apart. Moving the markup without the rules breaks styling silently;
moving the rules into the design system undermines the tests' premise. If these
are wanted later, that is its own scoped piece of work.

## Part 3 — Storybook, deployed on Amplify

- Write stories for `Tabs`, currently the only design-system component without
  them, and for each of the eight new components.
- Remove `@chromatic-com/storybook` from `.storybook/main.ts` and from
  `devDependencies`.
- Add `amplify.storybook.yml`: a second build spec, for a second Amplify app
  pointed at this same repository, publishing `storybook-static/`.

### The Storybook build spec is not a copy of `amplify.yml`

Two things in the portfolio's spec are actively wrong for Storybook, and
copying it is the likely first mistake:

- **`npm install --omit=dev` skips the entire Storybook tree.** That flag exists
  precisely because the portfolio build never needs it. The Storybook app must
  install devDependencies. Keep `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` — the
  Playwright browsers are only needed by the browser-mode Vitest project, which
  does not run on Amplify.
- **The security headers would break Storybook.** `X-Frame-Options: DENY` and
  `frame-ancestors 'none'` block Storybook's own same-origin preview iframe, and
  `script-src 'self'` with no `'unsafe-inline'` fights a bundle that is entirely
  JavaScript. The Storybook app needs its own, looser set — at minimum
  `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`.

The exact CSP the built Storybook tolerates is **verified against a real build
served locally**, not guessed. The zero-JS CSP is a property of the portfolio,
not of this repository.

Build command is `npm run build-storybook`; artifact base directory is
`storybook-static`.

**External prerequisite, owned by the user:** creating the second Amplify app in
the AWS console, pointing it at this repo and at `amplify.storybook.yml`, and
attaching a subdomain (e.g. `ds.jonleibham.com`). The build spec is written and
committed regardless; it does nothing until an app is pointed at it. App
creation cannot be automated from here.

## Verification

Typecheck alone is not sufficient. After each extraction step, all four of:

```
npm run build        # prerender assertions: no script tag, no inline style attr, no inline handler
npm run test         # projects.test.ts, stack.test.ts, App.test.ts, tones.test.ts
npm run lint
npm run typecheck:dev
```

`npm run build` is the meaningful gate — it is the only one that exercises
`scripts/prerender.mjs`, and `src/App.test.ts` is the only thing that catches an
id selector reappearing in a CSS module (which compiles to a scoped name and
silently matches nothing).

No extraction step is reported as done without that output.

## Order of work

0. Resolve the validation/manifest contract question above.
1. Build the export pipeline; upload five cards from the existing components;
   **user confirms they render in the pane**.
2. Extract the three duplicated components; verify.
3. Extract the five primitives; verify.
4. Stories for `Tabs` and all eight new components.
5. Drop Chromatic; add `amplify.storybook.yml` and verify its headers against a
   real `build-storybook` output served locally.
6. Regenerate the bundle and upload the full set.

Step 1 is deliberately first because it carries the only unknown-unknowns.

## Out of scope

- The npm-workspaces monorepo (its own future spec).
- Extracting `IndexRow`, the timeline rail, or the utilities collapse.
- Linking the deployed Storybook from the portfolio — a one-line data edit once
  a URL exists, and not required by anything above.
- Visual-regression testing. Rejected with Chromatic; revisit separately if
  unintended visual changes start slipping through.
- Creating the second Amplify app or attaching its subdomain.
