import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const appCss = readFileSync(path.join(srcDir, 'App.module.css'), 'utf8')

function moduleStylesheets(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return moduleStylesheets(full)
    return entry.endsWith('.module.css') ? [full] : []
  })
}

/**
 * This pipeline scopes ids as well as class names, so `#home` in a CSS Module
 * compiles to `#App-module_home_4GdE4` and matches nothing in the rendered
 * markup — with no error at build time and no styling at runtime. Screens are
 * keyed on `data-screen` instead. This test is what keeps an id selector from
 * quietly creeping back in.
 */
describe('css modules', () => {
  it.each(moduleStylesheets(srcDir).map((file) => [path.relative(srcDir, file), file]))(
    '%s uses no id selectors',
    (_name, file) => {
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      // Only the selector text — the part before each `{` — so hex colors in
      // declaration values are never mistaken for id selectors.
      const selectors = [...css.matchAll(/([^{}]*)\{/g)]
        .map((match) => match[1].trim())
        .filter((selector) => !selector.startsWith('@'))
      const withIds = selectors.filter((selector) => /#[a-zA-Z][\w-]*/.test(selector))
      expect(withIds).toEqual([])
    },
  )
})

/**
 * Routing is entirely `:target` plus `:has()`. Each screen therefore has to be
 * reachable by the attribute the stylesheet matches on, and Home needs its
 * "nothing is targeted" fallback or the app opens to a blank page.
 */
describe('screen routing', () => {
  it.each(['home', 'work', 'career', 'about'])('lights the %s tab for its screen', (screen) => {
    expect(appCss).toContain(`[data-tab='${screen}']`)
  })

  it('falls back to Home when no screen is targeted', () => {
    expect(appCss).toContain(":not(:has(section:target)) [data-screen='home']")
  })

  it('keeps Work active on a detail screen', () => {
    expect(appCss).toContain(':has(section[data-detail]:target)')
  })

  it('hides screens by default so only the targeted one shows', () => {
    expect(appCss).toMatch(/\.viewport > section \{[^}]*display: none/)
  })

  /*
   * Screens fake state with `position: absolute` radios and checkboxes. An
   * absolute box is clipped by its containing block, so without one on the
   * scroller those inputs are laid out against the page, the document grows to
   * reach the deepest one and the shell scrolls out from under the tab bar.
   */
  it('makes the scroller the containing block for the hidden inputs', () => {
    expect(appCss).toMatch(/\.viewport \{[^}]*position: relative/)
  })
})
