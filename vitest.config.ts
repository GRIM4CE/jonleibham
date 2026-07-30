/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Vitest + Storybook browser-test config, kept out of vite.config.ts so the
// production build never pulls in this dev-only tooling.
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [{
      // Plain node tests. These mostly guard the CSS-only tab and filter
      // machinery: the rules live in stylesheets but the values they key off
      // come from TypeScript, and a mismatch fails silently in the browser.
      extends: true,
      test: {
        name: 'unit',
        environment: 'node',
        include: ['src/**/*.test.ts'],
      },
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      // @storybook/addon-vitest's setup file pulls in the Testing Library
      // stack, which is CommonJS several levels down (aria-query, lz-string,
      // pretty-format). Vite's browser mode was serving those raw, so the
      // named imports failed and took every story file down with them.
      //
      // Naming the two parents rather than each CJS leaf: esbuild bundles a
      // package's own dependencies into its optimized output, so this covers
      // the subtree instead of chasing one module at a time.
      optimizeDeps: {
        include: ['@testing-library/jest-dom', '@testing-library/dom'],
      },
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
