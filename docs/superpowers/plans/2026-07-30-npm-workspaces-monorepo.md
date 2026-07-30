# npm-workspaces Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the repo into `apps/portfolio` and `packages/design-system` under npm workspaces, so Storybook deploys from its own Amplify `appRoot`.

**Architecture:** One root `package.json` with `workspaces: ["apps/*", "packages/*"]` and a single lockfile. The design-system package is consumed **source-first** — `main` points at `src/index.ts`, so the portfolio's Vite compiles its TSX and CSS Modules directly and no build step sits in the dependency chain. The package keeps a separate Vite library build used only to emit a standalone stylesheet for the Claude Design export.

**Tech Stack:** npm workspaces, React 19 (build-time only), TypeScript, Vite 8, CSS Modules, Storybook 10, Vitest 4, AWS Amplify.

**Spec:** `docs/superpowers/specs/2026-07-30-npm-workspaces-monorepo-design.md`

## Global Constraints

- **This is a move, not a redesign.** The rendered portfolio must not change. The strongest single check is diffing prerendered `dist/index.html` before and after — it should differ only in asset hashes.
- **Use `git mv`, never delete-and-recreate.** History on these files is worth keeping and the diff is unreadable otherwise.
- **The portfolio still prerenders to zero JS.** `scripts/prerender.mjs` moves with the app; its assertions are unchanged.
- **Design-system components stay hook-free and handler-free.** No `useState`, `useEffect`, `onClick`. This was previously enforced indirectly by the prerender assertions, which after the split only cover the app — Task 8 adds a real guard.
- **No inline `style` attributes in app or package `src`.** `.stories.tsx` are exempt.
- **No id selectors in any `.module.css`.**
- **CSS Modules scoped-name pinning must match across every Vite config** that renders or styles the same markup. `generateScopedName: '[name]_[local]_[hash:base64:5]'` is currently in `vite.config.ts`; every config that replaces it needs the identical value or markup and stylesheet stop agreeing.
- **Node 24.12.0** stays pinned via Volta at the root.
- Commit after every task. Branch: `monorepo/workspaces`.

---

## File Structure

**Root after the move:**

| Path | Responsibility |
| --- | --- |
| `package.json` | Private, `workspaces`, thin delegating scripts, shared lint devDeps, Volta pin |
| `package-lock.json` | Single lockfile — the only one in the repo |
| `amplify.yml` | `applications:` with two `appRoot` entries |
| `eslint.config.js` | Lints both workspaces; `globalIgnores` already covers build output and `.claude` |
| `apps/portfolio/` | `index.html`, `public/`, `src/`, `scripts/prerender.mjs`, vite/vitest/tsconfigs |
| `packages/design-system/` | `src/`, `.storybook/`, `scripts/`, vite/vitest/tsconfigs |

**Deleted:** `amplify.storybook.yml` (dead config — Amplify never reads it; contents move into `amplify.yml`'s second `appRoot`).

---

# Phase 0 — Prove the deploy before moving anything

### Task 1: Verify Amplify can build an npm workspace from an appRoot

**This is first because it is the only thing that can invalidate the whole plan.** npm workspaces install at the repository root; Amplify runs monorepo builds from the `appRoot`. If its install step cannot cope, the restructure lands and still does not deploy.

**Files:**
- Create (throwaway branch `spike/amplify-workspaces`, never merged): `package.json`, `apps/hello/package.json`, `apps/hello/index.html`, `amplify.yml`

**Interfaces:**
- Produces: a yes/no on whether `appRoot` + root lockfile works, and if not, a proven `preBuild` workaround that Task 9 uses verbatim.

- [ ] **Step 1: Create the spike branch**

```bash
git checkout main && git pull
git checkout -b spike/amplify-workspaces
```

- [ ] **Step 2: Write a minimal two-workspace skeleton**

Root `package.json`:

```json
{
  "name": "spike-root",
  "private": true,
  "workspaces": ["apps/*"],
  "volta": { "node": "24.12.0" }
}
```

`apps/hello/package.json`:

```json
{
  "name": "@spike/hello",
  "private": true,
  "scripts": { "build": "mkdir -p dist && cp index.html dist/index.html" }
}
```

`apps/hello/index.html`:

```html
<!DOCTYPE html><html><body><h1>workspace ok</h1></body></html>
```

Root `amplify.yml`:

```yaml
version: 1
applications:
  - appRoot: apps/hello
    frontend:
      phases:
        preBuild:
          commands:
            - node -v && npm -v
            - pwd && ls -la
            # The question this spike exists to answer: does an install issued
            # from the appRoot resolve a workspace lockfile that lives two
            # directories up?
            - npm install --no-audit --no-fund
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
```

- [ ] **Step 3: Push the spike**

```bash
git add -A && git commit -m "Spike: verify Amplify appRoot with npm workspaces"
git push -u origin spike/amplify-workspaces
```

- [ ] **Step 4: Hand to the user — BLOCKING**

Ask the user to:
1. create a throwaway Amplify app pointed at this repo, branch `spike/amplify-workspaces`;
2. in the console, mark it a **monorepo** and set app root to `apps/hello`;
3. report whether the build succeeds, and paste the build log's preBuild output if it fails.

**Do not proceed to Phase 1 until this comes back.** Nothing available here can run an Amplify build.

- [ ] **Step 5: Record the outcome**

If it succeeded: note that plain `npm install` from the `appRoot` is sufficient, and Task 9 uses it as-is.

If it failed: the likely cause is npm refusing to install a workspace from a subdirectory. The fallback to test in a second push is a `preBuild` that installs at the root first:

```yaml
        preBuild:
          commands:
            - cd ../.. && npm ci --no-audit --no-fund
```

Amplify runs subsequent `build` commands from the `appRoot`, so only the install needs relocating. Prove whichever form works on the spike before writing it into the real `amplify.yml`.

- [ ] **Step 6: Clean up**

Once answered, ask the user to delete the throwaway Amplify app. Delete the branch:

```bash
git push origin --delete spike/amplify-workspaces
git checkout main && git branch -D spike/amplify-workspaces
```

Record the answer in the plan's Status section. **The spike branch is never merged.**

---

# Phase 1 — The structural move

### Task 2: Move everything into place and get it building again

One task because a half-moved repo does not build, and a step that cannot be verified is not a checkpoint. Large, but atomic.

**Files:**
- Create: `package.json` (new root), `apps/portfolio/package.json`, `packages/design-system/package.json`, `packages/design-system/vite.config.ts`, `packages/design-system/tsconfig.json`
- Move: essentially everything
- Modify: import specifiers in the five screens

**Interfaces:**
- Produces: `@jonleibham/portfolio` and `@jonleibham/design-system` workspace packages. Every later task depends on these names.

- [ ] **Step 1: Branch, and capture the before-state**

```bash
git checkout main && git pull
git checkout -b monorepo/workspaces
npm run build
cp dist/index.html /tmp/portfolio-before.html
```

`/tmp/portfolio-before.html` is the reference for the final diff. **Do not skip this** — it cannot be recreated after the move.

- [ ] **Step 2: Move the app files**

```bash
mkdir -p apps/portfolio packages/design-system
git mv index.html public src scripts vite.config.ts vitest.config.ts \
       vitest.shims.d.ts tsconfig.json tsconfig.app.json tsconfig.node.json \
       tsconfig.dev.json apps/portfolio/
```

- [ ] **Step 3: Move the design system out of the app**

```bash
git mv apps/portfolio/src/design-system packages/design-system/src
git mv .storybook packages/design-system/.storybook
git mv apps/portfolio/src/entry-design.tsx apps/portfolio/src/designCardChrome.tsx \
       packages/design-system/src/
mkdir -p packages/design-system/scripts
git mv apps/portfolio/scripts/build-design-bundle.mjs \
       apps/portfolio/scripts/measure-design-cards.mjs \
       apps/portfolio/scripts/design-card.css \
       packages/design-system/scripts/
git mv apps/portfolio/src/entry-design.test.ts packages/design-system/src/
```

`apps/portfolio/scripts/` should now hold only `prerender.mjs`.

`.gitignore` needs no change: its entries (`dist`, `dist-ssr`, `dist-design`, `design-bundle`, `storybook-static`, `node_modules`) have no leading slash, so they already match at any depth. Confirm with `git status` after the first build that no build output is staged.

- [ ] **Step 4: Rewrite the root package.json**

`package.json` and `package-lock.json` deliberately stayed at the root in Step 2 — the lockfile must remain there, and the root manifest becomes the workspace root. Replace its contents entirely:

```json
{
  "name": "jonleibham",
  "private": true,
  "type": "module",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev -w @jonleibham/portfolio",
    "build": "npm run build -w @jonleibham/portfolio",
    "preview": "npm run preview -w @jonleibham/portfolio",
    "storybook": "npm run storybook -w @jonleibham/design-system",
    "build-storybook": "npm run build-storybook -w @jonleibham/design-system",
    "build:design": "npm run build:design -w @jonleibham/design-system",
    "test": "npm run test --workspaces --if-present",
    "typecheck:dev": "npm run typecheck:dev --workspaces --if-present",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.7.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "eslint-plugin-storybook": "^10.5.3",
    "globals": "^17.5.0",
    "typescript-eslint": "^8.65.0"
  },
  "overrides": {
    "esbuild": "^0.28.1"
  },
  "volta": {
    "node": "24.12.0"
  }
}
```

Lint tooling stays at the root because `eslint.config.js` does. `overrides` must be at the root — npm only honours it there.

- [ ] **Step 5: Write apps/portfolio/package.json**

```json
{
  "name": "@jonleibham/portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck:dev": "tsc -p tsconfig.dev.json --noEmit"
  },
  "dependencies": {
    "@jonleibham/design-system": "*",
    "@types/node": "^26.1.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "typescript": "~6.0.3",
    "vite": "^8.1.5"
  },
  "devDependencies": {
    "vitest": "^4.1.10"
  }
}
```

`"@jonleibham/design-system": "*"` resolves to the workspace. The build-time deps stay in `dependencies`, not `devDependencies` — the Amplify portfolio build runs `--omit=dev` and needs `tsc` and `vite`.

- [ ] **Step 6: Write packages/design-system/package.json**

```json
{
  "name": "@jonleibham/design-system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./tokens.css": "./src/tokens.css"
  },
  "scripts": {
    "build": "vite build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "build:design": "npm run build && node scripts/build-design-bundle.mjs",
    "measure:design": "node scripts/measure-design-cards.mjs",
    "test": "vitest run",
    "typecheck:dev": "tsc -p tsconfig.dev.json --noEmit"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@chromatic-com/storybook": "^5.1.2",
    "@storybook/addon-a11y": "^10.5.3",
    "@storybook/addon-docs": "^10.5.3",
    "@storybook/addon-vitest": "^10.5.3",
    "@storybook/react-vite": "^10.5.3",
    "@vitejs/plugin-react": "^6.0.4",
    "@vitest/browser-playwright": "^4.1.10",
    "@vitest/coverage-v8": "^4.1.10",
    "playwright": "^1.59.1",
    "storybook": "^10.5.3",
    "vite": "^8.1.5",
    "vitest": "^4.1.10"
  }
}
```

**`main` points at `src/index.ts` deliberately.** The package is consumed source-first: the portfolio's Vite compiles its TSX and CSS Modules, so no build step sits in the dependency chain and the pinned scoped-name applies uniformly.

`@chromatic-com/storybook` was removed from `.storybook/main.ts` earlier but may still be in the lockfile — if `npm ls` shows it unused, drop it from this list.

- [ ] **Step 7: Rewrite the screens' imports**

```bash
cd apps/portfolio
grep -rl "\.\./\.\./design-system" src/components | xargs \
  sed -i '' "s|from '\.\./\.\./design-system'|from '@jonleibham/design-system'|g"
grep -rn "design-system" src/ | grep -v "@jonleibham"
```

The second command must print nothing. Six files import it today: the five screens plus `TabBar`.

- [ ] **Step 8: Give the package a Vite config**

Create `packages/design-system/vite.config.ts`. This build exists **only** to emit a standalone stylesheet for the Claude Design export — the portfolio never consumes its output:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The portfolio compiles this package from source, so this build is not in the
// dependency chain. It exists to emit one standalone stylesheet (and the SSR
// entry) for the Claude Design bundle.
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // MUST match apps/portfolio/vite.config.ts. The design bundle renders
      // markup in one pass and reads the stylesheet from another; a different
      // scoped name here means they stop agreeing and every card ships
      // unstyled.
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
  build: {
    // One stylesheet rather than one per entry — the bundle script links a
    // single styles.css from every card.
    cssCodeSplit: false,
    lib: {
      entry: 'src/entry-design.tsx',
      formats: ['es'],
      fileName: 'entry-design',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    },
  },
})
```

- [ ] **Step 9: Give the package its tsconfigs**

Create `packages/design-system/tsconfig.json` by copying `apps/portfolio/tsconfig.app.json`'s `compilerOptions` verbatim, with `"include": ["src"]` and the same stories/tests `exclude`. Create `packages/design-system/tsconfig.dev.json` mirroring the app's, extending `./tsconfig.json`.

Point `apps/portfolio/tsconfig.node.json`'s `include` at its own `vite.config.ts` (unchanged path, now relative to the app).

- [ ] **Step 10: Install and build**

```bash
cd ../..            # repo root
rm -rf node_modules
npm install
npm run build
```

Expected: one `node_modules` at the root, one `package-lock.json`, and the portfolio build succeeding with the prerender assertions passing.

If Vite cannot resolve `@jonleibham/design-system`, check that `main` in the package points at `src/index.ts` and that the root install actually symlinked it: `ls -la node_modules/@jonleibham/`.

- [ ] **Step 11: The move check — this is the point of the task**

```bash
diff <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' /tmp/portfolio-before.html) \
     <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' apps/portfolio/dist/index.html)
```

Expected: **no output.** With asset hashes normalised the two documents should be identical. Any difference is a behavioural change that this task was not supposed to make — investigate before continuing rather than accepting it.

- [ ] **Step 12: Run everything**

```bash
npm run test && npm run lint && npm run typecheck:dev
```

Expected: all pass. Test count should match the pre-move total (83 at the time of writing).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Move the portfolio and design system into npm workspaces"
```

---

# Phase 2 — Make the package genuinely standalone

### Task 3: Split index.css into tokens and app globals

**Files:**
- Create: `packages/design-system/src/tokens.css`
- Modify: `apps/portfolio/src/index.css`, `packages/design-system/.storybook/preview.ts`

**Interfaces:**
- Produces: `@jonleibham/design-system/tokens.css`, imported by the portfolio and by Storybook.

- [ ] **Step 1: Read the file and decide the boundary**

`apps/portfolio/src/index.css` is 236 lines. Its structure today:

| Lines | Content |
| --- | --- |
| 1–5 | `box-sizing` reset |
| 7–85 | `:root` — palette, roles, geometry, type, motion, plus applied `font-family`/`color`/`background-color`/`color-scheme` |
| 87–93 | `@media (max-width: 359px)` retuning `--gutter`, `--hero-size` |
| 95–133 | `@media` 768 / 1024 / 1280 retuning `--rail-width`, `--pane-pad-*`, `--col-cap`, `--hero-size` |
| 134+ | globals: `body`, headings, `p`, `a`, `img`, `button`, focus, `::selection`, `.mono`, `.sr-only`, `.skip-link`, reduced motion |

**The judgement call the spec flagged.** `--rail-width` and `--pane-pad-*` describe the portfolio's shell, not the design system. Splitting them out is defensible; so is keeping the token block whole to avoid drift. Decide with both files open, and **record the decision and its reasoning in the commit message.** Either outcome is fine; splitting silently is not.

Default if undecided: keep the whole `:root` block and all its media-query retunings together in `tokens.css`. A design system that owns its breakpoints is more coherent than one whose consumers each redefine them.

- [ ] **Step 2: Create tokens.css**

`git mv` is not usable for a partial file. Create `packages/design-system/src/tokens.css` and move lines 1–133 into it verbatim — **copy the values, do not retype them.** Keep every comment; they explain non-obvious choices like why 768 is the rail breakpoint.

- [ ] **Step 3: Trim index.css**

`apps/portfolio/src/index.css` keeps lines 134+ and gains one line at the top:

```css
@import '@jonleibham/design-system/tokens.css';
```

The `exports` map in the package's `package.json` already declares that subpath.

- [ ] **Step 4: Repoint Storybook's preview**

In `packages/design-system/.storybook/preview.ts`, change `import '../src/index.css'` to:

```ts
import '../src/tokens.css'
```

Storybook must not import the app's globals — the package has to render standalone, which is the point of this task.

- [ ] **Step 5: Verify**

```bash
npm run build && npm run test && npm run lint && npm run typecheck:dev
diff <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' /tmp/portfolio-before.html) \
     <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' apps/portfolio/dist/index.html)
```

Expected: all pass and the diff is still empty.

- [ ] **Step 6: Visual check — mandatory**

`npm run storybook`, and confirm components still render correctly on the dark ground with the right type. If the ground is now white or the mono font has fallen back, `tokens.css` is missing something that was in `index.css`.

Then `npm run dev` and check Home, Work, Career, About and one detail screen at 390 and 1280.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Split the design tokens out of the portfolio's global stylesheet"
```

---

### Task 4: Point the design bundle at the package's own stylesheet

**Files:**
- Modify: `packages/design-system/scripts/build-design-bundle.mjs`, `packages/design-system/scripts/measure-design-cards.mjs`

**Interfaces:**
- Consumes: the Vite lib build from Task 2 Step 8.
- Produces: `packages/design-system/design-bundle/` with the same shape as before — `styles.css` plus `cards/*.html`.

- [ ] **Step 1: Repoint the paths**

In `build-design-bundle.mjs`, `root` currently resolves to the repo root and reads `dist/assets/*.css` — the **portfolio's** stylesheet. Change it to resolve to the package root and read the package's own build output.

The Vite lib build with `cssCodeSplit: false` emits its CSS into `dist/`. Locate it the same way the script does today — first `.css` file in the output directory — and throw the same clear error if absent, with the message updated to say `npm run build -w @jonleibham/design-system`.

The SSR import changes from `dist-design/entry-design.js` to the lib build's `dist/entry-design.js`.

- [ ] **Step 2: Repoint the measure script**

`measure-design-cards.mjs` resolves `design-bundle/` relative to the repo root. Point it at the package root the same way.

- [ ] **Step 3: Build and verify**

```bash
npm run build:design -w @jonleibham/design-system
```

Expected: `design-bundle: 8 card(s) written`. Critically, **`assertStyled` must not throw** — and it is now a real check. Previously the app's stylesheet contained every component's CSS whether or not the bundle needed it; now the package's stylesheet has to be genuinely self-sufficient.

If it throws, the missing classes name exactly which component's CSS did not make the lib build.

- [ ] **Step 4: Measure**

```bash
npm run measure:design -w @jonleibham/design-system
```

Expected: all eight cards within ~10% waste, nothing flagged.

- [ ] **Step 5: Eyeball a card**

Open `packages/design-system/design-bundle/cards/button.html` in a browser. It must be styled and legible on the dark ground. If unstyled, `../styles.css` is not resolving or the lib build emitted no CSS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Build the design bundle from the package's own stylesheet"
```

---

### Task 5: Move the test projects into their workspaces

**Files:**
- Modify: `apps/portfolio/vitest.config.ts`
- Create: `packages/design-system/vitest.config.ts`
- Move: `apps/portfolio/vitest.shims.d.ts` → `packages/design-system/`
- Modify: `apps/portfolio/src/App.test.ts`

**Interfaces:**
- Produces: `npm run test` at the root running both workspaces' suites.

- [ ] **Step 1: Reduce the app's vitest config to the unit project**

`apps/portfolio/vitest.config.ts` keeps only the `unit` project — node environment, `include: ['src/**/*.test.ts']`. Drop the `storybook` project, the `storybookTest` plugin and the Playwright browser block; those follow the stories into the package. The `optimizeDeps.include` for the Testing Library stack goes with them.

- [ ] **Step 2: Create the package's vitest config**

`packages/design-system/vitest.config.ts` carries both projects: a `unit` project for `src/**/*.test.ts` (`tones.test.ts` and `entry-design.test.ts` now live here) and the `storybook` browser project, moved verbatim including:

```ts
      optimizeDeps: {
        include: ['@testing-library/jest-dom', '@testing-library/dom'],
      },
```

That block is load-bearing — without it the storybook project cannot import at all, and its story tests silently never run. `configDir` becomes `path.join(dirname, '.storybook')`, now relative to the package.

Move `vitest.shims.d.ts` to the package; it references the Playwright browser types, which only the package needs now.

- [ ] **Step 3: Repoint App.test.ts's module walk**

`apps/portfolio/src/App.test.ts` walks `srcDir` recursively for `*.module.css` and asserts no id selectors. After the move it only sees the app's modules — the package's are invisible to it.

Give the package the same guard rather than reaching across the boundary: create `packages/design-system/src/modules.test.ts` with the id-selector test, walking the package's own `src`. Copy the explanatory comment; the reason it exists is not obvious from the assertion.

- [ ] **Step 4: Verify both suites run**

```bash
npm run test
```

Expected: both workspaces run, and the **total test count matches the pre-move 83**. A lower number means a project silently stopped running — that is the failure mode this task is guarding against, so check the per-project counts rather than only the total.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Give each workspace its own test projects"
```

---

# Phase 3 — Deploy and guard

### Task 6: The root amplify.yml

**Files:**
- Modify: `amplify.yml`
- Delete: `amplify.storybook.yml`

**Interfaces:**
- Consumes: the install form proven in Task 1.

- [ ] **Step 1: Write the two-application spec**

Replace `amplify.yml` with an `applications:` list. The first entry is the existing portfolio spec, unchanged apart from living under `appRoot: apps/portfolio`. The second is the contents of `amplify.storybook.yml` under `appRoot: packages/design-system`.

**Use the install form Task 1 proved.** If the spike showed a plain `npm install` from the `appRoot` works, use it. If it required `cd ../.. && npm ci`, use that in both entries.

Keep every comment from both files. They record why `--omit=dev` is right for one and wrong for the other, and why the Storybook CSP is loose — that reasoning is the most valuable part of these files.

The portfolio entry keeps `baseDirectory: dist`; the Storybook entry uses `storybook-static`. Both are relative to their `appRoot`.

- [ ] **Step 2: Delete the dead file**

```bash
git rm amplify.storybook.yml
```

- [ ] **Step 3: Sanity-check the YAML**

```bash
node -e "
const t=require('fs').readFileSync('amplify.yml','utf8');
console.log('tabs:', /\t/.test(t));
console.log('appRoots:', (t.match(/appRoot:/g)||[]).length);
console.log('portfolio omit-dev:', /--omit=dev/.test(t));
console.log('storybook SAMEORIGIN:', /SAMEORIGIN/.test(t));
"
```

Expected: no tabs, two `appRoot`s, both flags present.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Give each workspace its own Amplify application"
```

---

### Task 7: Guard the package's hook-free constraint

The constraint that used to be enforced by the prerender assertions, which now only cover the app.

**Files:**
- Create: `packages/design-system/src/static.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

/** Every component source in the package — stories and tests excluded. */
function componentSources(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return componentSources(full)
    if (!/\.tsx?$/.test(entry)) return []
    if (/\.(stories|test)\.tsx?$/.test(entry)) return []
    return [full]
  })
}

/**
 * The portfolio prerenders to static HTML with no client bundle, and
 * `scripts/prerender.mjs` fails its build if a script tag or an inline handler
 * survives. That guard only covers the app — nothing stops this package from
 * growing a hook and breaking its only consumer at build time.
 *
 * Interactivity here is CSS: `Tabs` renders a hidden radio group and consumers
 * reveal content with `:has(input[value='…']:checked)`.
 */
describe('the package stays static', () => {
  const files = componentSources(srcDir)

  it.each(files.map((f) => [path.relative(srcDir, f), f]))(
    '%s uses no React hooks',
    (_name, file) => {
      const source = readFileSync(file, 'utf8')
      const hooks = ['useState', 'useEffect', 'useRef', 'useReducer', 'useCallback', 'useMemo']
      expect(hooks.filter((hook) => new RegExp(`\\b${hook}\\s*\\(`).test(source))).toEqual([])
    },
  )

  it.each(files.map((f) => [path.relative(srcDir, f), f]))(
    '%s attaches no event handlers',
    (_name, file) => {
      const source = readFileSync(file, 'utf8')
      expect(source.match(/\son[A-Z][a-zA-Z]+=\{/g) ?? []).toEqual([])
    },
  )

  it.each(files.map((f) => [path.relative(srcDir, f), f]))(
    '%s sets no inline style attribute',
    (_name, file) => {
      const source = readFileSync(file, 'utf8')
      expect(source.match(/\sstyle=\{/g) ?? []).toEqual([])
    },
  )
})
```

- [ ] **Step 2: Run it**

```bash
npm run test -w @jonleibham/design-system
```

Expected: **PASS** on the current sources — this codifies an invariant that already holds rather than fixing a break.

- [ ] **Step 3: Prove the test actually bites**

Temporarily add `const [x] = useState(0)` to `packages/design-system/src/Tag/Tag.tsx` and re-run. Expected: FAIL naming `Tag/Tag.tsx`. **Revert immediately.**

A guard nobody has seen fail is not a guard.

- [ ] **Step 4: Commit**

```bash
git add packages/design-system/src/static.test.ts
git commit -m "Guard the design system against hooks, handlers and inline styles"
```

---

### Task 8: Update the documentation

**Files:**
- Modify: `CLAUDE.md`, `README.md`, `.claude/commands/design-push.md`

- [ ] **Step 1: Rewrite CLAUDE.md's structural sections**

`CLAUDE.md` describes a single-package repo throughout and is the first thing any future session reads. Update:

- **Commands** — root scripts now delegate; add the `-w` forms.
- **Architecture / Component pattern** — `src/components/<Name>/` is now `apps/portfolio/src/components/<Name>/`; reusable primitives are `packages/design-system/src/<Name>/`.
- **Content** — `src/data/` is now `apps/portfolio/src/data/`.
- **Styling** — global tokens live in `packages/design-system/src/tokens.css`; the app's globals in `apps/portfolio/src/index.css`.
- **Static generation** — paths in the three-pass description.
- **Key Files** — every path.
- **Future Ideas** — the monorepo item is now partly done. Rewrite it to describe what remains: the finance, todo and job-search apps slotting into `apps/*`.

Add a short section on the workspace layout and on why the design system is consumed source-first.

- [ ] **Step 2: Update README.md**

Fix any paths and commands. Keep it short — `CLAUDE.md` is the detailed guide.

- [ ] **Step 3: Update the design-push command**

`.claude/commands/design-push.md` references `npm run build:design` and `design-bundle/` at the repo root. Both moved. Update the commands to the `-w @jonleibham/design-system` forms and the paths to `packages/design-system/design-bundle/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Update the docs for the workspace layout"
```

---

### Task 9: Final verification and the PR

- [ ] **Step 1: Verify from a genuinely clean checkout**

```bash
cd /tmp && rm -rf monorepo-check
git clone --branch monorepo/workspaces git@github.com:GRIM4CE/jonleibham.git monorepo-check
cd monorepo-check && npm install
npm run build && npm run test && npm run lint && npm run typecheck:dev
npm run build-storybook && npm run build:design
```

A clean clone is the only way to catch a stale `node_modules` or an untracked file the working tree was quietly relying on.

- [ ] **Step 2: The move check, one last time**

```bash
diff <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' /tmp/portfolio-before.html) \
     <(sed 's/-[A-Za-z0-9_-]\{8\}\.css/-HASH.css/g' apps/portfolio/dist/index.html)
```

Expected: empty. **If this is not empty, do not open the PR** — something changed that should not have. Find it first.

- [ ] **Step 3: Visual check at both breakpoints**

`npm run dev`, then Home, Work, Career, About and one project detail at 390 and 1280. Compare against the live site.

Pay attention to anything relying on CSS bundle order — the screens override component classes that way, and the package boundary is new. Specifically: Home's "Now" line, Career's label-less "Why" inside the education card, and exactly one availability pill visible at each width.

- [ ] **Step 4: Confirm the lockfile is singular**

```bash
find . -name package-lock.json -not -path "./node_modules/*"
```

Expected: exactly one, at the root. A second lockfile inside a workspace means npm was run from the wrong directory and the install is not reproducible.

- [ ] **Step 5: Push and open the PR**

```bash
git push -u origin monorepo/workspaces
```

PR body should state: what moved, the two substantive changes (tokens split, bundle repointing), the Task 1 spike result and which install form is in `amplify.yml`, that `amplify.storybook.yml` is deleted as dead config, and the empty before/after diff as evidence this was a move.

- [ ] **Step 6: Hand the console work to the user**

After merge, the user must:
1. edit the **existing** portfolio Amplify app: mark it a monorepo, set app root to `apps/portfolio`;
2. create a **second** app on the same repo: monorepo, app root `packages/design-system`;
3. attach a subdomain to the second app.

**Warn explicitly:** step 1 changes the live site's deployment. The first build after the merge will fail if the app root is not set, because `amplify.yml` no longer has a top-level `frontend` block. Set the app root before or immediately after merging.

---

## Status

| Task | State |
| --- | --- |
| 1 Amplify spike | not started — **blocking, needs the user** |
| 2 Structural move | not started |
| 3 Tokens split | not started |
| 4 Bundle repointing | not started |
| 5 Test projects | not started |
| 6 amplify.yml | not started |
| 7 Static guard | not started |
| 8 Docs | not started |
| 9 Verify and PR | not started |

**Task 1's answer, once known:** _to be recorded here._

## Out of scope

- The finance, todo and job-search apps. The layout accepts them at `apps/*` without another restructure.
- Turborepo, pnpm, CI task caching.
- Publishing the package to a registry.
- Any visual or behavioural change to the portfolio.
