# Design System Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish `src/design-system/` with eight extracted components, export it to a newly created Claude Design project as preview HTML, and deploy Storybook on a second AWS Amplify app.

**Architecture:** A third build pass, modelled on `scripts/prerender.mjs`. `src/entry-design.tsx` declares a card per component; Vite SSR-builds it; `scripts/build-design-bundle.mjs` renders each card to standalone HTML, inlining the stylesheet that `npm run build` already emitted to `dist/assets/*.css`. Because `vite.config.ts` pins `generateScopedName`, the SSR markup and that stylesheet agree on every scoped class name. Extraction moves rules out of screen modules into design-system modules without moving the positioning wrappers that surround them.

**Tech Stack:** React 19 (build-time only), TypeScript, Vite 8, CSS Modules, Storybook 10 (`@storybook/react-vite`), Vitest 4, AWS Amplify.

**Spec:** `docs/superpowers/specs/2026-07-30-design-system-export-design.md`

## Global Constraints

- **No hooks, no event handlers, no browser APIs in any `src/` component.** The site prerenders with zero JS. Anything needing state becomes CSS.
- **No inline `style` attributes in `src/`.** The deployed CSP is `style-src 'self'` with no `'unsafe-inline'`. Use `toneClass()` / `surfaceClass()` from `src/design-system/tones.ts`. `.stories.tsx` files are exempt — they never prerender, and `Button.stories.tsx` already uses inline styles.
- **No id selectors in any `.module.css`.** They compile to scoped names and match nothing. `src/App.test.ts` enforces this.
- **A file exporting both a component and a helper trips `react-refresh`.** Helpers get their own module — see `Tag/tagVariant.ts`, `Icon/icons.ts`.
- **Design-system components never import from `src/data/`.** They take props.
- **Every extracted component owns its internal shape only.** Each call site keeps its own positioning/visibility wrapper class in its existing screen module. This is why every extracted component takes a `className` passthrough.
- **Verification after every task:** `npm run build && npm run test && npm run lint && npm run typecheck:dev`. `npm run build` is the meaningful gate — it is the only thing that runs `scripts/prerender.mjs`.
- **KNOWN BROKEN (pre-existing, found at Task 2): `npm run test`'s `storybook` browser project cannot import.** `@storybook/addon-vitest`'s setup file does `import { elementRoles } from 'aria-query'`; the package is CJS and Vite's browser-mode dep optimizer does not surface its named exports, so all three existing story files fail to import. Verified on a clean tree at `origin/main` — 3 failed / 4 passed there, unchanged by any work here. The `unit` project is unaffected and passes. **This must be fixed before Phase 2**, where Tasks 5–12 each add a story whose tests would otherwise never run. Likely fix: add `aria-query` to `optimizeDeps.include` or `test.server.deps.inline` in `vitest.config.ts`. Until then, read "`npm run test` passes" as "the `unit` project passes and the `storybook` project fails exactly as it did before."
- Commit after every task. Branch is `design-system/export-and-storybook`, based on `origin/main`.

---

## File Structure

**Created:**

| Path | Responsibility |
| --- | --- |
| `src/entry-design.tsx` | Declares `cards: DesignCard[]` — one card per component/foundation. SSR entry for the bundle. |
| `src/designCardChrome.tsx` | The `Section` component used by the cards. Separate module so `entry-design.tsx` exports only data and functions — mixing a component in trips `react-refresh/only-export-components`. |
| `src/entry-design.test.ts` | Drift guard: every design-system directory has a card. |
| `scripts/build-design-bundle.mjs` | Renders each card to standalone HTML; asserts every rendered class is styled. |
| `scripts/design-card.css` | Plain (non-module) gallery chrome: dark ground, card padding, variant rows. |
| `src/design-system/LabeledNote/` | `LabeledNote.tsx`, `.module.css`, `index.ts`, `.stories.tsx` |
| `src/design-system/AvailabilityPill/` | same four files |
| `src/design-system/Wordmark/` | same four files |
| `src/design-system/MetricStrip/` | same four files |
| `src/design-system/FactList/` | same four files |
| `src/design-system/MediaWell/` | same four files |
| `src/design-system/SectionHeading/` | same four files |
| `src/design-system/Portrait/` | same four files |
| `src/design-system/Tabs/Tabs.stories.tsx` | The one existing component with no stories. |
| `amplify.storybook.yml` | Build spec for the second Amplify app. |

**Modified:** `src/design-system/index.ts` (barrel), `package.json` (scripts, drop `@chromatic-com/storybook`), `.gitignore`, `.storybook/main.ts`, and the five screen modules the extractions come out of.

`scripts/design-card.css` is deliberately **not** a CSS Module: it must not enter `App`'s tree, because the bundle reads its app CSS from `dist/assets/*.css` which only contains what `App` imports.

---

# Phase 0 — Resolve the upload contract

> **RESOLVED 2026-07-30.** Findings below; Tasks 2–4 and 15 have been amended to match.
>
> **Project:** `19746144-6183-4f19-bbc3-c5c057d68436` — "Jon Leibham Portfolio DS",
> verified `PROJECT_TYPE_DESIGN_SYSTEM`, `canEdit: true`.
>
> A separate, mature **"Dossier Design System"** project also exists
> (`487c1bc2-b5ca-4c8c-837d-172f4496fabc`) with 16 components, six themes,
> tokens and UI kits for the finance/todos/showcase apps. The user was shown
> this and chose to create a separate portfolio project anyway. Its conventions
> are still the reference for the format below, since the app produced them.
>
> 1. **`_ds_manifest.json` is compiled by the app**, not by us. It lists
>    `components` (name + sourcePath) and `cards` (path, group, viewport,
>    subtitle, name). The generator must not emit it.
> 2. **The `@dsCard` marker carries four attributes**, not one:
>    `group`, `viewport` (a `"WxH"` string), `name`, `subtitle`. Emitting only
>    `group` would lose everything the pane shows on the card.
> 3. **Cards link a shared `../styles.css`** rather than inlining the
>    stylesheet, and wrap content in an element that sets
>    `background: var(--ground); min-height: 100vh`. Verified against
>    `guidelines/brand-mark.html` in the Dossier project.
> 4. **`report_validate` remains unconfirmed** — no evidence it is required, and
>    the manifest being app-compiled suggests it is optional telemetry. Treated
>    as optional; confirm empirically at Task 4 and call it at Task 15 only if
>    Task 4 shows it is needed.
> 5. **`thin` / `variantsIdentical` remain undocumented.** Best reading: a card
>    whose content is far smaller than its declared `viewport`, and a variant
>    grid whose entries render identically. The mitigation stands unchanged —
>    `MediaWell` (Task 10) and `Portrait` (Task 12) get deliberately fuller
>    cards, and every card declares a viewport close to its real content size.

### Task 1: Establish what DesignSync actually requires

No code. This resolves the spec's open question before the generator's output contract is fixed.

**Files:** none (findings recorded in the task's commit message and reported to the user)

**Interfaces:**
- Produces: a yes/no on each of the three questions below, which Task 2 and Task 4 depend on.

- [ ] **Step 1: Create the Claude Design project and inspect an empty one**

Call `DesignSync` with `method: "list_projects"` — not to find a reuse target (the spec calls for a new project) but to pick a non-colliding name and confirm write access.

Then `method: "create_project"`, `name: "Jon Leibham Portfolio DS"`.

- [ ] **Step 2: Verify the project type is a design system**

Call `DesignSync` with `method: "get_project"` and the new `projectId`.

Expected: `type` is `PROJECT_TYPE_DESIGN_SYSTEM`. That type is immutable at creation — if it is anything else, the project is unusable for this purpose and must be recreated. Stop and report if so.

- [ ] **Step 3: Answer the three contract questions**

Record explicit answers:

1. Does the bundle need to emit `.render-check.json`, or does the app produce it? The `DesignSync` schema describes `_ds_manifest.json` as "compiled into by the app's self-check" from the `@dsCard` markers, which suggests the app owns it — confirm rather than assume.
2. Is `report_validate` required after `write_files`, or optional telemetry?
3. What do `thin` and `variantsIdentical` in the `counts` shape measure? If a thinness check exists, `MediaWell` (an empty well) and `Portrait` (one image) need deliberately fuller cards in Task 10 and Task 12.

Read the `DesignSync` tool description as the authority. If a question cannot be answered from it, note that it will be answered empirically by the Task 5 upload, and design Task 2's generator so that adding a `.render-check.json` later is additive rather than a rewrite.

- [ ] **Step 4: Report findings and commit**

Report the `projectId` and the three answers to the user. No files changed, so no commit — carry the `projectId` forward to Task 5.

---

# Phase 1 — The export pipeline

### Task 2: Card declarations and the gallery chrome

**Files:**
- Create: `src/entry-design.tsx`
- Create: `scripts/design-card.css`
- Create: `src/entry-design.test.ts`

**Interfaces:**
- Consumes: `Button`, `Tag`, `Tabs`, `Icon`, `tones`, `surfaces` from `src/design-system`.
- Produces: `export interface DesignCard`, `export const cards: DesignCard[]`, `export function renderCard(card: DesignCard): string`. Task 3's generator imports `cards` and `renderCard` from the SSR build output.

- [ ] **Step 1: Write the failing test**

Create `src/entry-design.test.ts`:

```ts
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { cards } from './entry-design'

const dsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'design-system')

/** Every component directory under design-system/, by name. */
function componentDirs(): string[] {
  return readdirSync(dsDir).filter((entry) => statSync(path.join(dsDir, entry)).isDirectory())
}

/**
 * A component with no card is invisible in Claude Design, and nothing else
 * fails — the bundle just silently ships one card fewer. This is the guard.
 */
describe('design cards', () => {
  it.each(componentDirs())('has a card for %s', (name) => {
    expect(cards.map((card) => card.name)).toContain(name)
  })

  it('gives every card a unique slug', () => {
    const slugs = cards.map((card) => card.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('puts every card in a group', () => {
    expect(cards.filter((card) => !card.group)).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run --project unit src/entry-design.test.ts`
Expected: FAIL — cannot resolve `./entry-design`.

- [ ] **Step 3: Write the gallery chrome CSS**

Create `scripts/design-card.css`. Plain CSS, class prefix `dsc-`, never imported by `App`:

```css
/* Gallery chrome for the exported Claude Design cards.
   Not a CSS Module and never imported by App: the bundle reads its app CSS
   from dist/assets/*.css, which only contains what App's tree imports. */

/* The card's own ground. Modelled on `.dsroot` in the existing Dossier
   project's guidelines cards: the pane supplies its own background, and
   without this the components render invisible — the whole palette is dark. */
.dsc-body {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 40px;
  background: var(--ground);
  color: var(--text-primary);
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dsc-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dsc-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.dsc-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.dsc-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.dsc-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.dsc-swatch {
  border-radius: 12px;
  border: 1px solid var(--hairline);
  overflow: hidden;
}

.dsc-chip {
  height: 64px;
}

.dsc-name {
  display: block;
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.dsc-pane {
  width: 320px;
  max-width: 100%;
}
```

- [ ] **Step 4: Write the card declarations**

Create `src/entry-design.tsx`. Four component cards plus one Colors card — the five that Task 5 uploads. Swatches use `surfaceClass`/`toneClass` rather than inline styles, so the same tone table the app uses is what gets exported:

```tsx
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Button, Icon, Tabs, Tag, toneClass, tones } from './design-system'

export interface DesignCard {
  /** Written to design-bundle/<slug>.html. Must be unique. */
  slug: string
  /** Component directory name, or the foundation's name. */
  name: string
  /** Section label in the Design System pane. */
  group: string
  subtitle?: string
  viewport: { width: number; height?: number }
  render: () => ReactElement
}

function Section({ label, children }: { label: string; children: ReactElement | ReactElement[] }) {
  return (
    <div className="dsc-group">
      <span className="dsc-label">{label}</span>
      <div className="dsc-row">{children}</div>
    </div>
  )
}

export const cards: DesignCard[] = [
  {
    slug: 'colors',
    name: 'Colors',
    group: 'Foundations',
    subtitle: 'Ten source tones, applied through the accent slot',
    viewport: { width: 900, height: 520 },
    render: () => (
      <div className="dsc-swatches">
        {tones.map((tone) => (
          <div key={tone} className="dsc-swatch">
            <div className={`dsc-chip ${toneClass('bg', tone)}`} />
            <span className="dsc-name">{tone}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: 'button',
    name: 'Button',
    group: 'Components',
    subtitle: 'Solid / outline / ghost / icon, four sizes',
    viewport: { width: 720, height: 620 },
    render: () => (
      <>
        <Section label="Variants">
          <Button size="lg">Solid</Button>
          <Button size="lg" variant="outline">Outline</Button>
          <Button size="lg" variant="ghost">Ghost</Button>
          <Button size="md" variant="icon" aria-label="Back">
            <Icon name="arrowLeft" size={18} />
          </Button>
        </Section>
        <Section label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
        </Section>
        <Section label="With an icon, and block">
          <div className="dsc-pane">
            <Button size="xl" block>
              See the work
              <Icon name="arrowUpRight" size={17} />
            </Button>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'tag',
    name: 'Tag',
    group: 'Components',
    subtitle: 'Neutral / cloud / data, two sizes',
    viewport: { width: 640, height: 320 },
    render: () => (
      <>
        <Section label="Variants">
          <Tag variant="neutral">TypeScript</Tag>
          <Tag variant="cloud">AWS Amplify</Tag>
          <Tag variant="data">Turso</Tag>
        </Section>
        <Section label="Sizes">
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
        </Section>
      </>
    ),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Components',
    subtitle: 'Chips and underline — a radio group, no JavaScript',
    viewport: { width: 720, height: 340 },
    render: () => (
      <>
        <Section label="Chips">
          <Tabs
            name="ds-card-chips"
            items={['All', 'Web', 'AI', 'Utilities']}
            active="All"
            label="Filter work by category"
            variant="chips"
          />
        </Section>
        <Section label="Underline">
          <Tabs
            name="ds-card-underline"
            items={['Frontend', 'Backend', 'Tooling']}
            active="Frontend"
            label="Choose a part of the stack"
            variant="underline"
          />
        </Section>
      </>
    ),
  },
  {
    slug: 'icon',
    name: 'Icon',
    group: 'Components',
    subtitle: 'The full inlined Lucide set plus two brand marks',
    viewport: { width: 720, height: 260 },
    render: () => (
      <Section label="All icons">
        <>
          {(
            [
              'home', 'layoutGrid', 'briefcase', 'user', 'search', 'arrowLeft',
              'arrowUpRight', 'chevronRight', 'download', 'share',
              'graduationCap', 'linkedin', 'github',
            ] as const
          ).map((name) => (
            <Icon key={name} name={name} size={24} />
          ))}
        </>
      </Section>
    ),
  },
]

/** Called by scripts/build-design-bundle.mjs. */
export function renderCard(card: DesignCard): string {
  return renderToStaticMarkup(card.render())
}
```

Note the test asserts a card per *directory* under `design-system/`, and `Icon`, `Button`, `Tag`, `Tabs` are the only four directories today. Phase 2 adds eight more, and this test is what will fail if a card is forgotten.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run --project unit src/entry-design.test.ts`
Expected: PASS — 4 directory cards, unique slugs, all grouped.

- [ ] **Step 6: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass. `npm run build` must still succeed — `entry-design.tsx` is in `src/`, so `tsc -b` typechecks it, but nothing imports it into `App`, so the shipped page is unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/entry-design.tsx src/entry-design.test.ts scripts/design-card.css
git commit -m "Declare the Claude Design cards and their gallery chrome"
```

---

### Task 3: The bundle generator

**Files:**
- Create: `scripts/build-design-bundle.mjs`
- Modify: `package.json` (add `build:design` script)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `cards`, `renderCard` from `dist-design/entry-design.js`; the stylesheet at `dist/assets/*.css`; `scripts/design-card.css`.
- Produces: `design-bundle/<slug>.html`, one per card, each beginning with a `@dsCard` marker. Task 5 uploads these.

- [ ] **Step 1: Add the ignores**

Append to `.gitignore`, under the existing `dist-ssr` line:

```
dist-design
design-bundle
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, after `"build"`:

```json
"build:design": "npm run build && vite build --ssr src/entry-design.tsx --outDir dist-design && node scripts/build-design-bundle.mjs",
```

`npm run build` runs first because the generator reads the stylesheet it emits to `dist/assets/*.css`. `scripts/prerender.mjs` deletes `dist-ssr` and the orphaned JS chunks but leaves that stylesheet in place.

- [ ] **Step 3: Write the generator**

Create `scripts/build-design-bundle.mjs`:

```js
/**
 * Renders each design card to a standalone HTML file for Claude Design.
 *
 * Runs after two passes, both driven by `npm run build:design`:
 *   1. `npm run build`                       → dist/assets/*.css
 *   2. `vite build --ssr entry-design`       → dist-design/entry-design.js
 *
 * The whole app stylesheet is inlined into every card rather than tree-shaken
 * per component: `vite.config.ts` pins `generateScopedName`, so the SSR markup
 * and that stylesheet agree on every scoped class name, and splitting them
 * apart would only invite a mismatch.
 *
 * Inline <style> is fine here. The `style-src 'self'` CSP governs the deployed
 * portfolio, not files hosted on claude.ai.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const out = path.join(root, 'design-bundle')

const FONTS =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900' +
  '&family=JetBrains+Mono:wght@400;500;700&display=swap'

const assets = path.join(dist, 'assets')
const cssFile = (await readdir(assets).catch(() => [])).find((file) => file.endsWith('.css'))
if (!cssFile) {
  throw new Error('design-bundle: no stylesheet in dist/assets — run `npm run build` first')
}

const appCss = await readFile(path.join(assets, cssFile), 'utf8')
const cardCss = await readFile(path.join(root, 'scripts', 'design-card.css'), 'utf8')
const css = `${appCss}\n${cardCss}`

const { cards, renderCard } = await import(
  new URL(`file://${path.join(root, 'dist-design', 'entry-design.js')}`).href
)

await rm(out, { recursive: true, force: true })
await mkdir(path.join(out, 'cards'), { recursive: true })

// One shared stylesheet at the bundle root, linked by every card as
// `../styles.css`. This is the convention the existing Dossier project already
// uses, and it beats inlining the whole stylesheet into all thirteen cards.
// Cards therefore live one directory deep, so the relative link resolves.
await writeFile(path.join(out, 'styles.css'), css)

for (const card of cards) {
  const markup = renderCard(card)
  assertStyled(card, markup, css)
  await writeFile(path.join(out, 'cards', `${card.slug}.html`), page(card, markup))
}

await writeFile(path.join(out, 'cards.json'), `${JSON.stringify(cards.map(meta), null, 2)}\n`)

console.log(`design-bundle: ${cards.length} card(s) written to design-bundle/`)

/** Card metadata, for the upload step. `render` is a function and cannot serialize. */
function meta(card) {
  return {
    slug: card.slug,
    name: card.name,
    group: card.group,
    subtitle: card.subtitle,
    viewport: card.viewport,
    path: `cards/${card.slug}.html`,
  }
}

/**
 * The `@dsCard` marker has to be the very first line — the app compiles
 * `_ds_manifest.json` from it, so everything the pane shows on a card comes
 * from these four attributes. Emitting only `group` loses the card's name,
 * subtitle and dimensions.
 *
 * `viewport` is a `WxH` string, not two numbers.
 *
 * Verified against `guidelines/brand-mark.html` in the existing Dossier
 * project, which is the format the app already produces.
 */
function page(card, markup) {
  const { width, height } = card.viewport
  const viewport = height ? `${width}x${height}` : `${width}`

  return `<!-- @dsCard group="${attr(card.group)}" viewport="${viewport}" name="${attr(card.name)}" subtitle="${attr(card.subtitle ?? '')}" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${attr(card.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
<div class="dsc-body">
${markup}
</div>
</body>
</html>
`
}

/** The marker is an HTML comment holding quoted attributes — a stray `"` or
 *  `--` would break the parse. Subtitles are prose, so this is not theoretical. */
function attr(value) {
  return String(value).replace(/"/g, '&quot;').replace(/--/g, '—')
}

/**
 * A card whose classes are missing from the stylesheet renders as unstyled
 * markup on a dark ground — which reads as an empty card, not as an error.
 * This is the local equivalent of `assertStatic` in prerender.mjs: catch it at
 * build time rather than discovering it in the pane.
 *
 * Only scoped module classes are checked. `dsc-` chrome lives in
 * design-card.css and is concatenated above, so it is covered by the same test.
 */
function assertStyled(card, markup, styles) {
  const used = new Set()
  for (const [, attr] of markup.matchAll(/class="([^"]+)"/g)) {
    for (const name of attr.split(/\s+/).filter(Boolean)) used.add(name)
  }

  const missing = [...used].filter((name) => !styles.includes(`.${name}`))
  if (missing.length > 0) {
    throw new Error(
      `design-bundle: card "${card.slug}" uses class(es) with no rule: ${missing.join(', ')}. ` +
        'A component not reachable from App is not in dist/assets/*.css.',
    )
  }
}
```

- [ ] **Step 4: Run the generator**

Run: `npm run build:design`
Expected: `design-bundle: 5 card(s) written to design-bundle/` and no `assertStyled` throw.

- [ ] **Step 5: Verify a card is genuinely standalone**

Run: `head -2 design-bundle/cards/button.html && ls design-bundle design-bundle/cards`

Expected: line 1 carries all four attributes —

```
<!-- @dsCard group="Components" viewport="720x620" name="Button" subtitle="Solid / outline / ghost / icon, four sizes" -->
```

`design-bundle/` holds `styles.css`, `cards.json` and `cards/`; `cards/` holds `button.html`, `colors.html`, `icon.html`, `tabs.html`, `tag.html`.

- [ ] **Step 6: Eyeball one card in a browser**

Open `design-bundle/cards/button.html` with the `preview_start` browser tool (`{url: "file://<abs path>/design-bundle/cards/button.html"}`), then `computer {action: "screenshot"}`.

The `../styles.css` link must resolve — if the card is unstyled, the bundle layout is wrong, not the CSS.

Expected: gold pills legible on the dark ground, all four variants and four sizes visibly different from each other. **If everything is invisible, the ground rule failed — fix before uploading anything.** This is a local proxy for the pane check in Task 5, not a substitute for it.

- [ ] **Step 7: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add scripts/build-design-bundle.mjs package.json .gitignore
git commit -m "Render each design card to standalone HTML for Claude Design"
```

---

### Task 4: Upload the five proving cards

**Files:** none — this task changes only the remote project.

**Interfaces:**
- Consumes: `projectId` from Task 1, `design-bundle/*.html` from Task 3.

- [ ] **Step 1: Regenerate the bundle**

Run: `npm run build:design`
Expected: 5 cards. Never upload a stale `design-bundle/`.

- [ ] **Step 2: Show the user the plan and get an explicit yes**

`write_files` publishes to claude.ai. Before finalizing, show the user the exact list — `colors.html`, `button.html`, `tag.html`, `tabs.html`, `icon.html` — the `projectId`, and the local directory. Wait for a yes. Do not proceed on silence.

- [ ] **Step 3: Finalize the plan**

Call `DesignSync`:
- `method: "finalize_plan"`
- `projectId`: `19746144-6183-4f19-bbc3-c5c057d68436`
- `writes`: `["styles.css", "cards/*.html"]`
- `localDir`: the absolute path to `design-bundle`

Expected: a `planId`.

- [ ] **Step 4: Write the files**

Call `DesignSync` with `method: "write_files"`, the `planId`, and one entry per file using `localPath` (never inline `data` — `localPath` uploads from disk without the contents entering context):

```
{ path: "styles.css",       localPath: "styles.css" }
{ path: "cards/colors.html", localPath: "cards/colors.html" }
{ path: "cards/button.html", localPath: "cards/button.html" }
{ path: "cards/tag.html",    localPath: "cards/tag.html" }
{ path: "cards/tabs.html",   localPath: "cards/tabs.html" }
{ path: "cards/icon.html",   localPath: "cards/icon.html" }
```

`styles.css` must be in the same `write_files` batch — every card links it, and cards uploaded without it render unstyled.

- [ ] **Step 5: Confirm the upload landed**

Call `DesignSync` with `method: "list_files"` and the `projectId`.
Expected: six paths, and `_ds_manifest.json` appearing on its own — the app compiles that from the `@dsCard` markers, so its presence with five card entries is the first real signal the markers parsed. This still confirms **upload**, not render.

- [ ] **Step 6: Hand the render gate to the user — STOP HERE**

Ask the user to open the Design System pane and confirm three things:

1. all five cards are visible against the dark ground, not invisible-on-dark;
2. fonts either applied (Figtree/JetBrains Mono) or fell back acceptably — if claude.ai's CSP blocked the Google Fonts request, decide then whether to embed woff2 subsets;
3. variants within a card look distinct from one another — the four Button variants, the three Tag colors.

**Do not begin Phase 2 until that confirmation comes back.** Nothing available here can see the pane; `list_files` returning five paths is not the gate. A 200 mistaken for a passing gate is what this sequencing exists to prevent.

If the cards are wrong, fix `scripts/build-design-bundle.mjs` or `scripts/design-card.css` and repeat from Step 1 — still with only five cards.

---

# Phase 2 — Extraction

Every task in this phase follows the same shape, so read this once:

**The CSS move rule.** Rules move *verbatim* into the new module and are renamed to the component's generic names. The screen module keeps any rule that positions, sizes, or hides the block from outside — margins, grid placement, `display: contents`, and every `@media` visibility rule. The call site passes its remaining wrapper class through `className`.

**Why this matters more than it looks.** `TabBar`'s `.wordmark` and `.availability` live *inside* a `@media (min-width: 768px)` block (`TabBar.module.css:119` and `:171`) while `HomeScreen`'s are unconditional (`HomeScreen.module.css:19` and `:26`). The two render at different breakpoints on purpose — `TabBar.tsx`'s comment records that Home's brand row hides above 768 rather than saying it twice. Merging those stylesheets makes the desktop layout diverge with nothing failing: `npm run build` will not catch it and neither will `App.test.ts`.

**The per-task visual check is therefore mandatory**, not optional. Every task ends by loading the dev server at 390px and 1280px and confirming the affected screens are unchanged.

**Barrel:** every task adds its export to `src/design-system/index.ts`.

**Card:** every task adds a card to `src/entry-design.tsx`, or `src/entry-design.test.ts` fails.

---

### Task 5: LabeledNote

The highest-value extraction: three copies of one shape today.

**Files:**
- Create: `src/design-system/LabeledNote/LabeledNote.tsx`, `LabeledNote.module.css`, `index.ts`, `LabeledNote.stories.tsx`
- Modify: `src/components/HomeScreen/HomeScreen.tsx`, `HomeScreen.module.css:184-211` (`.now`, `.nowLabel`, `.nowText`)
- Modify: `src/components/CareerScreen/CareerScreen.tsx`, `CareerScreen.module.css:198-225` (`.footer`, `.footerLabel`, `.footerText`)
- Modify: `src/components/AboutScreen/AboutScreen.tsx`, `AboutScreen.module.css:113-140` (`.offClock`, `.offClockLabel`, `.offClockText`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function LabeledNote(props: LabeledNoteProps)`, `export interface LabeledNoteProps { label: ReactNode; children: ReactNode; className?: string }`.

- [ ] **Step 1: Compare the three rule sets before moving anything**

Run: `sed -n '184,211p' src/components/HomeScreen/HomeScreen.module.css; sed -n '198,225p' src/components/CareerScreen/CareerScreen.module.css; sed -n '113,140p' src/components/AboutScreen/AboutScreen.module.css`

Read all three side by side and write down, in the commit message, exactly which declarations differ. Declarations common to all three move to the component. Declarations unique to one screen stay in that screen's module, applied through `className`. **Do not assume they are identical** — if they diverge more than trivially, the correct outcome may be that only two of the three adopt the component. That is a valid result, not a failure.

- [ ] **Step 2: Write the component**

Create `src/design-system/LabeledNote/LabeledNote.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from './LabeledNote.module.css'

export interface LabeledNoteProps {
  /** The small leading label — "Now", "Why", "Off clock". ReactNode so a
   *  caller can pass text containing a non-breaking space. */
  label: ReactNode
  children: ReactNode
  /** The call site's own positioning class. Never omit it at a call site that
   *  had one: margins and grid placement stay in the screen module. */
  className?: string
}

/**
 * A small label followed by a line of text.
 *
 * Home's "Now", Career's "Why" and About's "Off clock" are the same shape in
 * three different layout contexts, so this owns the label/text relationship
 * only — where the block sits stays with the screen.
 */
export function LabeledNote({ label, children, className = '' }: LabeledNoteProps) {
  return (
    <p className={[styles.note, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>{label}</span>
      <span className={styles.text}>{children}</span>
    </p>
  )
}
```

Create `src/design-system/LabeledNote/index.ts`:

```ts
export * from './LabeledNote'
```

- [ ] **Step 3: Write the module CSS**

Create `src/design-system/LabeledNote/LabeledNote.module.css` with the declarations Step 1 found common to all three, renamed `.note` / `.label` / `.text`. Copy the declaration values verbatim from the source rules — do not retype or "tidy" them.

- [ ] **Step 4: Trim the three screen modules**

In each screen module, delete the declarations that moved and keep only what positions the block. For example, if `HomeScreen`'s `.now` had both `margin-top: 28px` and the label/text typography, `.now` keeps `margin-top` alone.

- [ ] **Step 5: Update the three call sites**

`HomeScreen.tsx` — replace the `<p className={styles.now}>` block with:

```tsx
<LabeledNote label="Now" className={styles.now}>
  {profile.now}
</LabeledNote>
```

`CareerScreen.tsx` — replace the `<p className={styles.footer}>` block with:

```tsx
<LabeledNote label="Why" className={styles.footer}>
  {profile.why}
</LabeledNote>
```

`AboutScreen.tsx` — replace the `<p className={styles.offClock}>` block with:

```tsx
<LabeledNote label={<>Off&nbsp;clock</>} className={styles.offClock}>
  {profile.offClock}
</LabeledNote>
```

The `&nbsp;` is deliberate and currently in the markup — keep it.

Add `import { LabeledNote } from '../../design-system'` to each, and drop any now-unused `styles.*Label` / `styles.*Text` references.

- [ ] **Step 6: Add to the barrel and add a card**

In `src/design-system/index.ts`, after the existing exports:

```ts
export * from './LabeledNote'
```

In `src/entry-design.tsx`, add to `cards`:

```tsx
{
  slug: 'labeled-note',
  name: 'LabeledNote',
  group: 'Components',
  subtitle: 'A small label and a line of text',
  viewport: { width: 640, height: 280 },
  render: () => (
    <div className="dsc-col">
      <LabeledNote label="Now">Building a design system for four apps to share.</LabeledNote>
      <LabeledNote label="Why">Frontend that holds up under real traffic.</LabeledNote>
      <LabeledNote label={<>Off&nbsp;clock</>}>Bouldering, and a stubborn sourdough starter.</LabeledNote>
    </div>
  ),
},
```

Add `LabeledNote` to the import from `./design-system`.

- [ ] **Step 7: Write the story**

Create `src/design-system/LabeledNote/LabeledNote.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabeledNote } from './LabeledNote'

const meta = {
  title: 'Design System/LabeledNote',
  component: LabeledNote,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LabeledNote>

export default meta
type Story = StoryObj<typeof meta>

/** Home's "Now" line. */
export const Now: Story = {
  args: { label: 'Now', children: 'Building a design system for four apps to share.' },
}

/** Career's "Why" line, pinned under the timeline. */
export const Why: Story = {
  args: { label: 'Why', children: 'Frontend that holds up under real traffic.' },
}

/** About's "Off clock" line — the label carries a non-breaking space. */
export const OffClock: Story = {
  args: { label: <>Off&nbsp;clock</>, children: 'Bouldering, and a stubborn sourdough starter.' },
}
```

- [ ] **Step 8: Run the full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass. `src/entry-design.test.ts` now asserts a `LabeledNote` card and finds one.

- [ ] **Step 9: Visual check at both breakpoints — mandatory**

Start the dev server: `preview_start {name: "jonleibham-dev"}` (the only entry in `.claude/launch.json`, on port 5173).

At `resize_window {width: 390, height: 900}`, screenshot `#home`, `#career` and `#about`. Then at `resize_window {preset: "desktop"}` (1280), screenshot the same three.

Expected: the "Now", "Why" and "Off clock" lines are pixel-unchanged at both widths. Career's "Why" must still sit inside the pinned tinted card on desktop and stack on mobile; About's "Off clock" must still sit beside `.actions`.

If any of the three moved, the fix is in the screen module, not the component — a positioning declaration was moved that should have stayed.

- [ ] **Step 10: Commit**

```bash
git add src/design-system/LabeledNote src/design-system/index.ts src/entry-design.tsx src/components/HomeScreen src/components/CareerScreen src/components/AboutScreen
git commit -m "Extract LabeledNote from Home, Career and About"
```

---

### Task 6: AvailabilityPill

**Files:**
- Create: `src/design-system/AvailabilityPill/AvailabilityPill.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/HomeScreen/HomeScreen.tsx`, `HomeScreen.module.css:26-52` (`.availability`, `.dot`, `.availabilityLabel`)
- Modify: `src/components/TabBar/TabBar.tsx`, `TabBar.module.css:171-197` (`.availability`, `.dot`, `.availabilityLabel` — **nested inside `@media (min-width: 768px)`**)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function AvailabilityPill(props: AvailabilityPillProps)`, `export interface AvailabilityPillProps { children: ReactNode; className?: string }`.

- [ ] **Step 1: Diff the two rule sets**

Run: `sed -n '26,52p' src/components/HomeScreen/HomeScreen.module.css; sed -n '171,197p' src/components/TabBar/TabBar.module.css`

TabBar's copy is inside a `@media (min-width: 768px)` block; Home's is not. **The media query stays in `TabBar.module.css`.** What moves is only the pill's internal appearance, and only the declarations both share.

- [ ] **Step 2: Write the component**

Create `src/design-system/AvailabilityPill/AvailabilityPill.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from './AvailabilityPill.module.css'

export interface AvailabilityPillProps {
  children: ReactNode
  /** The call site's own positioning class. TabBar's pill is rail-only and is
   *  hidden below 768 by a rule that stays in TabBar.module.css. */
  className?: string
}

/**
 * A status dot and a label.
 *
 * Home shows it in the brand row below 768; the rail shows it in its foot from
 * 768 up. Only one is ever visible, which is why the breakpoint rules stay
 * with the screens.
 */
export function AvailabilityPill({ children, className = '' }: AvailabilityPillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      <i className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  )
}
```

Create `src/design-system/AvailabilityPill/index.ts`:

```ts
export * from './AvailabilityPill'
```

- [ ] **Step 3: Write the module CSS**

Create `AvailabilityPill.module.css` with the shared declarations as `.pill` / `.dot` / `.label`, values copied verbatim. If the dot carries a pulse animation, move the `@keyframes` with it.

- [ ] **Step 4: Trim both screen modules**

`HomeScreen.module.css`: `.availability` keeps only its placement in the brand row.
`TabBar.module.css`: the `@media (min-width: 768px)` block keeps `.availability` with only its rail placement. **The media query itself does not move.**

- [ ] **Step 5: Update both call sites**

`HomeScreen.tsx` — replace the availability `<span>` with:

```tsx
<AvailabilityPill className={styles.availability}>{profile.availability}</AvailabilityPill>
```

`TabBar.tsx` — replace the availability `<span>` in `.foot` with the identical line. Add `AvailabilityPill` to each file's `../../design-system` import.

- [ ] **Step 6: Barrel and card**

`src/design-system/index.ts`: `export * from './AvailabilityPill'`

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'availability-pill',
  name: 'AvailabilityPill',
  group: 'Components',
  subtitle: 'Status dot and label',
  viewport: { width: 520, height: 200 },
  render: () => (
    <div className="dsc-col">
      <AvailabilityPill>Open to work</AvailabilityPill>
      <AvailabilityPill>Available from March</AvailabilityPill>
    </div>
  ),
},
```

- [ ] **Step 7: Write the story**

Create `src/design-system/AvailabilityPill/AvailabilityPill.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvailabilityPill } from './AvailabilityPill'

const meta = {
  title: 'Design System/AvailabilityPill',
  component: AvailabilityPill,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvailabilityPill>

export default meta
type Story = StoryObj<typeof meta>

/** As it reads in Home's brand row below 768. */
export const Default: Story = { args: { children: 'Open to work' } }

export const LongerLabel: Story = { args: { children: 'Available from March 2027' } }
```

- [ ] **Step 8: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 9: Visual check at both breakpoints — mandatory**

At 390px: Home's brand row shows the pill; the rail is not present.
At 1280px: Home's brand row is hidden and the rail foot shows the pill. **Exactly one pill is visible at each width.** Two visible pills, or none, means a breakpoint rule moved that should have stayed.

- [ ] **Step 10: Commit**

```bash
git add src/design-system/AvailabilityPill src/design-system/index.ts src/entry-design.tsx src/components/HomeScreen src/components/TabBar
git commit -m "Extract AvailabilityPill from Home and the rail"
```

---

### Task 7: Wordmark

**Files:**
- Create: `src/design-system/Wordmark/Wordmark.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/HomeScreen/HomeScreen.tsx`, `HomeScreen.module.css:19-25` (`.wordmark`)
- Modify: `src/components/TabBar/TabBar.tsx`, `TabBar.module.css:119-134` (`.wordmark`, `.wordmarkTitle` — **inside `@media (min-width: 768px)`**)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function Wordmark(props: WordmarkProps)`, `export interface WordmarkProps { name: string; title?: string; className?: string }`.

- [ ] **Step 1: Note the structural change**

Home currently renders `<span className={styles.wordmark}>{profile.name}</span>` — text directly inside the styled span. The component wraps the name in an inner span so an optional title can sit beneath it. That extra element changes what the typography rules apply to, so `.wordmark` becomes a flex column and the type declarations move onto `.name`. Verify this at Step 8 rather than assuming it is transparent.

- [ ] **Step 2: Write the component**

Create `src/design-system/Wordmark/Wordmark.tsx`:

```tsx
import styles from './Wordmark.module.css'

export interface WordmarkProps {
  name: string
  /** The role line beneath the name. Rail only — Home shows the name alone. */
  title?: string
  className?: string
}

/**
 * The name, optionally over a role line.
 *
 * Home shows it in the brand row below 768; the rail shows it with the title
 * from 768 up. The breakpoint rules stay with the screens.
 */
export function Wordmark({ name, title, className = '' }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <span className={styles.name}>{name}</span>
      {title && <span className={styles.title}>{title}</span>}
    </span>
  )
}
```

Create `src/design-system/Wordmark/index.ts`:

```ts
export * from './Wordmark'
```

- [ ] **Step 3: Write the module CSS**

`.wordmark` is `display: flex; flex-direction: column;`. `.name` takes the type declarations verbatim from `HomeScreen.module.css:19-25`. `.title` takes them from `TabBar.module.css`'s `.wordmarkTitle`. Where Home's and the rail's name typography differ, the difference stays in the screen module and rides in on `className`.

- [ ] **Step 4: Update both call sites**

`HomeScreen.tsx`:

```tsx
<Wordmark name={profile.name} className={styles.wordmark} />
```

`TabBar.tsx` — replace the two spans inside `.brand`:

```tsx
<Wordmark name={profile.name} title={profile.title} />
```

Keep the surrounding `<div className={styles.brand}>`; it is the rail's positioning wrapper and is hidden below 768.

- [ ] **Step 5: Barrel and card**

`src/design-system/index.ts`: `export * from './Wordmark'`

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'wordmark',
  name: 'Wordmark',
  group: 'Brand',
  subtitle: 'Name alone, and name over a role line',
  viewport: { width: 520, height: 240 },
  render: () => (
    <div className="dsc-col">
      <Wordmark name="Jon Leibham" />
      <Wordmark name="Jon Leibham" title="Senior Frontend Engineer" />
    </div>
  ),
},
```

- [ ] **Step 6: Write the story**

Create `src/design-system/Wordmark/Wordmark.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wordmark } from './Wordmark'

const meta = {
  title: 'Design System/Wordmark',
  component: Wordmark,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Wordmark>

export default meta
type Story = StoryObj<typeof meta>

/** Home's brand row: the name alone. */
export const NameOnly: Story = { args: { name: 'Jon Leibham' } }

/** The rail's head, from 768 up. */
export const WithTitle: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Frontend Engineer' },
}
```

- [ ] **Step 7: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 8: Visual check at both breakpoints — mandatory**

At 390px: Home's wordmark is unchanged — same size, weight and baseline as before. At 1280px: the rail's wordmark shows the name over the title, and Home's brand row is hidden.

Pay attention to the extra wrapper span from Step 1. If Home's wordmark shifted vertically or changed size, the type declarations landed on the wrong element.

- [ ] **Step 9: Commit**

```bash
git add src/design-system/Wordmark src/design-system/index.ts src/entry-design.tsx src/components/HomeScreen src/components/TabBar
git commit -m "Extract Wordmark from Home and the rail"
```

---

### Task 8: MetricStrip

**Files:**
- Create: `src/design-system/MetricStrip/MetricStrip.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/HomeScreen/HomeScreen.tsx`, `HomeScreen.module.css:129-183` (`.metrics`, `.metric`, `.metric + .metric`, `.metricValue`, `.metricUnit`, `.metricLabel`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function MetricStrip(props: MetricStripProps)`, `export interface Metric { label: string; value: string; unit?: string }`, `export interface MetricStripProps { metrics: readonly Metric[]; className?: string }`.

The `Metric` shape matches `src/data/profile.ts:41-45` (`{ value, unit, label }`), which is `as const` — hence `readonly`.

- [ ] **Step 1: Write the component**

Create `src/design-system/MetricStrip/MetricStrip.tsx`:

```tsx
import styles from './MetricStrip.module.css'

export interface Metric {
  label: string
  value: string
  unit?: string
}

export interface MetricStripProps {
  /** `readonly` because the callers' data is declared `as const`. */
  metrics: readonly Metric[]
  className?: string
}

/**
 * Numbers over their labels.
 *
 * `dt` precedes `dd` so the description list stays valid; the visual order —
 * number above label — comes from `column-reverse`, not from the markup.
 */
export function MetricStrip({ metrics, className = '' }: MetricStripProps) {
  return (
    <dl className={[styles.metrics, className].filter(Boolean).join(' ')}>
      {metrics.map((metric) => (
        <div key={metric.label} className={styles.metric}>
          <dt className={styles.label}>{metric.label}</dt>
          <dd className={styles.value}>
            {metric.value}
            {metric.unit && <span className={styles.unit}>{metric.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
```

Create `src/design-system/MetricStrip/index.ts`:

```ts
export * from './MetricStrip'
```

- [ ] **Step 2: Move the CSS**

Move `HomeScreen.module.css:129-183` verbatim into `MetricStrip.module.css`, renaming `.metricValue` → `.value`, `.metricUnit` → `.unit`, `.metricLabel` → `.label`. Keep `.metrics` and `.metric` as-is. **Keep the `.metric + .metric` separator rule** — it is the divider between metrics and belongs to the strip.

`HomeScreen.module.css` keeps `.metrics` with only its vertical placement in the screen's stack.

- [ ] **Step 3: Update the call site**

`HomeScreen.tsx` — replace the whole `<dl className={styles.metrics}>` block, and the comment above it (it now lives on the component) with:

```tsx
<MetricStrip metrics={metrics} className={styles.metrics} />
```

Add `MetricStrip` to the `../../design-system` import.

- [ ] **Step 4: Barrel and card**

`src/design-system/index.ts`: `export * from './MetricStrip'`

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'metric-strip',
  name: 'MetricStrip',
  group: 'Components',
  subtitle: 'Numbers over labels, with and without units',
  viewport: { width: 640, height: 260 },
  render: () => (
    <MetricStrip
      metrics={[
        { value: '7.6', unit: 'M', label: 'Users' },
        { value: '2', unit: 'x', label: 'Conversion' },
        { value: '100', unit: '%', label: 'Accessible' },
      ]}
    />
  ),
},
```

- [ ] **Step 5: Write the story**

Create `src/design-system/MetricStrip/MetricStrip.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricStrip } from './MetricStrip'

const meta = {
  title: 'Design System/MetricStrip',
  component: MetricStrip,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricStrip>

export default meta
type Story = StoryObj<typeof meta>

/** Home's three proof numbers. */
export const Default: Story = {
  args: {
    metrics: [
      { value: '7.6', unit: 'M', label: 'Users' },
      { value: '2', unit: 'x', label: 'Conversion' },
      { value: '100', unit: '%', label: 'Accessible' },
    ],
  },
}

/** Units are optional. */
export const NoUnits: Story = {
  args: {
    metrics: [
      { value: '12', label: 'Projects' },
      { value: '9', label: 'Years' },
    ],
  },
}
```

- [ ] **Step 6: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 7: Visual check — mandatory**

At 390px and 1280px, Home's metrics strip is unchanged: numbers above labels, gold numerals, separators between the three.

- [ ] **Step 8: Commit**

```bash
git add src/design-system/MetricStrip src/design-system/index.ts src/entry-design.tsx src/components/HomeScreen
git commit -m "Extract MetricStrip from Home"
```

---

### Task 9: FactList

**Files:**
- Create: `src/design-system/FactList/FactList.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/ProjectDetail/ProjectDetail.tsx`, `ProjectDetail.module.css:70-107` (`.facts`, `.fact + .fact`, `.factLabel`, `.factValue`, `.live`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function FactList(props: FactListProps)`, `export interface Fact { label: string; value: ReactNode; emphasis?: boolean }`, `export interface FactListProps { facts: readonly Fact[]; className?: string }`.

- [ ] **Step 1: Decide whether this merges with MetricStrip**

Read `ProjectDetail.module.css:70-107` and `src/design-system/MetricStrip/MetricStrip.module.css` side by side. Both are label/value description lists.

Merge them into one component with variants **only if the layout declarations are near-identical and differ by a handful of values.** If the two are structurally different — one a `column-reverse` strip with large gold numerals, the other a three-column label-over-value grid — keep them separate. Separate is the expected outcome; record which you chose and why in the commit message.

The rest of this task assumes they stay separate. If they merge, fold this task's card and story into Task 8's component with a `variant` prop and skip to Step 6.

- [ ] **Step 2: Write the component**

Create `src/design-system/FactList/FactList.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from './FactList.module.css'

export interface Fact {
  label: string
  value: ReactNode
  /** Highlights the value — the detail screen's "Live" status. */
  emphasis?: boolean
}

export interface FactListProps {
  facts: readonly Fact[]
  className?: string
}

/**
 * Label-over-value pairs in a row: the detail screen's Role / Shipped / Status.
 */
export function FactList({ facts, className = '' }: FactListProps) {
  return (
    <dl className={[styles.facts, className].filter(Boolean).join(' ')}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.fact}>
          <dt className={styles.label}>{fact.label}</dt>
          <dd className={[styles.value, fact.emphasis ? styles.emphasis : ''].filter(Boolean).join(' ')}>
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
```

Create `src/design-system/FactList/index.ts`:

```ts
export * from './FactList'
```

- [ ] **Step 3: Move the CSS**

Move `ProjectDetail.module.css:70-107` into `FactList.module.css`, renaming `.factLabel` → `.label`, `.factValue` → `.value`, `.live` → `.emphasis`. Keep `.facts`, `.fact` and the `.fact + .fact` separator. Note the current markup has no `.fact` rule of its own — only `.fact + .fact`; add a bare `.fact` rule only if the component needs one.

`ProjectDetail.module.css` keeps `.facts` with only its vertical placement.

- [ ] **Step 4: Update the call site**

`ProjectDetail.tsx` — replace the whole `<dl className={styles.facts}>` block with:

```tsx
<FactList
  className={styles.facts}
  facts={[
    { label: 'Role', value: project.role },
    { label: 'Shipped', value: project.shipped },
    { label: 'Status', value: status.label, emphasis: status.live },
  ]}
/>
```

Add `FactList` to the `../../design-system` import. `status` is already computed at the top of the component.

- [ ] **Step 5: Barrel and card**

`src/design-system/index.ts`: `export * from './FactList'`

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'fact-list',
  name: 'FactList',
  group: 'Components',
  subtitle: 'Label-over-value pairs, with an emphasis state',
  viewport: { width: 640, height: 240 },
  render: () => (
    <FactList
      facts={[
        { label: 'Role', value: 'Design and build' },
        { label: 'Shipped', value: 'March 2026' },
        { label: 'Status', value: 'Live', emphasis: true },
      ]}
    />
  ),
},
```

- [ ] **Step 6: Write the story**

Create `src/design-system/FactList/FactList.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FactList } from './FactList'

const meta = {
  title: 'Design System/FactList',
  component: FactList,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FactList>

export default meta
type Story = StoryObj<typeof meta>

/** The detail screen's three facts, with a live project. */
export const Live: Story = {
  args: {
    facts: [
      { label: 'Role', value: 'Design and build' },
      { label: 'Shipped', value: 'March 2026' },
      { label: 'Status', value: 'Live', emphasis: true },
    ],
  },
}

/** A private build — the status carries no emphasis. */
export const Archived: Story = {
  args: {
    facts: [
      { label: 'Role', value: 'Frontend' },
      { label: 'Shipped', value: '2024' },
      { label: 'Status', value: 'Archived' },
    ],
  },
}
```

- [ ] **Step 7: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 8: Visual check — mandatory**

Navigate to a detail screen (`http://localhost:5173/#p-<id>`, taking an id from `src/data/projects.ts`). At 390px and 1280px the Role / Shipped / Status row is unchanged, and a live project's status still reads in the success color while an archived one does not.

- [ ] **Step 9: Commit**

```bash
git add src/design-system/FactList src/design-system/index.ts src/entry-design.tsx src/components/ProjectDetail
git commit -m "Extract FactList from the project detail screen"
```

---

### Task 10: MediaWell

**Files:**
- Create: `src/design-system/MediaWell/MediaWell.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/ProjectDetail/ProjectDetail.tsx`, `ProjectDetail.module.css:61-69` (`.hero`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function MediaWell(props: MediaWellProps)`, `export interface MediaWellProps { children?: ReactNode; className?: string }`.

- [ ] **Step 1: Write the component**

Create `src/design-system/MediaWell/MediaWell.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from './MediaWell.module.css'

export interface MediaWellProps {
  children?: ReactNode
  className?: string
}

/**
 * A fixed-height surface for a screenshot.
 *
 * Empty today — `TODO.md` still lists "add a screenshot per project". Empty, it
 * is `aria-hidden`, because an empty decorative box has nothing to announce.
 * With children it is a real region and stays in the accessibility tree.
 *
 * `flex: none` matters: with no intrinsic content it is the one child that
 * would otherwise absorb the screen's overflow and silently compress.
 */
export function MediaWell({ children, className = '' }: MediaWellProps) {
  return (
    <div
      className={[styles.well, className].filter(Boolean).join(' ')}
      aria-hidden={children ? undefined : true}
    >
      {children}
    </div>
  )
}
```

Create `src/design-system/MediaWell/index.ts`:

```ts
export * from './MediaWell'
```

- [ ] **Step 2: Move the CSS**

Move `ProjectDetail.module.css:61-69` into `MediaWell.module.css` as `.well`, verbatim — including the height and `flex: none`. `ProjectDetail.module.css` keeps a `.hero` rule only if it carries margin or grid placement; if the rule becomes empty, delete it and drop the `className` at the call site.

- [ ] **Step 3: Update the call site**

`ProjectDetail.tsx` — replace `<div className={styles.hero} aria-hidden="true" />` with:

```tsx
<MediaWell className={styles.hero} />
```

Remove the now-redundant `aria-hidden` — the component sets it when empty. Add `MediaWell` to the `../../design-system` import.

- [ ] **Step 4: Barrel and card**

`src/design-system/index.ts`: `export * from './MediaWell'`

**Task 1 flagged this as a `thin` card candidate** — an empty box may fail a thinness check. Give it deliberate content: empty and filled, side by side.

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'media-well',
  name: 'MediaWell',
  group: 'Components',
  subtitle: 'Empty and filled',
  viewport: { width: 720, height: 480 },
  render: () => (
    <div className="dsc-col">
      <div className="dsc-group">
        <span className="dsc-label">Empty — awaiting a screenshot</span>
        <div className="dsc-pane">
          <MediaWell />
        </div>
      </div>
      <div className="dsc-group">
        <span className="dsc-label">Filled</span>
        <div className="dsc-pane">
          <MediaWell>
            <Icon name="layoutGrid" size={32} />
          </MediaWell>
        </div>
      </div>
    </div>
  ),
},
```

- [ ] **Step 5: Write the story**

Create `src/design-system/MediaWell/MediaWell.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaWell } from './MediaWell'
import { Icon } from '../Icon'

const meta = {
  title: 'Design System/MediaWell',
  component: MediaWell,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MediaWell>

export default meta
type Story = StoryObj<typeof meta>

/** How every detail screen looks today: an empty 186px well. */
export const Empty: Story = { args: {} }

/** With content, it stops being decorative and stays in the a11y tree. */
export const Filled: Story = {
  args: { children: <Icon name="layoutGrid" size={32} /> },
}
```

- [ ] **Step 6: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 7: Visual check — mandatory**

On a detail screen at 390px and 1280px, the hero well keeps its height and does not compress. Scroll to the bottom of a long detail screen and confirm the well has not shrunk — that is the `flex: none` failure mode.

- [ ] **Step 8: Commit**

```bash
git add src/design-system/MediaWell src/design-system/index.ts src/entry-design.tsx src/components/ProjectDetail
git commit -m "Extract MediaWell from the project detail hero"
```

---

### Task 11: SectionHeading

**Files:**
- Create: `src/design-system/SectionHeading/SectionHeading.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/WorkScreen/WorkScreen.tsx`, `WorkScreen.module.css:6-33` (`.header`, `.headerRow`, `.heading`, `.search`, `.meta`)
- Modify: `src/components/CareerScreen/CareerScreen.tsx`, `CareerScreen.module.css:6-27` (`.header`, `.heading`, `.meta`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function SectionHeading(props: SectionHeadingProps)`, `export interface SectionHeadingProps { title: string; meta?: ReactNode; trailing?: ReactNode; level?: 'h1' | 'h2' | 'h3'; className?: string }`.

- [ ] **Step 1: Note what `trailing` has to hold**

Work puts a search `Icon` beside its heading; Career puts an outline `Button` beside its own. The two are different sizes and align differently, so `trailing` is a slot the component positions but does not style. Career's header is also a flex row with the button pushed right — check whether that alignment belongs on the component or stays with the screen.

- [ ] **Step 2: Write the component**

Create `src/design-system/SectionHeading/SectionHeading.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

export interface SectionHeadingProps {
  title: string
  /** The mono line beneath — "7 projects · 2019 to 2026". */
  meta?: ReactNode
  /** Sits beside the title: Work's search icon, Career's Résumé button. */
  trailing?: ReactNode
  /** Screens use h2; the detail screen's title is the page h1. */
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

/**
 * A screen's title, its meta line, and whatever sits beside it.
 *
 * The trailing slot is positioned but not styled — Work's icon and Career's
 * button size themselves.
 */
export function SectionHeading({
  title,
  meta,
  trailing,
  level = 'h2',
  className = '',
}: SectionHeadingProps) {
  const Title = level

  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      <div className={styles.row}>
        <Title className={styles.title}>{title}</Title>
        {trailing}
      </div>
      {meta && <p className={styles.meta}>{meta}</p>}
    </div>
  )
}
```

`const Title = level` then `<Title>` is how a dynamic tag name works in JSX — the capital is required, or JSX emits a literal `<level>` element.

Create `src/design-system/SectionHeading/index.ts`:

```ts
export * from './SectionHeading'
```

- [ ] **Step 3: Move the CSS**

`SectionHeading.module.css` takes `.header`, `.row` (from Work's `.headerRow`), `.title` (from `.heading`) and `.meta`. Use Work's rules as the base since it has both the row and the trailing element; fold in Career's only where they agree.

Where Work and Career differ — spacing above, the meta line's color — the difference stays in the screen module and rides in on `className`. `WorkScreen.module.css` keeps `.search` (it styles the icon, which is passed in as `trailing`).

- [ ] **Step 4: Update Work's call site**

`WorkScreen.tsx` — replace the `<div className={styles.header}>` block with:

```tsx
<SectionHeading
  className={styles.header}
  title="Selected work"
  meta={`${projects.length} projects · ${span}`}
  trailing={<Icon name="search" size={21} className={styles.search} />}
/>
```

- [ ] **Step 5: Update Career's call site**

`CareerScreen.tsx` — replace the `<div className={styles.header}>` block (heading, meta and the Résumé button) with:

```tsx
<SectionHeading
  className={styles.header}
  title="Career"
  meta="2015 to now · Frontend"
  trailing={
    <Button
      as="a"
      href={profile.resume}
      variant="outline"
      size="sm"
      download
      aria-label="Download resume (PDF)"
    >
      Resume
      <Icon name="download" size={13} />
    </Button>
  }
/>
```

Note the button label is `Resume` with no accents — commit `861e546` deliberately dropped them. Do not "restore" them.

Add `SectionHeading` to both files' `../../design-system` imports.

- [ ] **Step 6: Barrel and card**

`src/design-system/index.ts`: `export * from './SectionHeading'`

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'section-heading',
  name: 'SectionHeading',
  group: 'Components',
  subtitle: 'Title, meta line, and a trailing slot',
  viewport: { width: 760, height: 420 },
  render: () => (
    <div className="dsc-col">
      <SectionHeading title="Selected work" meta="7 projects · 2019 to 2026" />
      <SectionHeading
        title="Career"
        meta="2015 to now · Frontend"
        trailing={
          <Button as="a" href="#" variant="outline" size="sm">
            Resume
            <Icon name="download" size={13} />
          </Button>
        }
      />
      <SectionHeading title="Stack" />
    </div>
  ),
},
```

- [ ] **Step 7: Write the story**

Create `src/design-system/SectionHeading/SectionHeading.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeading } from './SectionHeading'
import { Button } from '../Button'
import { Icon } from '../Icon'

const meta = {
  title: 'Design System/SectionHeading',
  component: SectionHeading,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionHeading>

export default meta
type Story = StoryObj<typeof meta>

/** Work's heading, with its search icon. */
export const WithIcon: Story = {
  args: {
    title: 'Selected work',
    meta: '7 projects · 2019 to 2026',
    trailing: <Icon name="search" size={21} />,
  },
}

/** Career's heading, with the Résumé download beside it. */
export const WithButton: Story = {
  args: {
    title: 'Career',
    meta: '2015 to now · Frontend',
    trailing: (
      <Button as="a" href="#" variant="outline" size="sm">
        Resume
        <Icon name="download" size={13} />
      </Button>
    ),
  },
}

/** Title alone. */
export const TitleOnly: Story = { args: { title: 'Stack' } }
```

- [ ] **Step 8: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass.

- [ ] **Step 9: Visual check — mandatory, and the riskiest in this phase**

Work's heading pairs with the filter chips through `.topRow`, which is `display: contents` on mobile and a flex row from 768 up (see `WorkScreen.tsx`'s comment). Confirm at 390px **and** 1280px that:

- Work: heading, search icon and meta line unchanged; from 768 up, the filter chips still sit beside the heading rather than below it;
- Career: heading, meta line and Resume button unchanged, button still right-aligned.

If Work's chips drop below the heading at 1280px, the `display: contents` chain broke — `SectionHeading`'s wrapper div became a layout box where the old markup had none.

- [ ] **Step 10: Commit**

```bash
git add src/design-system/SectionHeading src/design-system/index.ts src/entry-design.tsx src/components/WorkScreen src/components/CareerScreen
git commit -m "Extract SectionHeading from Work and Career"
```

---

### Task 12: Portrait

**Files:**
- Create: `src/design-system/Portrait/Portrait.tsx`, `.module.css`, `index.ts`, `.stories.tsx`
- Modify: `src/components/AboutScreen/AboutScreen.tsx`, `AboutScreen.module.css:13-20` (`.portrait`)
- Modify: `src/design-system/index.ts`, `src/entry-design.tsx`

**Interfaces:**
- Produces: `export function Portrait(props: PortraitProps)`, `export interface PortraitProps { src: string; srcSet?: string; alt: string; width: number; height: number; className?: string }`.

`.portraitRow` at `AboutScreen.module.css:6-12` is the *layout* that places the portrait beside the identity block. It stays in `AboutScreen.module.css`.

- [ ] **Step 1: Write the component**

Create `src/design-system/Portrait/Portrait.tsx`:

```tsx
import styles from './Portrait.module.css'

export interface PortraitProps {
  src: string
  srcSet?: string
  alt: string
  /** Intrinsic dimensions. Required: without them the image reflows on load. */
  width: number
  height: number
  className?: string
}

/**
 * A photograph at fixed intrinsic dimensions.
 *
 * `width` and `height` are required rather than optional — the page ships no
 * JavaScript, so nothing can correct a layout shift after the fact.
 */
export function Portrait({ src, srcSet, alt, width, height, className = '' }: PortraitProps) {
  return (
    <img
      className={[styles.portrait, className].filter(Boolean).join(' ')}
      src={src}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
    />
  )
}
```

Create `src/design-system/Portrait/index.ts`:

```ts
export * from './Portrait'
```

- [ ] **Step 2: Move the CSS**

Move `AboutScreen.module.css:13-20` verbatim into `Portrait.module.css` as `.portrait`. Leave `.portraitRow` untouched in `AboutScreen.module.css`.

- [ ] **Step 3: Update the call site**

`AboutScreen.tsx` — replace the `<img className={styles.portrait} …>` with:

```tsx
<Portrait
  src={profile.portrait.src}
  srcSet={profile.portrait.srcSet}
  alt={profile.portrait.alt}
  width={104}
  height={130}
/>
```

Add `Portrait` to the `../../design-system` import. Keep the surrounding `<div className={styles.portraitRow}>`.

- [ ] **Step 4: Barrel and card**

`src/design-system/index.ts`: `export * from './Portrait'`

**Task 1 flagged this as a `thin` card candidate.** Show three sizes rather than one image. The real portrait is `public/jon-leibham.jpg`, referenced as `/jon-leibham.jpg` in `src/data/profile.ts:28`.

`src/entry-design.tsx` — add to `cards`:

```tsx
{
  slug: 'portrait',
  name: 'Portrait',
  group: 'Components',
  subtitle: 'Fixed intrinsic dimensions, three sizes',
  viewport: { width: 640, height: 320 },
  render: () => (
    <div className="dsc-row">
      <Portrait src={PORTRAIT_SRC} alt="" width={64} height={80} />
      <Portrait src={PORTRAIT_SRC} alt="" width={104} height={130} />
      <Portrait src={PORTRAIT_SRC} alt="" width={144} height={180} />
    </div>
  ),
},
```

Define near the top of `entry-design.tsx`:

```tsx
const PORTRAIT_SRC = '/jon-leibham.jpg'
```

**The exported card is a standalone file with no server**, so that root-relative path will not resolve inside the Design System pane. Either read `public/jon-leibham.jpg` in `scripts/build-design-bundle.mjs` and rewrite the `src` to a base64 `data:` URI, or accept a broken image in this one card. Decide at Step 6 by looking at the rendered card, and record the choice in the commit message.

- [ ] **Step 5: Write the story**

Create `src/design-system/Portrait/Portrait.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Portrait } from './Portrait'
import { profile } from '../../data/profile'

const meta = {
  title: 'Design System/Portrait',
  component: Portrait,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Portrait>

export default meta
type Story = StoryObj<typeof meta>

/** About's portrait at its real dimensions. */
export const Default: Story = {
  args: {
    src: profile.portrait.src,
    srcSet: profile.portrait.srcSet,
    alt: profile.portrait.alt,
    width: 104,
    height: 130,
  },
}

/** Larger, to confirm the treatment scales. */
export const Large: Story = {
  args: {
    src: profile.portrait.src,
    srcSet: profile.portrait.srcSet,
    alt: profile.portrait.alt,
    width: 208,
    height: 260,
  },
}
```

A story importing from `src/data/` is fine — the constraint is on components, and Storybook serves `public/` so the image resolves there.

- [ ] **Step 6: Full verification and card check**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev && npm run build:design`
Expected: all pass. Then open `design-bundle/portrait.html` in the browser and decide the `PORTRAIT_SRC` question from Step 4.

- [ ] **Step 7: Visual check — mandatory**

About at 390px and 1280px: the portrait sits beside the identity block at the same size, with no layout shift on load.

- [ ] **Step 8: Commit**

```bash
git add src/design-system/Portrait src/design-system/index.ts src/entry-design.tsx src/components/AboutScreen
git commit -m "Extract Portrait from the About screen"
```

---

# Phase 3 — Storybook and its deploy

### Task 13: Stories for Tabs, and drop Chromatic

**Files:**
- Create: `src/design-system/Tabs/Tabs.stories.tsx`
- Modify: `.storybook/main.ts`, `package.json`

**Interfaces:**
- Consumes: `Tabs`, `TabsProps` from `src/design-system/Tabs`.

- [ ] **Step 1: Write the Tabs stories**

Create `src/design-system/Tabs/Tabs.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'

const meta = {
  title: 'Design System/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['chips', 'underline'] },
    align: { control: 'inline-radio', options: ['left', 'center'] },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Work's category filter. Selection is a native radio group — the consuming
 * stylesheet reveals rows with `:has(input[value='…']:checked)`, so clicking a
 * chip here changes the checked input but nothing else: there is no consumer
 * in this story to react to it.
 */
export const Chips: Story = {
  args: {
    name: 'sb-filters',
    items: ['All', 'Web', 'AI', 'Utilities'],
    active: 'All',
    label: 'Filter work by category',
    variant: 'chips',
  },
}

/** About's stack selector. */
export const Underline: Story = {
  args: {
    name: 'sb-stack',
    items: ['Frontend', 'Backend', 'Tooling'],
    active: 'Frontend',
    label: 'Choose a part of the stack',
    variant: 'underline',
  },
}

/** `name` must be unique per page — two groups sharing it share a selection. */
export const Centered: Story = {
  args: {
    name: 'sb-centered',
    items: ['One', 'Two', 'Three'],
    active: 'Two',
    label: 'Centered example',
    variant: 'underline',
    align: 'center',
  },
}
```

- [ ] **Step 2: Remove the Chromatic addon**

In `.storybook/main.ts`, delete the `"@chromatic-com/storybook"` entry from `addons`.

- [ ] **Step 3: Uninstall the package**

Run: `npm uninstall @chromatic-com/storybook`

- [ ] **Step 4: Verify Storybook still builds**

Run: `npm run build-storybook`
Expected: completes and writes `storybook-static/`. A missing-addon error means Step 2 and Step 3 disagree.

- [ ] **Step 5: Full verification**

Run: `npm run build && npm run test && npm run lint && npm run typecheck:dev`
Expected: all pass. `npm run test` now runs the storybook browser project across every story including the eight new ones — this is the first time they all run together.

- [ ] **Step 6: Commit**

```bash
git add src/design-system/Tabs/Tabs.stories.tsx .storybook/main.ts package.json package-lock.json
git commit -m "Add Tabs stories and drop the Chromatic addon"
```

---

### Task 14: The Storybook Amplify build spec

**Files:**
- Create: `amplify.storybook.yml`

**Interfaces:** none — consumed by AWS, not by code.

- [ ] **Step 1: Write the build spec**

Create `amplify.storybook.yml`. **This is deliberately not a copy of `amplify.yml`** — two things in that file are actively wrong here:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 2>/dev/null || nvm install
        - node -v && npm -v
        # No --omit=dev here, unlike amplify.yml. Storybook, Vite's plugin and
        # the whole build toolchain live in devDependencies; omitting them
        # leaves nothing to build with.
        #
        # PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD still applies: the Chromium binaries
        # are only needed by the browser-mode Vitest project, which does not
        # run on Amplify.
        - PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-audit --no-fund --prefer-offline
    build:
      commands:
        - npm run build-storybook
  artifacts:
    baseDirectory: storybook-static
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        # SAMEORIGIN, not DENY. Storybook renders every story inside a
        # same-origin iframe; DENY blocks its own preview pane and the whole
        # canvas comes up blank.
        - key: X-Frame-Options
          value: SAMEORIGIN
        - key: X-Content-Type-Options
          value: nosniff
        - key: Referrer-Policy
          value: strict-origin-when-cross-origin
        - key: Strict-Transport-Security
          value: 'max-age=63072000; includeSubDomains; preload'
        # Far looser than the portfolio's. Storybook is a JavaScript
        # application: it needs its own scripts, inline styles, blob workers
        # and same-origin framing. The zero-JS CSP is a property of the
        # portfolio, not of this repository.
        - key: Content-Security-Policy
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'"
        - key: Permissions-Policy
          value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()'
```

- [ ] **Step 2: Build Storybook for real**

Run: `npm run build-storybook`
Expected: `storybook-static/` written.

- [ ] **Step 3: Verify the CSP against the real build — do not guess**

Serve the built output and load it with the headers above applied. The simplest honest check:

```bash
npx http-server storybook-static -p 6007 -c-1 --cors
```

Open `http://localhost:6007` with `preview_start {url: "http://localhost:6007"}`, then `read_console_messages {onlyErrors: true}`.

Expected: the sidebar lists every story and a story renders in the canvas, with no CSP violations in the console.

`http-server` does not apply Amplify's headers, so this proves the *build* works. To prove the *headers* work, additionally check that nothing in `storybook-static/` needs a directive the policy above omits:

```bash
grep -ro "worker-src\|new Worker\|eval(" storybook-static --include=*.js | head
```

If Storybook needs a directive not listed, widen the policy and record why in the commit message. **Do not delete the CSP header to make a problem go away** — narrow it to what the build actually needs.

- [ ] **Step 4: Commit**

```bash
git add amplify.storybook.yml
git commit -m "Add a Storybook build spec with headers that do not break it"
```

- [ ] **Step 5: Hand the console work to the user**

Report that the build spec is committed and tell the user what only they can do:

1. Create a second Amplify app pointed at this repository.
2. Set its build spec to `amplify.storybook.yml`.
3. Attach a subdomain (e.g. `ds.jonleibham.com`).

Nothing happens until an app is pointed at the file. App creation cannot be automated from here.

---

# Phase 4 — Ship the full set

### Task 15: Upload all cards

**Files:** none locally.

**Interfaces:**
- Consumes: `projectId` from Task 1; `design-bundle/*.html` — now thirteen cards.

- [ ] **Step 1: Regenerate**

Run: `npm run build:design`
Expected: `design-bundle: 13 card(s) written` — Colors, Button, Tag, Tabs, Icon, plus the eight extracted. `assertStyled` must not throw.

- [ ] **Step 2: Check every card in the browser before uploading**

Open each of the eight new cards from `design-bundle/` in the browser tool and screenshot. Confirm each is legible on the dark ground and that variants within a card look different from each other.

This catches the `thin` and `variantsIdentical` conditions locally rather than after publishing.

- [ ] **Step 3: Show the user the plan and get an explicit yes**

List all thirteen paths, the `projectId`, and the local directory. This publishes to claude.ai. Wait for a yes.

- [ ] **Step 4: Finalize and write**

`DesignSync` `finalize_plan` with `writes: ["styles.css", "cards/*.html"]` and `localDir` set to the absolute path of `design-bundle`, then `write_files` with one `localPath` entry per file — the thirteen cards **and** `styles.css`, which will have changed as the eight new components added their rules.

- [ ] **Step 5: Confirm and hand back the render gate**

`list_files` to confirm thirteen paths, then ask the user to check the pane once more — this time for the eight new cards.

If Task 1 established that `report_validate` is required, call it now with the counts from the final check.

- [ ] **Step 6: Open the pull request**

```bash
git push -u origin design-system/export-and-storybook
gh pr create --title "Finish the design system and add its export paths" --body "$(cat <<'EOF'
## Summary
- Extract eight components into `src/design-system/`: LabeledNote, AvailabilityPill, Wordmark, MetricStrip, FactList, MediaWell, SectionHeading, Portrait
- Add a Claude Design export: `src/entry-design.tsx` declares the cards, `scripts/build-design-bundle.mjs` renders each to standalone HTML
- Add Storybook stories for every design-system component, drop the Chromatic addon, and add `amplify.storybook.yml`

## Notes
Extracted components own their internal shape only — every call site keeps its
own positioning wrapper, because the availability pill and wordmark render at
different breakpoints on Home and on the rail.

`IndexRow`, the Career timeline and the utilities collapse are deliberately not
extracted: they are welded to CSS counters, `:has()` filter rules and
`data-cat`, which `projects.test.ts` and `stack.test.ts` guard.

## Test plan
- [ ] `npm run build` — prerender assertions pass
- [ ] `npm run test` — unit and storybook projects
- [ ] `npm run lint` and `npm run typecheck:dev`
- [ ] Every screen checked at 390px and 1280px
- [ ] Thirteen cards render in the Claude Design pane

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Deliberately not in this plan

- **`IndexRow`, the Career timeline rail, the utilities collapse.** Welded to CSS counters, `:has()` filter rules and `data-cat` attributes that `src/data/projects.test.ts` and `src/data/stack.test.ts` guard.
- **The npm-workspaces monorepo.** Its own future spec, per `CLAUDE.md`.
- **Visual-regression testing.** Rejected along with Chromatic.
- **Linking the deployed Storybook from the portfolio.** A one-line edit to `src/data/projects.ts` once a URL exists.
- **Creating the Amplify app or the Claude Design account.** Console work, owned by the user.
