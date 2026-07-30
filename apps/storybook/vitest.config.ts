/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Runs every story in the design-system package as a browser test.
export default defineConfig({
  plugins: [
    react(),
    storybookTest({ configDir: path.join(dirname, '.storybook') }),
  ],
  // @storybook/addon-vitest's setup file pulls in the Testing Library stack,
  // which is CommonJS several levels down (aria-query, lz-string,
  // pretty-format). Without pre-bundling, Vite's browser mode serves those raw
  // and the named imports fail — taking every story file down with them.
  //
  // Naming the two parents rather than each CJS leaf: esbuild bundles a
  // package's own dependencies into its optimized output.
  optimizeDeps: {
    include: ['@testing-library/jest-dom', '@testing-library/dom'],
  },
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' }],
    },
  },
});
