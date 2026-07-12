import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// Test/Storybook config lives in vitest.config.ts so the production build
// (`tsc -b && vite build`) never loads the Vitest/Storybook/Playwright tooling.
export default defineConfig({
  plugins: [react()],
});
