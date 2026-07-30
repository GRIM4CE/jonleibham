import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // The stories live beside their components in the design-system package.
  // This app only hosts them, so nothing here owns a story of its own.
  "stories": [
    "../../../packages/design-system/src/**/*.mdx",
    "../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite"
};
export default config;
