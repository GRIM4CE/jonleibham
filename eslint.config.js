// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores([
  // Build output. `storybook-static` holds minified vendor bundles that
  // account for most of the noise; the rest are this repo's own artifacts.
  //
  // Every pattern is `**/`-prefixed. A bare `dist` is anchored to the
  // directory holding this config, which was the repo root before the
  // workspaces split and is now nowhere near the output — a Storybook build
  // then put 13 errors into `npm run lint` from inside its own vendor bundle.
  '**/dist',
  '**/dist-ssr',
  '**/dist-design',
  '**/design-bundle',
  '**/storybook-static',
  // Agent scratch space. It holds git worktrees — full copies of this repo,
  // tsconfig included — and a second candidate root makes `tsconfigRootDir`
  // ambiguous, which fails the parse for every TypeScript file in the project.
  '.claude',
]), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
}, ...storybook.configs["flat/recommended"]])
