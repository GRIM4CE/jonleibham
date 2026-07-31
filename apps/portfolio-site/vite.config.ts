import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// Test/Storybook config lives in vitest.config.ts so the production build
// (`tsc -b && vite build`) never loads the Vitest/Storybook/Playwright tooling.
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // The client pass writes the stylesheet and the SSR pass writes the
      // markup, so both have to agree on every scoped class name. Vite's
      // default is already deterministic, but pinning it makes that a
      // guarantee rather than an implementation detail — a mismatch would
      // ship a page with no styles at all.
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
});
