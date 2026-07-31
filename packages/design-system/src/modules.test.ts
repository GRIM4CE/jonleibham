import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

function moduleStylesheets(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return moduleStylesheets(full)
    return entry.endsWith('.module.css') ? [full] : []
  })
}

/** Every component source here — stories and tests excluded. */
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
 * The build scopes ids as well as class names, so `#home` in a CSS Module
 * compiles to `#Name-module_home_4GdE4` and matches nothing in the rendered
 * markup — no build error, no styling. The app has the same guard in
 * `App.test.ts`; its directory walk cannot see this package, so the rule needs
 * enforcing on both sides of the workspace boundary.
 */
describe('css modules', () => {
  it.each(moduleStylesheets(srcDir).map((file) => [path.relative(srcDir, file), file]))(
    '%s uses no id selectors',
    (_name, file) => {
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      const selectors = [...css.matchAll(/([^{}]*)\{/g)]
        .map((match) => match[1].trim())
        .filter((selector) => !selector.startsWith('@'))
      expect(selectors.filter((selector) => /#[a-zA-Z][\w-]*/.test(selector))).toEqual([])
    },
  )
})

/**
 * The portfolio prerenders to static HTML with no client bundle, and
 * `scripts/prerender.mjs` fails its build if a script tag, an inline handler or
 * a style attribute survives. That guard only covers the app — nothing
 * otherwise stops this package growing a hook and breaking its consumer at
 * build time, which is exactly when a shared library is least able to afford it.
 *
 * Interactivity here is CSS: `Tabs` renders a hidden radio group and consumers
 * reveal content with `:has(input[value='…']:checked)`.
 */
describe('the package stays static', () => {
  const files = componentSources(srcDir).map((file) => [path.relative(srcDir, file), file] as const)
  const HOOKS = ['useState', 'useEffect', 'useRef', 'useReducer', 'useCallback', 'useMemo']

  it.each(files)('%s uses no React hooks', (_name, file) => {
    const source = readFileSync(file, 'utf8')
    expect(HOOKS.filter((hook) => new RegExp(`\\b${hook}\\s*\\(`).test(source))).toEqual([])
  })

  it.each(files)('%s attaches no event handlers', (_name, file) => {
    expect(readFileSync(file, 'utf8').match(/\son[A-Z][a-zA-Z]+=\{/g) ?? []).toEqual([])
  })

  it.each(files)('%s sets no inline style attribute', (_name, file) => {
    expect(readFileSync(file, 'utf8').match(/\sstyle=\{/g) ?? []).toEqual([])
  })
})
