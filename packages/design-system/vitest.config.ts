/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Source-reading guards: the tone class table, the design-card coverage, the
// no-id-selector rule and the static-package rule. The stories themselves run
// in the browser under apps/storybook.
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'design-system',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
