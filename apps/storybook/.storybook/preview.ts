import type { Preview } from '@storybook/react-vite'
import '@jonleibham/design-system/tokens.css'
import { dossierDark } from './theme'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    /*
     * Docs pages render inside the preview iframe, so `manager.ts`'s theme does
     * not reach them — they need the same theme set again here. Without it the
     * prose and prop tables came back white around examples drawn on #1a0f16.
     */
    docs: {
      theme: dossierDark,
    },

    /*
     * Every component here is built for the dark ground — gold on #1a0f16,
     * with `color-scheme: dark` set in index.css. On the addon's default white
     * canvas the pale text and hairlines are close to invisible, so the ground
     * is set once here rather than per story.
     *
     * `options` + `initialGlobals`, not the older `default` + `values`: that
     * shape stopped being read in Storybook 9 and was silently doing nothing.
     */
    backgrounds: {
      options: {
        ground: { name: 'Ground', value: '#1a0f16' },
        raised: { name: 'Raised', value: '#241521' },
        surface: { name: 'Surface', value: '#2e1d26' },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  initialGlobals: {
    backgrounds: { value: 'ground' },
  },
};

export default preview;