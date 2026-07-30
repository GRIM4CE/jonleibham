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

**Storybook hosts on Chromatic.** `@chromatic-com/storybook` is already a
devDependency. Chromatic gives hosting plus visual-regression diffs per PR, and
is cheaper to stand up than a second Amplify app.

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

`list_projects` → confirm or `create_project` → `finalize_plan` → `write_files`.

`write_files` publishes to claude.ai. Every `finalize_plan` / `write_files` pair
is an explicit approval step: show the user the exact path list and the source
directory, and wait for a yes. Run `list_projects` before assuming a project
must be created — one may already exist.

### Known risk

Fonts load from Google Fonts via a `<link>` in `index.html` (Figtree, JetBrains
Mono). If claude.ai's CSP blocks that request, previews fall back to
`system-ui`. Check this on the first upload rather than pre-emptively
base64-embedding woff2 subsets, which would bloat every card.

### Sequencing

Prove the pipeline end-to-end with the four components that **already exist** —
Button, Tag, Icon, Tabs — plus a Colors card. Five cards, zero extraction work.
Upload them and confirm they render in the Design System pane before extracting
anything. If the card format is wrong, that surfaces after four components
instead of twelve. Extraction is the predictable part; the upload contract is
not.

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

## Part 3 — Storybook and Chromatic

- Write stories for `Tabs`, currently the only design-system component without
  them, and for each of the eight new components.
- Add the `chromatic` package and `.github/workflows/chromatic.yml`, running on
  pull requests and pushes to `main`.

**External prerequisite, owned by the user:** a Chromatic project and a
`CHROMATIC_PROJECT_TOKEN` GitHub Actions secret. The workflow is written
regardless; it will not pass until the secret exists. This is a manual step —
account creation cannot be automated from here.

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

1. Build the export pipeline; upload five cards from the existing components;
   **confirm they render in the pane**.
2. Extract the three duplicated components; verify.
3. Extract the five primitives; verify.
4. Stories for `Tabs` and all eight new components.
5. Chromatic workflow.
6. Regenerate the bundle and upload the full set.

Step 1 is deliberately first because it carries the only unknown-unknowns.

## Out of scope

- The npm-workspaces monorepo (its own future spec).
- Extracting `IndexRow`, the timeline rail, or the utilities collapse.
- Linking the deployed Storybook from the portfolio — a one-line data edit once
  a URL exists, and not required by anything above.
- Creating the Chromatic account or the GitHub secret.
