/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plain node tests. These mostly guard the CSS-only tab and filter machinery:
// the rules live in stylesheets but the values they key off come from
// TypeScript, and a mismatch fails silently in the browser.
//
// The Storybook browser project lives in apps/storybook, with the config that
// hosts the stories.
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'portfolio-site',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
