import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The apps compile this package from source, so this build is NOT in their
// dependency chain. It exists only to emit one standalone stylesheet and the
// SSR entry that scripts/build-design-bundle.mjs renders the Claude Design
// cards from.
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // MUST match apps/portfolio-site/vite.config.ts. The design bundle takes
      // its markup from this build and its stylesheet from the same one, but a
      // drift between the two configs would also desync the app's markup from
      // the app's stylesheet.
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
  },
  build: {
    // One stylesheet, not one per chunk — every card links a single styles.css.
    cssCodeSplit: false,
    lib: {
      entry: 'src/entry-design.tsx',
      formats: ['es'],
      fileName: () => 'entry-design.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    },
  },
})
